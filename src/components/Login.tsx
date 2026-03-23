import { useState } from 'react';

interface LoginProps {
    onLogin: (token: string, user: any) => void;
}

export function Login({ onLogin }: LoginProps) {
    const [isLogin, setIsLogin] = useState(true);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('carlos@scancup.com'); // default mock user email
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
        const payload = isLogin ? { email, password } : { name, email, password };

        try {
            const res = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const data = await res.json();
            
            if (data.success) {
                onLogin(data.token, data.user);
            } else {
                setError(data.message || 'Error en autenticación');
            }
        } catch (err) {
            setError('Error de conexión con el servidor backend');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-wc-light-bg pb-20 flex flex-col font-heading">
            <div className="bg-wc-red rounded-b-[40px] pt-16 pb-20 px-8 relative shadow-xl z-10 shrink-0 overflow-hidden">
                <div className="flex items-center space-x-2 mb-8">
                    <div className="bg-white/20 p-2 rounded-full">
                        <span className="text-white font-bold text-sm">⚽ WC26</span>
                    </div>
                    <span className="text-white/80 text-sm font-medium">APP OFICIAL</span>
                </div>

                <h1 className="text-4xl font-black text-white leading-tight mb-2 tracking-wide uppercase italic">
                    {isLogin ? 'Iniciar Sesión' : 'Crea tu Cuenta'}
                </h1>
                <p className="text-white/80 font-medium">
                    {isLogin ? 'Entra para ver tu colección.' : 'Únete para armar tu equipo soñado.'}
                </p>
                
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none -mr-16 -mt-16"></div>
            </div>

            <div className="flex-1 px-8 -mt-8 relative z-20">
                <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 shadow-2xl flex flex-col gap-5 border border-gray-100">
                    {error && (
                        <div className="bg-red-100 border-l-4 border-wc-red text-wc-red p-3 text-sm font-bold rounded-md">
                            {error}
                        </div>
                    )}
                    
                    {!isLogin && (
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Nombre completo</label>
                            <input 
                                type="text" 
                                value={name}
                                onChange={e => setName(e.target.value)}
                                required={!isLogin}
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-800 font-medium focus:outline-none focus:ring-2 focus:ring-wc-red focus:border-transparent transition-all"
                                placeholder="Lionel Messi"
                            />
                        </div>
                    )}

                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Correo electrónico</label>
                        <input 
                            type="email" 
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-800 font-medium focus:outline-none focus:ring-2 focus:ring-wc-red focus:border-transparent transition-all"
                            placeholder="tu@correo.com"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Contraseña</label>
                        <input 
                            type="password" 
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-800 font-medium focus:outline-none focus:ring-2 focus:ring-wc-red focus:border-transparent transition-all"
                            placeholder="••••••••"
                        />
                    </div>

                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full py-4 mt-2 bg-wc-red text-white font-black uppercase tracking-widest rounded-xl hover:bg-red-700 active:scale-95 transition shadow-[0_4px_14px_0_rgba(229,57,53,0.39)] disabled:opacity-70 flex justify-center items-center"
                    >
                        {loading ? 'Cargando...' : (isLogin ? 'Entrar' : 'Registrar')}
                    </button>

                    <div className="text-center mt-4">
                        <button 
                            type="button" 
                            onClick={() => { setIsLogin(!isLogin); setError(''); }}
                            className="text-gray-500 text-sm font-bold hover:text-wc-red transition-colors"
                        >
                            {isLogin ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia sesión'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
