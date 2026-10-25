import React from 'react';

const NotFoundPage: React.FC = () => {
    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <div className="text-center">
                <h1 className="text-6xl font-bold text-gray-800">404</h1>
                <p className="text-2xl text-gray-600 mt-4">Page Not Found</p>
                <p className="text-gray-500 mt-2">Sorry, the page you are looking for does not exist.</p>
                <a href="/" className="mt-6 inline-block px-6 py-3 bg-orange-600 text-white rounded-lg shadow-md hover:bg-orange-700">
                    Go to Homepage
                </a>
            </div>
        </div>
    );
};

export default NotFoundPage;