#!/usr/bin/env python3
"""
Aplica o BANCO DE EXERCÍCIOS EXTRAS avançado (teacherGuide.extraPractice, 6 blocos B1-B2)
às 180 lições RISE da Czarnikow, lendo scripts/rise_extra/<track>.json.

Conteúdo gerado pelo workflow scripts/wf-rise-extra.js (1 agente por track). 6 blocos por
lição: Open cloze, Key word transformation, Multiple-choice cloze, Error correction,
Collocations & vocabulary, Discuss — tipologia Oxford/Cambridge "Use of English" + Racional.

Seguro/aditivo: só escreve teacherGuide.extraPractice das lições rise. Idempotente.
"""
import json, os, glob

HERE = os.path.dirname(os.path.abspath(__file__))
COURSE = os.path.join(HERE, "..", "courses", "czarnikow", "course.json")
EXTRA = os.path.join(HERE, "rise_extra")


def main():
    data = {}
    for f in glob.glob(os.path.join(EXTRA, "*.json")):
        track = os.path.basename(f)[:-5]
        with open(f, encoding="utf-8") as fh:
            data[track] = {int(k): v for k, v in json.load(fh).items()}

    with open(COURSE, encoding="utf-8") as f:
        d = json.load(f)

    changed = 0
    for l in d["lessons"]:
        if l.get("level") != "rise":
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
    print(f"extraPractice aplicado em {changed} lições rise (esperado 180).")


if __name__ == "__main__":
    main()
