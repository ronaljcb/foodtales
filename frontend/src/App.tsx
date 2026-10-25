import DemoBar from "./demo/DemoBar";
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import HomeLogged from './pages/HomeLogged';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';
import { AuthProvider, useAuth } from './AuthContext';
import Posts from './pages/Posts';
import RestaurantsPage from './pages/RestaurantsPage';
import FoodsPage from './pages/FoodsPage';
import { Toaster } from 'sonner';
import { LoadingProvider, Loading } from './hooks/useLoading';
import GoogleMapsProvider from './components/GoogleMapsProvider';

const ProtectedRoute: React.FC<{ element: React.ReactNode }> = ({ element }) => {
  const { token } = useAuth();
  return token ? <>{element}</> : <Navigate to="/login" />;
};


const MainRoute: React.FC = () => {
  const { token } = useAuth();
  return token ? <HomeLogged /> : <Home />;
};

const App: React.FC = () => {

  return (
    <LoadingProvider>
      <DemoBar />
      <Loading />
      <AuthProvider>
        <GoogleMapsProvider> {/* Proveedor de Google Maps */}
          <Router>
            <Routes>
              {/* Ruta principal */}
              <Route path="/" element={<MainRoute />} />
              {/* Rutas públicas */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              {/* Rutas privadas */}
              <Route path="/posts" element={<ProtectedRoute element={<Posts />} />} />
              <Route path="/profile" element={<ProtectedRoute element={<Profile />} />} />
              <Route path="/restaurants" element={<ProtectedRoute element={<RestaurantsPage />} />} />
              {/* Ruta para los platillos de un restaurante */}
              <Route path="/restaurants/:restaurantId/foods" element={<FoodsPage />} />

              {/* Ruta no encontrada */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Router>
        </GoogleMapsProvider>
        <Toaster />
      </AuthProvider>
    </LoadingProvider>
  );
};

export default App;
