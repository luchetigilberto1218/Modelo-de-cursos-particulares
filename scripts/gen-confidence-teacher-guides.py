#!/usr/bin/env python3
"""
Gera o teacherGuide.lessonFlow das 20 lições de Confidence / Logistics da Czarnikow.

Por que: só o nível 'confidence' (o mais básico, A1) estava com lessonFlow vazio, então
o "Teacher Guide" aparecia praticamente em branco no site. Este script monta um plano de
aula de 90 min REAL para cada lição, populado com o vocabulário, a gramática, os exercícios
(com gabarito) e as perguntas que JÁ existem em cada lição — nada é inventado fora do
conteúdo da própria lição. O tom é de mão-na-massa para o professor de aluno iniciante:
frases-modelo prontas e perguntas para fazer em voz alta.

Seguro/aditivo: só preenche teacherGuide.lessonFlow/overview das lições confidence/logistics
cujo lessonFlow está vazio. Não toca em mais nada. Idempotente.
"""
import json, re, sys, os, html

HERE = os.path.dirname(os.path.abspath(__file__))
COURSE = os.path.join(HERE, "..", "courses", "czarnikow", "course.json")


def strip_html(s):
    if not s:
        return ""
    s = re.sub(r"<br\s*/?>", "\n", s, flags=re.I)
    s = re.sub(r"</p>", "\n\n", s, flags=re.I)
    s = re.sub(r"<[^>]+>", "", s)
    s = html.unescape(s)
    s = re.sub(r"\n{3,}", "\n\n", s)
    return s.strip()


def en_title(t):
    # "What Is Logistics? — O Que É Logística" -> "What Is Logistics?"
    return t.split("—")[0].strip() if t else t


def vocab_line(v):
    en = v.get("en", "")
    pt = v.get("pt", "")
    return f"{en} = {pt}"


def build_flow(l):
    voc = [v for v in (l.get("vocab") or []) if isinstance(v, dict)]
    grammar = l.get("grammar", "")
    objective = l.get("objective", "")
    ex = l.get("exercises") or []
    ee = l.get("extendedExercises") or {}
    qa = ee.get("qAndA") or []
    roleplays = ee.get("rolePlays") or []
    takeaways = l.get("takeaways") or []
    wrapup = strip_html(l.get("wrapup"))
    gdetail = strip_html(l.get("grammarDetail"))
    title = l.get("title", "")
    teacher = l.get("characterName", "the teacher")
    et = en_title(title)

    # --- Passo 1: Aquecimento (10 min) ---
    s1 = (
        "OBJETIVO DE HOJE (diga em português, devagar): "
        f"{objective}\n\n"
        f"Escreva no quadro o título da aula: \"{et}\".\n\n"
        "Aquecimento sem pressão — pergunte em inglês, com sorriso, aceitando respostas "
        "de uma palavra:\n"
        "  • \"Hello! How are you today?\"\n"
        "  • \"Are you ready to start?\"\n"
        "  • \"Today: logistics. Easy and slow, ok?\"\n\n"
        "💛 Regra de ouro do nível Confidence: o aluno é iniciante. Fale devagar, repita, "
        "e elogie cada tentativa. Errar faz parte."
    )

    # --- Passo 2: Vocabulário (15 min) ---
    vlines = "\n".join("  • " + vocab_line(v) for v in voc)
    ex_examples = []
    for v in voc[:3]:
        if v.get("example"):
            ex_examples.append(f"  • {v['example']}")
    examples_block = ("\n\nLeia estes exemplos em voz alta (o aluno repete):\n" +
                      "\n".join(ex_examples)) if ex_examples else ""
    s2 = (
        f"Apresente as {len(voc)} palavras-chave. Para cada palavra: você diz, o aluno "
        "repete 2x, depois você dá a tradução.\n\n"
        f"{vlines}"
        f"{examples_block}\n\n"
        "Cheque o entendimento apontando/perguntando: \"What is this? (truck / warehouse...)\". "
        "Aceite a palavra solta — o importante é reconhecer."
    )

    # --- Passo 3: Gramática (15 min) ---
    g_examples = []
    for t in takeaways:
        if len(g_examples) >= 3:
            break
        if isinstance(t, str) and t.strip():
            g_examples.append("  • " + t.strip())
    g_block = ("\n\nFrases-modelo (escreva no quadro e leia junto):\n" +
               "\n".join(g_examples)) if g_examples else ""
    s3 = (
        f"Foco gramatical: {grammar}.\n\n"
        f"{gdetail}"
        f"{g_block}\n\n"
        "Drill rápido (5 min): você diz em português, o aluno tenta em inglês. Corrija com "
        "carinho e repita a forma certa em voz alta."
    )

    # --- Passo 4: Prática guiada / exercícios do app (20 min) ---
    ex_parts = []
    for i, e in enumerate(ex, 1):
        etitle = re.sub(r"^\s*\d+\.\s*", "", e.get("title", f"Exercício {i}"))
        line = f"  {i}. {etitle}"
        ans = e.get("answers")
        if isinstance(ans, list) and ans:
            line += "\n     Gabarito: " + "; ".join(a.strip() for a in ans)
        ex_parts.append(line)
    ex_block = "\n".join(ex_parts) if ex_parts else "  (use os exercícios da lição no app)"
    s4 = (
        "Façam JUNTOS os exercícios da lição (role a tela até a seção de exercícios). "
        "Deixe o aluno tentar primeiro, depois confira. Gabarito abaixo para você não "
        "precisar procurar:\n\n"
        f"{ex_block}\n\n"
        "Dica: se travar, dê a primeira letra ou leia a frase inteira pausando no espaço "
        "em branco para o aluno completar."
    )

    # --- Passo 5: Produção oral — perguntas + role-play (20 min) ---
    qa_lines = []
    for q in qa[:5]:
        if not isinstance(q, dict):
            continue
        qq = q.get("question", "")
        sa = q.get("sampleAnswer", "")
        qa_lines.append(f"  • Pergunte: \"{qq}\"\n     Resposta-modelo: {sa}")
    qa_block = "\n".join(qa_lines) if qa_lines else "  (faça perguntas simples sobre o tema)"
    rp_note = ""
    if roleplays and isinstance(roleplays[0], dict):
        rp = roleplays[0]
        rp_note = (
            f"\n\nDepois, façam o ROLE-PLAY da lição (\"{rp.get('title','Role-play')}\"): "
            "você faz um papel, o aluno faz o outro, depois troquem. Use o diálogo-modelo "
            "que aparece no app como apoio."
        )
    s5 = (
        "Hora de FALAR. Faça as perguntas abaixo em voz alta. Se o aluno travar, dê a "
        "resposta-modelo e peça para ele repetir e depois adaptar:\n\n"
        f"{qa_block}"
        f"{rp_note}"
    )

    # --- Passo 6: Fechamento (10 min) ---
    last_takeaway = takeaways[0] if takeaways else ""
    s6 = (
        "Fechamento positivo. Peça ao aluno para dizer UMA frase com o que aprendeu hoje "
        "(ex.: \"" + (last_takeaway or "I am part of the logistics team.") + "\").\n\n"
        "Feche com a afirmação de confiança: \"Today I can talk about " +
        et.rstrip("?").lower() + ".\"\n\n"
        + (f"Mensagem final para o aluno: {wrapup}\n\n" if wrapup else "") +
        "Lição de casa (2 min): reler as 5 palavras de hoje em voz alta amanhã de manhã."
    )

    return [
        {"step": 1, "duration": "10 min", "what": "Aquecimento e objetivo do dia", "instructions": s1},
        {"step": 2, "duration": "15 min", "what": "Vocabulário — palavras-chave", "instructions": s2},
        {"step": 3, "duration": "15 min", "what": f"Gramática — {grammar}", "instructions": s3},
        {"step": 4, "duration": "20 min", "what": "Prática guiada — exercícios (com gabarito)", "instructions": s4},
        {"step": 5, "duration": "20 min", "what": "Produção oral — perguntas e role-play", "instructions": s5},
        {"step": 6, "duration": "10 min", "what": "Fechamento — 'I can...'", "instructions": s6},
    ]


def build_overview(l):
    grammar = l.get("grammar", "")
    voc = [v for v in (l.get("vocab") or []) if isinstance(v, dict)]
    et = en_title(l.get("title", ""))
    n = len(voc)
    return (
        f"Aula do nível Confidence (A1, iniciante) da trilha Logistics. Tema: {et}. "
        f"Foco gramatical: {grammar}. O aluno aprende {n} palavras essenciais e as usa em "
        "frases curtas. Plano de 90 min abaixo, com frases-modelo, perguntas prontas e "
        "gabarito dos exercícios para o professor conduzir sem preparação extra."
    )


def main():
    with open(COURSE, encoding="utf-8") as f:
        d = json.load(f)

    changed = 0
    for l in d["lessons"]:
        if l.get("track") != "logistics" or l.get("level") != "confidence":
            continue
        tg = l.get("teacherGuide")
        if not isinstance(tg, dict):
            tg = {}
            l["teacherGuide"] = tg
        flow = tg.get("lessonFlow")
        if isinstance(flow, list) and len(flow) > 0:
            continue  # já preenchido — não sobrescreve
        tg["lessonFlow"] = build_flow(l)
        tg.setdefault("overview", build_overview(l))
        if not tg.get("overview"):
            tg["overview"] = build_overview(l)
        changed += 1

    if changed:
        with open(COURSE, "w", encoding="utf-8") as f:
            json.dump(d, f, ensure_ascii=False, indent=1)
    print(f"Atualizadas {changed} lições (confidence/logistics).")


if __name__ == "__main__":
    main()
