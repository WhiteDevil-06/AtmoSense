import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Activity } from 'lucide-react';
import api from '../services/api';

export default function Login({ setAuth }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post('/auth/login', { email, password });
            localStorage.setItem('token', res.data.token);
            setAuth(true);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 w-full max-w-md">
                <div className="flex justify-center items-center gap-3 mb-8">
                    <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                        <Activity className="text-white" size={28} />
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight text-white">GRI Login</h1>
                </div>
                
                {error && <div className="bg-red-500/10 text-red-500 p-3 rounded-lg mb-4 text-center">{error}</div>}
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-slate-400 mb-1 text-sm">Email</label>
                        <input 
                            type="email" 
                            className="w-full bg-slate-800 border-slate-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none transition" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            required 
                        />
                    </div>
                    <div>
                        <label className="block text-slate-400 mb-1 text-sm">Password</label>
                        <input 
                            type="password" 
                            className="w-full bg-slate-800 border-slate-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none transition" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            required 
                        />
                    </div>
                    <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium p-3 rounded-lg transition mt-4">
                        Sign In
                    </button>
                    <div className="text-center mt-4 text-slate-400 text-sm">
                        Don't have an account? <Link to="/register" className="text-blue-500 hover:underline">Register</Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
