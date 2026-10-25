import backgroundImage from "@/assets/Img2.jpg";
import React, { useState } from 'react';
import { register } from '@/api/registerAndLoginApi';
import { toast } from 'sonner';
import { useLoading } from '@/hooks/useLoading';

const Register: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [bio, setBio] = useState('');
    const [profilePicture, setProfilePicture] = useState<File | null>(null);
    const [userType, setUserType] = useState('CONSUMER');
    const { setIsLoading } = useLoading();

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        try {
            setIsLoading(true);
            const formData = new FormData();
            formData.append('email', email);
            formData.append('password', password);
            formData.append('name', name);
            formData.append('bio', bio);
            formData.append('userType', userType);
            if (profilePicture) {
                formData.append('profilePicture', profilePicture);
            }
            await register(formData);
            toast.success('¡Registro exitoso!');
            setTimeout(() => {
                window.location.href = '/login';
            }, 2000);
        } catch (err) {
            console.error('Registration failed:', err);
            toast.error('Error al registrarse. Por favor, inténtalo de nuevo.');
        }
        finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-cover bg-center bg-no-repeat relative" style={{ backgroundImage: `url(${backgroundImage})` }}>
            <div className="absolute inset-0 bg-black bg-opacity-60"></div>

            <a href="/" className="absolute top-6 left-6 bg-yellow-600 hover:bg-yellow-700 text-black px-4 py-2 rounded-lg text-lg font-semibold shadow-md">
                FoodTales
            </a>

            <div className="relative z-10 bg-white bg-opacity-90 p-6 rounded-xl shadow-xl w-full max-w-md mx-4">
                <h2 className="text-2xl font-bold text-gray-800 text-center mb-4">Registro</h2>
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

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        />
                    </div>

                    {/* Campo para la bio */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                        <textarea
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        />
                    </div>

                    {/* Campo para subir la imagen de perfil */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Imagen de perfil (Solo .jpg, menor a 2 MB)</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setProfilePicture(e.target.files ? e.target.files[0] : null)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Usuario</label>
                        <select
                            value={userType}
                            onChange={(e) => setUserType(e.target.value)}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        >
                            <option value="INFLUENCER">Influencer</option>
                            <option value="CONSUMER">Consumidor</option>
                        </select>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-2 rounded-lg transition duration-300"
                    >
                        Registrar
                    </button>
                </form>

                {/* Mensajes de error o éxito */}
                <div className="mt-4 text-center">
                    <p>
                        ¿Ya tienes una cuenta?{' '}
                        <a href="/login" className="text-yellow-500 hover:text-yellow-600 font-semibold">
                            Inicia sesión
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
