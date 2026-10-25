import React from 'react';
import { useAuth } from '../AuthContext'; // Para obtener información del usuario autenticado
import { useNavigate } from 'react-router-dom';

const HomeLogged: React.FC = () => {
    const { user } = useAuth(); // Obtener información del usuario desde el contexto
    const navigate = useNavigate();

    return (
        <div
            className="min-h-screen flex items-center justify-center bg-cover bg-center relative"
            style={{
                backgroundImage: `url('bg.jpg')`, // Reutilizando el fondo del Login
            }}
        >
            {/* Superposición */}
            <div className="absolute inset-0 bg-black bg-opacity-60"></div>

            {/* Contenido */}
            <div className="relative z-10 bg-white bg-opacity-90 p-8 rounded-xl shadow-lg w-full max-w-4xl mx-5">
                <header className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-800">
                        Bienvenido, {user?.name || 'Usuario'}!
                    </h1>
                    <p className="text-gray-600">
                        Explora, comparte y conecta con otros amantes de la comida.
                    </p>
                </header>

                <main className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Tarjetas */}
                    <div
                        onClick={() => navigate('/posts')}
                        className="bg-yellow-600 text-white p-6 rounded-lg shadow-lg cursor-pointer hover:bg-yellow-700 transition"
                    >
                        <h2 className="text-2xl font-bold mb-2">Publicaciones</h2>
                        <p>Crea, edita y explora publicaciones sobre experiencias culinarias.</p>
                    </div>

                    <div
                        onClick={() => navigate('/restaurants')}
                        className="bg-yellow-600 text-white p-6 rounded-lg shadow-lg cursor-pointer hover:bg-yellow-700 transition"
                    >
                        <h2 className="text-2xl font-bold mb-2">Restaurantes</h2>
                        <p>Descubre, califica y explora restaurantes cerca de ti.</p>
                    </div>

                    <div
                        onClick={() => navigate('/profile')}
                        className="bg-yellow-600 text-white p-6 rounded-lg shadow-lg cursor-pointer hover:bg-yellow-700 transition"
                    >
                        <h2 className="text-2xl font-bold mb-2">Mi Perfil</h2>
                        <p>Consulta y actualiza la información de tu perfil.</p>
                    </div>
                </main>

                <footer className="mt-8 text-center text-gray-600">
                    <p>© 2024 FoodTales. Todos los derechos reservados.</p>
                </footer>
            </div>
        </div>
    );
};

export default HomeLogged;
