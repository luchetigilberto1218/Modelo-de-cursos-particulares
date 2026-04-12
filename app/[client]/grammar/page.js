import { redirect } from 'next/navigation';
import { getCourse, getTheme } from '../../../lib/courses';
import NavBar from '../../../components/NavBar';
import Link from 'next/link';

export default async function GrammarPage({ params }) {
  const { client } = await params;

  const course = getCourse(client);
  const theme = getTheme(client);
  if (!course) redirect('/');

  const modules = course.modules;

  function getModuleIndex(lessonNum) {
    for (let i = 0; i < modules.length; i++) {
      if (lessonNum > modules[i].range[0] && lessonNum <= modules[i].range[1]) return i + 1;
    }
    return 1;
  }

  return (
    <>
      <NavBar user={null} theme={theme} clientId={client} />
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '48px 24px 80px' }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <h1 style={{ fontSize: 32, fontWeight: 700, color: 'var(--navy)', marginBottom: 8 }}>
            Grammar Reference
          </h1>
          <p style={{ color: 'var(--gray)', fontSize: 15 }}>
            All grammar points organized by lesson
          </p>
          <div style={{ width: 40, height: 3, background: 'var(--navy)', borderRadius: 2, margin: '16px auto 0' }} />
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'var(--navy)', color: 'var(--white)' }}>
              <th style={{ padding: '14px 20px', textAlign: 'left', fontSize: 12, fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase' }}>Lesson</th>
              <th style={{ padding: '14px 20px', textAlign: 'left', fontSize: 12, fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase' }}>Grammar Point</th>
              <th style={{ padding: '14px 20px', textAlign: 'left', fontSize: 12, fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase' }}>Module</th>
            </tr>
          </thead>
          <tbody>
            {course.lessons.map((lesson) => (
              <tr key={lesson.num} style={{ borderBottom: '1px solid var(--gray-light)', background: lesson.num % 2 === 0 ? 'var(--off-white)' : 'var(--white)' }}>
                <td style={{ padding: '12px 20px', fontWeight: 700, fontSize: 15, color: 'var(--navy)' }}>
                  <Link href={`/${client}/lesson/${lesson.num}`} style={{ color: 'var(--navy)', textDecoration: 'none' }}>
                    {String(lesson.num).padStart(2, '0')}
                  </Link>
                </td>
                <td style={{ padding: '12px 20px', fontSize: 14 }}>
                  <Link href={`/${client}/lesson/${lesson.num}`} style={{ color: 'var(--text)', textDecoration: 'none' }}>
                    {lesson.grammar}
                  </Link>
                </td>
                <td style={{ padding: '12px 20px', fontSize: 14, color: 'var(--gray)' }}>
                  Module {getModuleIndex(lesson.num)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div style={{ textAlign: 'center', marginTop: 32 }}>
          <Link href={`/${client}`} className="btn btn-outline">Back to Dashboard</Link>
        </div>
      </div>
    </>
  );
}
