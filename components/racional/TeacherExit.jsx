'use client';

import { useTeacher, setTeacher } from './access';

/**
 * Indicador + saída do modo professor, fixo na barra de topo.
 * Só aparece quando o modo professor está ativo — assim o professor pode
 * sair de QUALQUER página, não só da /racional/professor.
 */
export default function TeacherExit() {
  const teacher = useTeacher();
  if (!teacher) return null;
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
      <span style={{
        fontSize: 11, fontWeight: 700, letterSpacing: 0.5, color: '#CB142D',
        border: '1px solid #CB142D', borderRadius: 999, padding: '2px 8px', whiteSpace: 'nowrap',
      }}>MODO PROFESSOR</span>
      <button
        type="button"
        onClick={() => setTeacher(false)}
        className="rc-topbar-link"
        style={{ background: 'none', border: 'none', cursor: 'pointer', font: 'inherit', color: 'inherit', textDecoration: 'underline', padding: 0 }}
        title="Sair do modo professor"
      >
        Sair
      </button>
    </span>
  );
}
