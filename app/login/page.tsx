import { login, signInWithGoogle } from './actions'

export default function LoginPage({
  searchParams,
}: {
  searchParams: { error: string }
}) {
    return (
        <div className="container" style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 10 }}>
            <div style={{ background: 'rgba(10,15,20,0.85)', backdropFilter: 'blur(24px)', padding: '4rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', width: '100%', maxWidth: '400px', textAlign: 'center' }}>
                <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem', fontFamily: 'Space Grotesk', color: '#fff' }}>System Access</h1>
                <p style={{ color: 'rgba(255,255,255,0.5)', marginBottom: '2rem', fontSize: '0.9rem' }}>Authenticate to access the ABI Team Data Console.</p>
                
                {searchParams?.error && (
                    <div style={{ padding: '1rem', background: 'rgba(255,0,0,0.1)', border: '1px solid red', color: 'red', borderRadius: '4px', marginBottom: '1rem' }}>
                        {searchParams.error}
                    </div>
                )}

                <form>
                    <input name="email" required type="email" placeholder="Email Address" style={{ width: '100%', padding: '0.75rem', marginBottom: '1rem', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', borderRadius: '4px', outline: 'none' }} />
                    <input name="password" required type="password" placeholder="Password" style={{ width: '100%', padding: '0.75rem', marginBottom: '2rem', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', borderRadius: '4px', outline: 'none' }} />
                    
                    <button formAction={login} style={{ display: 'block', width: '100%', padding: '0.75rem', borderRadius: '4px', background: '#06b6d4', color: '#000', textDecoration: 'none', fontWeight: 'bold', marginBottom: '1rem', cursor: 'pointer', border: 'none' }}>
                        INITIALIZE SESSION
                    </button>
                </form>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', margin: '1.5rem 0' }}>
                    <div style={{ height: '1px', background: 'rgba(255,255,255,0.1)', flex: 1 }}></div>
                    <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.3)' }}>OR</span>
                    <div style={{ height: '1px', background: 'rgba(255,255,255,0.1)', flex: 1 }}></div>
                </div>

                <form>
                    <button formAction={signInWithGoogle} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', width: '100%', padding: '0.75rem', borderRadius: '4px', background: '#fff', color: '#000', textDecoration: 'none', fontWeight: 'bold', cursor: 'pointer', border: 'none' }}>
                        Google SSO
                    </button>
                </form>
            </div>
        </div>
    );
}
