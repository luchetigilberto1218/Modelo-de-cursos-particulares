'use client';

import Link from 'next/link';
import { useTeacher, setTeacher } from './access';

/**
 * Navegação da barra de topo, sensível ao contexto:
 * - Modo professor: "Todos os alunos" + "Professor" + indicador/Sair.
 * - Aluno (área do aluno, sem ser professor): SEM botões de topo — o aluno
 *   navega pelos botões dentro da página (voltar, todas as lições).
 * - Landing/Professor (fora da área do aluno): só o link "Professor" (entrada).
 */
export default function TopNav({ showHome = false, student = false }) {
  const teacher = useTeacher();

  if (teacher) {
    return (
      <>
        {showHome && <Link href="/racional" className="rc-topbar-link">Todos os alunos</Link>}
        <Link href="/racional/professor" className="rc-topbar-link">Professor</Link>
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
      </>
    );
  }

  // Aluno: sem botões de topo.
  if (student) return null;

  // Landing / Professor: entrada para o professor.
  return <Link href="/racional/professor" className="rc-topbar-link">Professor</Link>;
}
