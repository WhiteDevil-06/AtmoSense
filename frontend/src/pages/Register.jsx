import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

export default function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/auth/register', { name, email, password });
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center -mt-10 relative z-20">
            
            <div className="mb-8 flex flex-col items-center">
                <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(37,99,235,0.4)] mb-5 shrink-0">
                    <img src="/meter.png" alt="Logo" className="w-8 h-8 filter invert" />
                </div>
                <h1 className="text-3xl font-bold text-white tracking-tight">System Access</h1>
                <p className="text-slate-400 mt-2 font-medium">Provision a new operator profile</p>
            </div>

            <div className="crediflow-card w-full max-w-[420px] p-8 shadow-2xl relative z-20">
                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl mb-6 text-sm text-center font-medium">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-slate-400 font-semibold mb-2 text-sm">Full Name</label>
                        <input
                            className="w-full crediflow-input"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            placeholder="Operator Designation"
                        />
                    </div>
                    <div>
                        <label className="block text-slate-400 font-semibold mb-2 text-sm">Email Address</label>
                        <input
                            type="email"
                            className="w-full crediflow-input"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="operator@atmosense.com"
                        />
                    </div>
                    <div>
                        <label className="block text-slate-400 font-semibold mb-2 text-sm">Password</label>
                        <input
                            type="password"
                            className="w-full crediflow-input"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="Secure initialization cipher"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white rounded-xl py-3.5 font-bold hover:bg-blue-500 transition-colors shadow-lg shadow-blue-500/20 mt-8"
                    >
                        Provision Account
                    </button>
                </form>

                <div className="mt-8 text-center text-sm font-medium text-slate-400">
                    Already authorized?{' '}
                    <button onClick={() => navigate('/login')} className="text-blue-400 hover:text-blue-300 transition-colors ml-1 font-semibold">
                        Sign In
                    </button>
                </div>
            </div>

            {/* Unified Fixed Footer */}
            <div className="fixed bottom-0 left-0 w-full px-12 py-6 flex justify-between items-center text-xs text-slate-500 font-medium bg-[#030712] border-t border-slate-800/50 z-10">
                <div className="flex items-center gap-3">
                    <span className="font-semibold tracking-wide text-slate-300">© 2026 AtmoSense</span>
                    <span className="bg-slate-800/80 text-blue-400 px-2 py-0.5 rounded text-[10px] tracking-widest font-bold">V 2.0</span>
                </div>
            </div>
        </div>
    );
}
