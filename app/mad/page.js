import Link from 'next/link';
import { getCourse } from '../../lib/courses';

export const metadata = {
  title: 'Yes We Are Mad × Alumni — English Hub',
  description: 'Inglês para times criativos, de marketing, tecnologia, atendimento e produção. Comunicação internacional para o ambiente MAD.',
};

const LEVEL_BADGE = {
  'Básico': { bg: 'rgba(56,224,140,.12)', fg: '#38e08c', label: 'Básico · forte apoio em PT' },
  'Intermediário': { bg: 'rgba(255,138,0,.12)', fg: '#ff8a00', label: 'Intermediário · menos PT' },
  'Avançado': { bg: 'rgba(255,74,74,.12)', fg: '#ff4a4a', label: 'Avançado · imersão total' },
};

const BLURB = {
  creative: 'Branding, campanhas, motion e direção de arte — a linguagem visual da MAD em inglês.',
  marketing: 'SEO, paid media, performance e growth — o vocabulário real de agência.',
  tech: 'Front, back, deploy e daily — comunicação ágil para devs e product.',
  accounts: 'Briefings, status calls e timelines — gestão de clientes internacionais.',
  production: 'Pré-produção, set, post e experiências imersivas — incluindo MAD Arts.',
};

export default function MadHub() {
  const course = getCourse('mad');
  const depts = course?.meta?.departments || [];

  return (
    <div className="mad-root">
      <style>{`
        @font-face { font-family:'MADSans'; src:url('/fonts/mad/MADSans-Regular.otf') format('opentype'); font-weight:400; font-display:swap; }
        @font-face { font-family:'MADSans'; src:url('/fonts/mad/MADSans-Light.otf') format('opentype'); font-weight:300; font-display:swap; }
        @font-face { font-family:'MADSans'; src:url('/fonts/mad/MADSans-Bold.otf') format('opentype'); font-weight:700; font-display:swap; }
        .mad-root { min-height:100vh; background:#000; color:#fff; font-family:'MADSans',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif; overflow-x:hidden; }
        .mad-root * { box-sizing:border-box; }
        .mad-glow { position:fixed; inset:0; z-index:0; pointer-events:none; background:
          radial-gradient(60vw 60vw at 12% -10%, rgba(39,7,255,.22), transparent 60%),
          radial-gradient(50vw 50vw at 100% 0%, rgba(129,42,246,.16), transparent 55%),
          radial-gradient(50vw 50vw at 80% 115%, rgba(255,138,0,.10), transparent 55%); }
        .mad-wrap { position:relative; z-index:1; max-width:1120px; margin:0 auto; padding:0 24px; }
        .mad-top { display:flex; align-items:center; gap:12px; height:64px; border-bottom:1px solid rgba(255,255,255,.1); font-weight:700; letter-spacing:-.02em; }
        .mad-dot { width:12px; height:12px; border-radius:50%; background:linear-gradient(90deg,#2707ff,#812af6,#ff4a4a,#ff8a00); box-shadow:0 0 16px rgba(255,74,74,.6); }
        .mad-top small { font-weight:300; color:#969696; }
        .mad-hero { padding:72px 0 26px; }
        .mad-eyebrow { display:inline-flex; align-items:center; gap:10px; font-size:13px; letter-spacing:.18em; text-transform:uppercase; color:#cdcdcd; border:1px solid rgba(255,255,255,.1); border-radius:999px; padding:7px 16px; margin-bottom:26px; }
        .mad-pulse { width:7px; height:7px; border-radius:50%; background:#ff4a4a; box-shadow:0 0 12px #ff4a4a; }
        .mad-h1 { font-weight:700; letter-spacing:-.035em; line-height:.98; font-size:clamp(40px,8vw,88px); margin:0; }
        .mad-grad { background:linear-gradient(90deg,#2707ff,#812af6,#ff4a4a,#ff8a00); -webkit-background-clip:text; background-clip:text; color:transparent; }
        .mad-lead { color:#cdcdcd; max-width:640px; font-size:clamp(16px,2vw,19px); font-weight:300; margin-top:22px; }
        .mad-meta { display:flex; gap:26px; flex-wrap:wrap; margin-top:28px; color:#969696; font-size:14px; }
        .mad-meta b { color:#fff; font-weight:700; }
        .mad-sectitle { font-size:13px; letter-spacing:.18em; text-transform:uppercase; color:#969696; margin:48px 0 18px; }
        .mad-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(330px,1fr)); gap:20px; padding-bottom:40px; }
        .mad-card { position:relative; display:block; padding:28px; background:linear-gradient(180deg,#121212,#0a0a0a); border:1px solid rgba(255,255,255,.1); border-radius:18px; overflow:hidden; text-decoration:none; color:#fff; transition:transform .25s ease, border-color .25s ease; }
        .mad-card:hover { transform:translateY(-4px); border-color:rgba(255,255,255,.25); }
        .mad-bar { position:absolute; left:0; top:0; bottom:0; width:4px; }
        .mad-num { font-size:13px; font-weight:700; letter-spacing:.05em; }
        .mad-card h3 { font-size:22px; font-weight:700; letter-spacing:-.02em; margin:12px 0 6px; }
        .mad-sub { color:#969696; font-size:14px; min-height:42px; }
        .mad-mod { margin:16px 0 18px; font-size:13px; color:#cdcdcd; }
        .mad-mod b { color:#fff; }
        .mad-foot { display:flex; align-items:center; justify-content:space-between; margin-top:8px; }
        .mad-badge { font-size:12px; font-weight:700; padding:6px 12px; border-radius:999px; }
        .mad-go { display:inline-flex; align-items:center; gap:8px; font-weight:700; font-size:14px; }
        .mad-foot-bar { border-top:1px solid rgba(255,255,255,.1); padding:28px 0 50px; color:#969696; font-size:13px; margin-top:24px; }
        .mad-note { color:#8a8a95; font-size:12.5px; margin:6px 0 30px; }
      `}</style>
      <div className="mad-glow" />

      <div className="mad-wrap">
        <div className="mad-top">
          <span className="mad-dot" />
          <span>YES WE ARE MAD <small>× Alumni · English Hub</small></span>
        </div>
      </div>

      <section className="mad-wrap mad-hero">
        <span className="mad-eyebrow"><span className="mad-pulse" /> English Hub · feito sob medida para a MAD</span>
        <h1 className="mad-h1">Comunicação<br /><span className="mad-grad">que levanta a régua.</span></h1>
        <p className="mad-lead">Não é “Business English” genérico. É inglês para o ambiente criativo, técnico e de agência da Yes We Are Mad — pitch, briefing, daily, review e clientes internacionais. Escolha o time e comece pelo primeiro módulo.</p>
        <div className="mad-meta">
          <span><b>5</b> trilhas por departamento</span>
          <span><b>3</b> níveis (básico → avançado)</span>
          <span><b>PT → EN</b> apoio que diminui a cada nível</span>
        </div>
      </section>

      <section className="mad-wrap">
        <div className="mad-sectitle">Escolha o seu departamento</div>
        <p className="mad-note">Nesta fase, o <b style={{ color: '#fff' }}>Módulo 1</b> de cada trilha está liberado. Os demais entram conforme a parceria avança.</p>
        <div className="mad-grid">
          {depts.map((d, i) => {
            const badge = LEVEL_BADGE[d.level] || LEVEL_BADGE['Básico'];
            return (
              <Link key={d.id} href={`/mad/lesson/${i + 1}`} className="mad-card">
                <span className="mad-bar" style={{ background: d.accent }} />
                <span className="mad-num" style={{ color: d.accent }}>{String(i + 1).padStart(2, '0')}</span>
                <h3>{d.name}</h3>
                <div className="mad-sub">{BLURB[d.id] || ''}</div>
                <div className="mad-mod">Módulo 01 · <b>{d.module}</b></div>
                <div className="mad-foot">
                  <span className="mad-badge" style={{ background: badge.bg, color: badge.fg }}>{d.level}</span>
                  <span className="mad-go" style={{ color: d.accent }}>Começar →</span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <div className="mad-wrap">
        <div className="mad-foot-bar">Yes We Are Mad × Alumni by Better — English Hub · demo de negociação (v0.1.0)</div>
      </div>
    </div>
  );
}
