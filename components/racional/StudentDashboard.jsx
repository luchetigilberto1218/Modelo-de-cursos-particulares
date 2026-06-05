import Link from 'next/link';
import { RacionalTopBar, RacionalFooter } from './RacionalChrome';
import CurriculumProgress from './CurriculumProgress';
import Icon from './RacionalIcon';
import ContinueCTA from './ContinueCTA';

export default function StudentDashboard({ course }) {
  const { meta } = course;
  const maxCount = Math.max(...course.distribution.map((d) => d.count || 0), 1);

  return (
    <>
      <RacionalTopBar showHome student />

      {/* HERO */}
      <section className="rc-dash-hero" style={{ background: `linear-gradient(135deg, ${meta.accent} 0%, #1C2230 120%)` }}>
        <div className="rc-dash-hero-bg" style={{ backgroundImage: `url(${meta.hero})` }} />
        <div className="rc-dash-hero-inner rc-wrap">
          <Link href="/racional" className="rc-back">← Todos os alunos</Link>
          <div className="rc-dash-headrow">
            <div className="rc-dash-id">
              <div className="rc-dash-role">{meta.role}</div>
              <h1>{meta.studentName}</h1>
              <div className="rc-dash-sub">
                <span className="rc-level-badge">{meta.cefr} · Essential {meta.essential}</span>
                <span>{meta.universe}</span>
              </div>
            </div>
            <div className="rc-dash-statcol">
              <div className="rc-dash-stats">
                <div className="rc-dash-stat"><b>{meta.totalLessons}</b><span>Aulas</span></div>
                <div className="rc-dash-stat"><b>{meta.totalModules}</b><span>Módulos</span></div>
                <div className="rc-dash-stat"><b>{course.capstoneDetail.length}</b><span>Capstone</span></div>
              </div>
              <Link href={`/racional/${course.id}/vocabulario`} className="rc-dash-action rc-dash-action-glossary"><Icon name="book" size={15} /> Glossário</Link>
            </div>
          </div>
          <div className="rc-dash-cta-row">
            <ContinueCTA studentId={course.id} accent={meta.accent} lessons={course.lessons.map((l) => ({ num: l.num, title: l.title }))} />
          </div>
        </div>
      </section>

      <div className="rc-wrap" style={{ padding: '40px 24px 10px' }}>

        {/* VISÃO GERAL */}
        <div className="rc-card">
          <div className="rc-h">Visão geral do programa</div>
          <p className="rc-prose">{course.overview}</p>
          {meta.particularity && (
            <div className="rc-particularity"><b>Particularidade de {meta.studentName.split(' ')[0]} · </b>{meta.particularity}</div>
          )}
        </div>

        {/* DISTRIBUIÇÃO */}
        <div className="rc-card">
          <div className="rc-h">Distribuição dos módulos</div>
          {course.distribution.map((d) => (
            <div key={d.code} className="rc-dist-row">
              <div className="rc-dist-code">{d.code}</div>
              <div className="rc-dist-name">{d.name}</div>
              <div className="rc-dist-bar">
                <div className="rc-dist-fill" style={{ width: `${(d.count / maxCount) * 100}%`, background: d.color }} />
              </div>
              <div className="rc-dist-n">{d.count}</div>
            </div>
          ))}
        </div>

        {/* LÓGICA + LEGENDA (recolhível) */}
        <details className="rc-card rc-foldable">
          <summary>
            <span className="rc-h">{course.logicHeading || 'Lógica pedagógica'}</span>
            <span className="rc-fold-hint">entenda a estrutura do curso</span>
            <span className="rc-module-chev">›</span>
          </summary>
          <div className="rc-foldable-body">
            <p className="rc-prose" style={{ marginBottom: 22 }}>{course.logic}</p>
            <div className="rc-h" style={{ marginTop: 8 }}>Legenda dos marcadores</div>
            <div className="rc-legend">
              {course.legend.map((lg, i) => (
                <div key={i} className="rc-legend-item">
                  <span className="rc-badge" style={{ background: lg.color }}>{lg.type}</span>
                  <span className="rc-legend-desc">{lg.desc}</span>
                </div>
              ))}
            </div>
          </div>
        </details>

        {/* CAPSTONE (recolhível + explicação) */}
        {course.capstoneDetail.length > 0 && (
          <details className="rc-card rc-foldable">
            <summary>
              <span className="rc-h">Capstone · detalhamento dos cenários</span>
              <span className="rc-fold-hint">{course.capstoneDetail.length} projetos finais</span>
              <span className="rc-module-chev">›</span>
            </summary>
            <div className="rc-foldable-body">
              <p className="rc-prose" style={{ marginBottom: 18 }}>
                O <strong>Capstone</strong> é o projeto final de cada bloco: um cenário realista e completo em que {meta.studentName.split(' ')[0]} aplica, de ponta a ponta, tudo o que aprendeu — simulando uma situação de trabalho de verdade. É o momento de provar a comunicação na prática, não mais aula a aula.
              </p>
              {course.capstoneDetail.map((c) => (
                <div key={c.num} className="rc-cap">
                  <div className="rc-cap-num">{c.num}</div>
                  <div>
                    <div className="rc-cap-title">{c.title}</div>
                    <div className="rc-cap-scenario">{c.scenario}</div>
                  </div>
                </div>
              ))}
            </div>
          </details>
        )}

        {/* Bônus de leitura agora vivem DENTRO das aulas (a cada 2 lições, em inglês). */}

        {/* CURRÍCULO + MAPA (com progresso do aluno) */}
        <CurriculumProgress course={course} />

      </div>
      <RacionalFooter />
    </>
  );
}
