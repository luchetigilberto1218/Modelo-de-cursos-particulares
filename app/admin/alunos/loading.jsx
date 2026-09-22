// Aparece na hora enquanto o servidor lê o progresso de todas as empresas.
export default function Carregando() {
  return (
    <main style={{ background: '#f4f5f7', minHeight: '100vh', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ background: 'linear-gradient(135deg, #0a1d52, #102a71)', height: 88, borderBottom: '3px solid #cb142d' }} />
      <div style={{ maxWidth: 1120, margin: '0 auto', padding: '40px 24px', color: '#5b6275', fontSize: 15 }}>
        Lendo o progresso das turmas…
      </div>
    </main>
  );
}
