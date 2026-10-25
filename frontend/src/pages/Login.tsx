import backgroundImage from "@/assets/Img2.jpg";
import React, { useState } from 'react';
import { login, JwtAuthResponse, LoginReq } from '@/api/registerAndLoginApi';
import { useAuth } from '../AuthContext';
import { useNavigate } from 'react-router-dom';
import { useLoading } from '@/hooks/useLoading';
import { toast } from 'sonner';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const { setToken, setUser } = useAuth();
    const navigate = useNavigate();
    const { setIsLoading } = useLoading();

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        const loginReq: LoginReq = { email, password };
        setIsLoading(true);
        try {
            const response: JwtAuthResponse = await login(loginReq);
            setToken(response.token);
            setUser(response.user);
            toast.success('Inicio de sesión exitoso');
            setError('');
            setTimeout(() => navigate('/'), 1000);
        } catch (err) {
            console.error('Login failed:', err);
            setError('Inicio de sesión fallido. Por favor, verifica tus credenciales.');
            setSuccessMessage('');
        }
        finally {
            setIsLoading(false);
        }

    };

    return (
        <div
            className="flex items-center justify-center min-h-screen bg-cover bg-center bg-no-repeat relative"
            style={{
                backgroundImage: `url(${backgroundImage})`, // Cambiar por la ruta de la imagen
            }}
        >
            {/* Superposición */}
            <div className="absolute inset-0 bg-black bg-opacity-60"></div>

            {/* Botón FoodTales */}
            <a
                href="/"
                className="absolute top-6 left-6 bg-yellow-600 hover:bg-yellow-700 text-black px-4 py-2 rounded-lg text-lg font-semibold shadow-md"
            >
                FoodTales
            </a>

            {/* Formulario */}
            <div className="relative z-10 bg-white bg-opacity-90 p-6 rounded-xl shadow-xl w-full max-w-md mx-4">
                <h2 className="text-2xl font-bold text-gray-800 text-center mb-4">Iniciar Sesión</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-2 rounded-lg transition duration-300"
                    >
                        Iniciar Sesión
                    </button>
                </form>
                {/* Mostrar mensajes de éxito o error */}
                {error && <p className="text-red-500 text-center mt-4">{error}</p>}
                {successMessage && <p className="text-green-500 text-center mt-4">{successMessage}</p>}

                {/* Links adicionales */}
                <div className="mt-4 text-center">
                    <p className="mb-2">
                        ¿No tienes cuenta?{' '}
                        <a
                            href="/register"
                            className="text-yellow-500 hover:text-yellow-600 font-semibold"
                        >
                            Regístrate
                        </a>
                    </p>
                    <p>
                        ¿Olvidaste tu contraseña?{' '}
                        <a
                            href="/forgot-password"
                            className="text-yellow-500 hover:text-yellow-600 font-semibold"
                        >
                            Recuperar
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
