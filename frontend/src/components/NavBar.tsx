import React from 'react';
import { Link } from 'react-router-dom';

const NavBar: React.FC = () => {
    return (
        <nav className="bg-gray-800 p-4">
            <div className="container mx-auto flex justify-between items-center">
                <h1 className="text-2xl text-white">MyApp</h1>
                <div className="flex space-x-4">
                    <Link to="/" className="text-white hover:text-gray-400">FoodTail</Link>
                    <Link to="/perfil" className="text-white hover:text-gray-400">Perfil</Link>
                   
                </div>
            </div>
        </nav>
    );
};

export default NavBar;