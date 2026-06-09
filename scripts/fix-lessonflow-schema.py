#!/usr/bin/env python3
"""
Corrige os passos do Teacher's Guide que apareciam EM BRANCO no app.

Causa: o lessonFlow tinha dois schemas de passo. O render (components/LessonView.jsx)
lê s.what / s.duration / s.instructions, mas 23 lições (essentials/rise/apex) usavam
s.title / s.time / s.description — então o corpo do passo ficava vazio e o título caía
no genérico "Passo N".

Correção (dados, sem mexer no render): renomeia title->what, time->duration,
description->instructions nos passos que ainda não têm 'what'. Preserva 'step'.

Seguro/aditivo e idempotente: só altera passos no schema antigo; re-rodar não muda nada.
"""
import json, os

HERE = os.path.dirname(os.path.abspath(__file__))
COURSE = os.path.join(HERE, "..", "courses", "czarnikow", "course.json")

MAP = {"title": "what", "time": "duration", "description": "instructions"}


def main():
    with open(COURSE, encoding="utf-8") as f:
        d = json.load(f)

    steps_fixed = 0
    lessons_fixed = 0
    for l in d["lessons"]:
        lf = (l.get("teacherGuide") or {}).get("lessonFlow")
        if not isinstance(lf, list):
            continue
        touched = False
        for s in lf:
            if not isinstance(s, dict) or "what" in s:
                continue
            if not any(k in s for k in MAP):
                continue
            new = {"step": s.get("step")}
            for old, key in MAP.items():
                if old in s:
                    new[key] = s[old]
            # preserva quaisquer outras chaves que não sejam as antigas mapeadas
            for k, v in s.items():
                if k not in MAP and k not in new:
                    new[k] = v
            s.clear()
            s.update(new)
            steps_fixed += 1
            touched = True
        if touched:
            lessons_fixed += 1

    with open(COURSE, "w", encoding="utf-8") as f:
        json.dump(d, f, ensure_ascii=False, indent=1)
    print(f"normalizados {steps_fixed} passos em {lessons_fixed} lições (esperado ~23 lições).")


if __name__ == "__main__":
    main()
