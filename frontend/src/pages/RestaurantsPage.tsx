import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import {
    getAllRestaurants,
    deleteRestaurant,
    createRestaurant,
    updateRestaurant,
    Restaurant,
    RestaurantRequestDto,
} from '@/api/restaurantApi';
import EditRestaurantModal from '@/components/EditRestaurantModal';
import { useAuth } from '@/AuthContext';
import { FiEdit, FiTrash2, FiPlus, FiArrowLeft, FiEye } from 'react-icons/fi';
import { IoFastFoodOutline } from "react-icons/io5";
import { Card, CardContent, CardDescription, CardTitle } from '@/components/ui/card';
import { useLoading } from '@/hooks/useLoading';
import { toast } from 'sonner';
import RestaurantDetailsModal from '@/components/RestaurantDetailsModal';
import { createRestaurantRating } from '@/api/ratingApi';

const RestaurantsPage: React.FC = () => {
    const navigate = useNavigate();
    const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
    const { setIsLoading } = useLoading();

    const { user, token } = useAuth();

    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

    const handleViewDetails = (restaurant: Restaurant) => {
        setSelectedRestaurant(restaurant);
        setIsDetailsModalOpen(true);
    };

    const handleRateRestaurant = async (rating: number, comment: string) => {
        try {
            const payload = { rating, comment, restaurantId: selectedRestaurant?.restaurantId, userId: user?.userId };
            await createRestaurantRating(payload, token!);
            toast.success("¡Calificación enviada!");
        } catch (error) {
            console.error("Error al calificar:", error);
            toast.error("Error al calificar el restaurante.");
        }
    };

    useEffect(() => {
        const fetchRestaurants = async () => {
            try {
                const fetchedRestaurants = await getAllRestaurants(token!);
                setRestaurants(fetchedRestaurants);
            } catch (error) {
                console.error("Error fetching restaurants:", error);
            }
        };
        fetchRestaurants();
    }, [token]);

    const handleEdit = (restaurant: Restaurant) => {
        setIsLoading(true);
        setSelectedRestaurant(restaurant);
        setEditModalOpen(true);
        setIsLoading(false);
    };

    const handleDelete = async (id: number) => {
        setIsLoading(true);
        await deleteRestaurant(id, token!);
        setRestaurants((prev) => prev.filter((r) => r.restaurantId !== id));
        setIsLoading(false);
    };

    const handleSave = async (data: RestaurantRequestDto) => {
        if (selectedRestaurant) {
            const updatedRestaurant = await updateRestaurant(selectedRestaurant.restaurantId, data, token!);
            setRestaurants((prev) =>
                prev.map((r) => (r.restaurantId === updatedRestaurant.restaurantId ? updatedRestaurant : r))
            );
        } else {
            setIsLoading(true);
            const newRestaurant = await createRestaurant(data, token!);
            setRestaurants((prev) => [newRestaurant, ...prev]);
            setEditModalOpen(false);
            setSelectedRestaurant(null);
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-6 min-w-[340px] flex flex-col items-center">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8 w-full max-w-[1920px]">
                <Button
                    variant="outline"
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 self-start sm:self-center"
                >
                    <FiArrowLeft />
                    <span>Regresar</span>
                </Button>
                <h1 className="text-2xl sm:text-4xl font-bold text-center">Restaurantes</h1>
                <Button
                    className="bg-red-500 hover:bg-red-800 text-white flex items-center gap-2 self-start sm:self-center"
                    onClick={() => {
                        setSelectedRestaurant(null);
                        setEditModalOpen(true);
                    }}
                >
                    <FiPlus />
                    <span>Nuevo Restaurante</span>
                </Button>
            </div>

            <div className="grid gap-6 grid-cols-[repeat(auto-fit,minmax(250px,1fr))] w-full max-w-6xl mx-auto">
                {restaurants.map((restaurant) => (
                    <Card key={restaurant.restaurantId} className="w-full max-w-xs mx-auto flex flex-col">
                        {/* Opciones superiores */}
                        <div className="flex justify-between px-4 pt-4">
                            <Button
                                onClick={() => handleEdit(restaurant)}
                                variant="link"
                                className="text-black hover:underline"
                            >
                                <FiEdit />
                            </Button>
                            <Button
                                onClick={() => handleDelete(restaurant.restaurantId)}
                                variant="link"
                                className="text-black hover:underline"
                            >
                                <FiTrash2 />
                            </Button>
                        </div>
                        {/* Contenido principal */}
                        <CardContent>
                            <img
                                src={restaurant.image || "https://via.placeholder.com/400x200.png?text=No+Image"}
                                alt={`Imagen de ${restaurant.name}`}
                                className="w-full h-48 object-cover mt-4"
                            />
                        </CardContent>
                        <CardContent>
                            <CardTitle>{restaurant.name}</CardTitle>
                            <CardDescription>
                                Latitud: {restaurant.latitude.toFixed(6)}
                                <br />
                                Longitud: {restaurant.longitude.toFixed(6)}
                                <br />
                                Email: {restaurant.email}
                                <br />
                                Estado:{" "}
                                <span
                                    className={`font-bold ${restaurant.status === "OPEN" ? "text-green-500" : "text-red-500"
                                        }`}
                                >
                                    {restaurant.status === "OPEN" ? "Abierto" : "Cerrado"}
                                </span>
                            </CardDescription>
                        </CardContent>
                        <div className="flex flex-wrap px-4 pb-4 gap-2 items-center justify-center">
                            <Button
                                onClick={() => navigate(`/restaurants/${restaurant.restaurantId}/foods`)}
                                variant="link"
                                className="text-black hover:underline"
                            >
                                <IoFastFoodOutline /> Ver Platillos
                            </Button>
                            <Button
                                onClick={() => handleViewDetails(restaurant)}
                                variant="link"
                                className="text-black hover:underline"
                            >
                                <FiEye /> Ver Detalles
                            </Button>
                        </div>

                    </Card>
                ))}
            </div>

            {/* Modal */}
            {isEditModalOpen && (
                <EditRestaurantModal
                    open={isEditModalOpen}
                    onClose={() => setEditModalOpen(false)}
                    restaurant={selectedRestaurant}
                    onSave={handleSave}
                />
            )}

            <RestaurantDetailsModal
                open={isDetailsModalOpen}
                onClose={() => setIsDetailsModalOpen(false)}
                restaurant={selectedRestaurant}
                onRate={handleRateRestaurant}
            />
        </div>
    );
};

export default RestaurantsPage;
