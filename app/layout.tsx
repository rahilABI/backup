import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: "ABI Department | Showcase",
  description: "Enterprise Galaxy Project Registry",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;600;700&family=Inter:wght@400;500;600&family=Caveat:wght@700&family=Comfortaa:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body suppressHydrationWarning style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        {/* Global 3D Canvas */}
        <div id="canvas-container"></div>
        <Script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js" strategy="afterInteractive" />
        <Script src="/scene.js?v=11" strategy="afterInteractive" />

        {/* Global Navigation */}
        <nav id="nav">
            <div className="brand text-protect" style={{ color: '#fff' }}>ABI</div>
            <div className="nav-links text-protect" style={{ display: 'flex', alignItems: 'center', fontSize: '1.4rem', gap: '2rem' }}>
                <a href="/">Home</a>
                <a href="/projects">Projects</a>
                <a href="/query">RequestForm</a>
                <a href="/login" className="btn-primary" style={{ display: 'none' }}>Request Access</a>
            </div>
        </nav>
        <Script id="nav-scroll-effect" strategy="afterInteractive">
          {`
            window.addEventListener('scroll', () => {
              const nav = document.getElementById('nav');
              if (nav) {
                if (window.scrollY > 50) {
                  nav.classList.add('scrolled');
                } else {
                  nav.classList.remove('scrolled');
                }
              }
            });
          `}
        </Script>

        <div style={{ flex: 1, position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column' }}>
            {children}
        </div>

        {/* Global Footer */}
        <footer className="global-footer text-protect" style={{ padding: '2rem 4vw', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.1)', background: '#03050c', marginTop: 'auto' }}>
            <div style={{ color: '#888' }}>&copy; {new Date().getFullYear()} ABI Team</div>
            <div style={{ fontWeight: 'bold', color: '#fff', letterSpacing: '0.05em' }}>TRICOG | ABI</div>
        </footer>
      </body>
    </html>
  );
}
