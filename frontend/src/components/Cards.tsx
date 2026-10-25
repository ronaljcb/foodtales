import React from 'react';
import '../style/Cards.css';

// Archivo de estilos CSS para las cards

interface Restaurant {
  name: string;
  rating: number; // Calificación del restaurante (1 a 5)
}

interface CardsProps {
  restaurants: Restaurant[]; // Lista de restaurantes a mostrar
}

const Cards: React.FC<CardsProps> = ({ restaurants }) => {
  // Función para renderizar las estrellas según el rating
  const renderStars = (rating: number): JSX.Element[] => {
    const stars: JSX.Element[] = []; // Declarar el tipo explícitamente
    for (let i = 0; i < 5; i++) {
      stars.push(
        <span key={i} className={i < rating ? 'star filled' : 'star'}>
          ★
        </span>
      );
    }
    return stars;
  };

  return (
    <div className="cards-container">
      {restaurants.map((restaurant, index) => (
        <div key={index} className="card">
          <h3 className="restaurant-name">{restaurant.name}</h3>
          <div className="rating">{renderStars(restaurant.rating)}</div>
        </div>
      ))}
    </div>
  );
};

export default Cards;