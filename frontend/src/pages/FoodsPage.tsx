import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
    getFoodsByRestaurantId,
    deleteFood,
    createFood,
    updateFood,
    Food,
    FoodRequestDto,
} from '@/Api';
import { useParams, useNavigate } from 'react-router-dom';
import EditFoodModal from '@/components/EditFoodModal';
import FoodRatingsModal from '@/components/FoodRatingModal';
import { FiEdit, FiTrash2, FiPlus, FiArrowLeft, FiStar } from 'react-icons/fi';
import { Card, CardContent, CardDescription, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/AuthContext';
import { useLoading } from '@/hooks/useLoading';

const FoodsPage: React.FC = () => {
    const { restaurantId } = useParams<{ restaurantId: string }>();
    const navigate = useNavigate();

    const [foods, setFoods] = useState<Food[]>([]);
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [selectedFood, setSelectedFood] = useState<Food | null>(null);
    const [selectedFoodForRatings, setSelectedFoodForRatings] = useState<Food | null>(null);
    const { token } = useAuth();
    const { setIsLoading } = useLoading();

    useEffect(() => {
        const fetchFoods = async () => {
            const fetchedFoods = await getFoodsByRestaurantId(Number(restaurantId), token!);
            setFoods(fetchedFoods);
        };
        setIsLoading(true);
        fetchFoods();
        setIsLoading(false);
    }, [restaurantId]);

    const handleEdit = (food: Food) => {
        setSelectedFood(food);
        setEditModalOpen(true);
    };

    const handleDelete = async (id: number) => {
        setIsLoading(true);
        await deleteFood(id, token!);
        setFoods((prev) => prev.filter((f) => f.foodId !== id));
        setIsLoading(false);
    };

    const handleSave = async (data: FoodRequestDto) => {
        if (selectedFood) {
            data.restaurantId = Number(restaurantId);
            const updatedFood = await updateFood(selectedFood.foodId, data, token!);
            console.log(updatedFood);
            setFoods((prev) => prev.map((f) => (f.foodId === updatedFood.foodId ? updatedFood : f)));
        } else {
            const newFood = await createFood(data, token!);
            setFoods((prev) => [newFood, ...prev]);
        }
        setEditModalOpen(false);
        setSelectedFood(null);
    };

    return (
        <div className="min-h-screen bg-gray-100 p-6 min-w-[340px] flex flex-col items-center">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8 w-full max-w-[1920px]">
                <Button
                    variant="outline"
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 self-start sm:self-center"
                >
                    <FiArrowLeft />
                    <span>Regresar</span>
                </Button>
                <h1 className="text-2xl sm:text-4xl font-bold text-center">Platillos</h1>
                <Button
                    className="bg-red-500 text-white flex items-center gap-2 self-start sm:self-center"
                    onClick={() => {
                        setSelectedFood(null);
                        setEditModalOpen(true);
                    }}
                >
                    <FiPlus />
                    <span>Nuevo Platillo</span>
                </Button>
            </div>

            {/* Foods Grid */}
            <div className="grid gap-6 grid-cols-[repeat(auto-fit,minmax(250px,1fr))] w-full max-w-[1920px]">
                {foods.map((food) => (
                    <Card key={food.foodId} className="w-full max-w-xs mx-auto">
                        {/* Opciones superiores */}
                        <div className="flex justify-between px-4 pt-4">
                            <Button
                                onClick={() => handleEdit(food)}
                                variant="link"
                                className="text-black hover:text-blue-600"
                            >
                                <FiEdit />
                            </Button>
                            <Button
                                onClick={() => handleDelete(food.foodId)}
                                variant="link"
                                className="text-black hover:text-red-600"
                            >
                                <FiTrash2 />
                            </Button>
                        </div>

                        {/* Contenido principal */}
                        <CardContent>
                            <img
                                src={food.imageUrl || "placeholder.jpg"}
                                alt={`Imagen de ${food.name}`}
                                className="w-full h-48 object-cover mt-4 rounded-lg"
                            />
                        </CardContent>
                        <CardContent>
                            <CardTitle>{food.name}</CardTitle>
                            <CardDescription>
                                Precio: ${food.price.toFixed(2)}
                                <br />
                                Estado:{" "}
                                <span
                                    className={`font-bold ${food.status === "AVAILABLE" ? "text-green-500" : "text-red-500"}`}
                                >
                                    {food.status === "AVAILABLE" ? "Disponible" : "No disponible"}
                                </span>
                            </CardDescription>
                        </CardContent>

                        {/* Opciones inferiores */}
                        <div className="flex justify-center px-4 pb-4">
                            <Button
                                onClick={() => setSelectedFoodForRatings(food)}
                                variant="link"
                                className="text-black hover:text-blue-600"
                            >
                                <FiStar /> Ver Calificaciones
                            </Button>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Edit Modal */}
            {isEditModalOpen && (
                <EditFoodModal
                    open={isEditModalOpen}
                    onClose={() => setEditModalOpen(false)}
                    food={selectedFood}
                    onSave={handleSave}
                />
            )}

            {/* Ratings Modal */}
            {selectedFoodForRatings && (
                <FoodRatingsModal
                    open={!!selectedFoodForRatings}
                    onClose={() => setSelectedFoodForRatings(null)}
                    foodId={selectedFoodForRatings.foodId}
                    foodName={selectedFoodForRatings.name}
                />
            )}
        </div>
    );
};

export default FoodsPage;
