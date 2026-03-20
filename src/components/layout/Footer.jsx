export default function Footer() {
  return (
    <footer
      style={{
        borderTop: '1px solid var(--border)',
        padding: '2.5rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        maxWidth: '1100px',
        margin: '0 auto',
        flexWrap: 'wrap',
        gap: '1rem',
      }}
    >
      <span style={{ fontFamily: 'var(--font-head)', fontWeight: 800, fontSize: '1rem' }}>
        AJITH<span style={{ color: 'var(--blue)' }}>.</span>
      </span>
      <p style={{ fontSize: '0.8rem', color: 'var(--text-3)', fontFamily: 'var(--font-body)' }}>
        © {new Date().getFullYear()} Kambham Ajith Pavan Reddy · Built with Next.js + Three.js
      </p>
      <a
        href="mailto:ajithpavanreddy@gmail.com"
        style={{ fontSize: '0.8rem', color: 'var(--text-2)', fontFamily: 'var(--font-body)' }}
      >
        ajithpavanreddy@gmail.com
      </a>
    </footer>
  );
}
