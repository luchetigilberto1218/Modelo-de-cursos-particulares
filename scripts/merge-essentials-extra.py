#!/usr/bin/env python3
"""
Aplica o BANCO DE EXERCÍCIOS EXTRAS (teacherGuide.extraPractice) às 180 lições
Essentials da Czarnikow, lendo o conteúdo autoral de scripts/essentials_extra/<track>.json.

Conteúdo gerado pelo workflow scripts/wf-essentials-extra.js (1 agente por track,
exercícios sob medida para a gramática + tema de cada lição, nível A1–A2, com gabarito).

Seguro/aditivo: só escreve teacherGuide.extraPractice das lições essentials.
Idempotente: re-rodar sobrescreve com o conteúdo atual dos arquivos por track.
"""
import json, os, glob

HERE = os.path.dirname(os.path.abspath(__file__))
COURSE = os.path.join(HERE, "..", "courses", "czarnikow", "course.json")
EXTRA = os.path.join(HERE, "essentials_extra")


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
        if l.get("level") != "essentials":
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
    print(f"extraPractice aplicado em {changed} lições essentials (esperado 180).")


if __name__ == "__main__":
    main()
