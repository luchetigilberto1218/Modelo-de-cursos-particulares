#!/usr/bin/env python3
"""
Aplica o BANCO DE EXERCÍCIOS EXTRAS C1-C2 (teacherGuide.extraPractice, 6 blocos avançados)
às 180 lições APEX da Czarnikow, lendo scripts/apex_extra/<track>.json.

Conteúdo gerado pelo workflow scripts/wf-apex-extra.js (1 agente por track). 6 blocos por
lição: Open cloze avançado, Key word transformation, Register/paraphrase, Error correction,
Advanced collocations & lexis, Discuss/Argue — tipologia Oxford Practice Grammar Advanced +
Cambridge C1/C2 "Use of English" + Racional. Estruturas: nominalisation, inversion, cleft,
participle clauses, mixed conditionals, formal passive, subjunctive.

Seguro/aditivo: só escreve teacherGuide.extraPractice das lições apex. Idempotente.
"""
import json, os, glob

HERE = os.path.dirname(os.path.abspath(__file__))
COURSE = os.path.join(HERE, "..", "courses", "czarnikow", "course.json")
EXTRA = os.path.join(HERE, "apex_extra")


def main():
    data = {}
    for f in glob.glob(os.path.join(EXTRA, "*.json")):
        track = os.path.basename(f)[:-5]
        if track.startswith("_"):
            continue
        with open(f, encoding="utf-8") as fh:
            data[track] = {int(k): v for k, v in json.load(fh).items()}

    with open(COURSE, encoding="utf-8") as f:
        d = json.load(f)

    changed = 0
    for l in d["lessons"]:
        if l.get("level") != "apex":
            continue
        blocks = data.get(l.get("track"), {}).get(l["num"])
        if not blocks:
            continue
        tg = l.get("teacherGuide")
        if not isinstance(tg, dict):
            tg = {}
            l["teacherGuide"] = tg
        tg["extraPractice"] = blocks
        changed += 1

    with open(COURSE, "w", encoding="utf-8") as f:
        json.dump(d, f, ensure_ascii=False, indent=1)
    print(f"extraPractice aplicado em {changed} lições apex (esperado 180).")


if __name__ == "__main__":
    main()
