import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import ReactStars from "react-rating-star-with-type";
import { FiTrash2 } from 'react-icons/fi';
import {
    getFoodRatingsByFoodId,
    createFoodRating,
    updateFoodRating,
    deleteFoodRating,
} from '@/Api';
import { useAuth } from '@/AuthContext';
import { useLoading } from '@/hooks/useLoading';
import { toast } from 'sonner';

interface FoodRating {
    comment: string;
    foodId: number;
    foodRatingId: number;
    rating: number;
    ratingDate: string;
    userId: number;
}

interface FoodRatingsModalProps {
    open: boolean;
    onClose: () => void;
    foodId: number;
    foodName: string;
}

const FoodRatingsModal: React.FC<FoodRatingsModalProps> = ({ open, onClose, foodId, foodName }) => {
    const { token } = useAuth();
    const [ratings, setRatings] = useState<FoodRating[]>([]);
    const [newRating, setNewRating] = useState<number>(0);
    const [newComment, setNewComment] = useState<string>('');
    const [editingRating, setEditingRating] = useState<FoodRating | null>(null); // Calificación en edición
    const [averageRating, setAverageRating] = useState<number>(0); // Rating promedio
    const [loading, setLoading] = useState(false);
    const { setIsLoading } = useLoading();

    useEffect(() => {
        const fetchRatings = async () => {
            try {
                const fetchedRatings = await getFoodRatingsByFoodId(foodId, token!);
                setRatings(fetchedRatings);

                // Calcular el promedio del rating
                const totalRating = fetchedRatings.reduce((acc: any, curr: any) => acc + curr.rating, 0);
                const avgRating = fetchedRatings.length ? totalRating / fetchedRatings.length : 0;
                setAverageRating(parseFloat(avgRating.toFixed(1)));
            } catch (error) {
                console.error('Error al cargar las calificaciones:', error);
            }
        };
        setIsLoading(true);
        if (foodId && open) fetchRatings();
        setIsLoading(false);
    }, [foodId, open, token]);

    const handleDelete = async (id: number) => {
        try {
            setIsLoading(true);
            await deleteFoodRating(id, token!);
            setRatings((prev) => prev.filter((r) => r.foodRatingId !== id));
        } catch (error) {
            console.error('Error al eliminar la calificación:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSaveRating = async () => {
        if (!newRating || !newComment.trim()) {
            toast.error('Por favor, completa todos los campos.');
            return;
        }

        setLoading(true);
        try {
            setIsLoading(true);
            if (editingRating) {
                // Editar calificación existente
                const updatedRating = await updateFoodRating(editingRating.foodRatingId, { rating: newRating, comment: newComment }, token!);
                setRatings((prev) =>
                    prev.map((r) => (r.foodRatingId === editingRating.foodRatingId ? updatedRating : r))
                );
                setEditingRating(null); // Salir del modo de edición
            } else {
                // Agregar nueva calificación
                const newRatingData = {
                    rating: newRating,
                    comment: newComment,
                    foodId: foodId,
                    userId: 1, // Ajustar con el ID real del usuario
                };
                const savedRating = await createFoodRating(newRatingData, token!);
                setRatings((prev) => [savedRating, ...prev]);
            }
            setNewRating(0);
            setNewComment('');
        } catch (error) {
            console.error('Error al guardar la calificación:', error);
        } finally {
            setLoading(false);
            setIsLoading(false);
        }
    };

    // const handleEdit = (rating: FoodRating) => {
    //     setEditingRating(rating);
    //     setNewRating(rating.rating);
    //     setNewComment(rating.comment);
    // };

    const cancelEdit = () => {
        setEditingRating(null);
        setNewRating(0);
        setNewComment('');
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="bg-white p-6 rounded-lg shadow-xl max-w-lg w-full h-auto">
                <DialogHeader>
                    <DialogTitle className="text-lg font-bold">{foodName} - Calificaciones</DialogTitle>
                </DialogHeader>

                {/* Rating Promedio */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                        <ReactStars
                            value={averageRating}
                            count={5}
                            isEdit={false}
                            size={24}
                            activeColors={["#FFD700"]}
                        />
                        <span className="ml-2 text-gray-600">{averageRating.toFixed(1)} / 5</span>
                    </div>
                </div>

                {/* Formulario para agregar o editar calificación */}
                <div className="border-b pb-4 mb-4">
                    <h3 className="text-base font-semibold">
                        {editingRating ? 'Editar Calificación' : 'Agregar Calificación'}
                    </h3>
                    <ReactStars
                        value={newRating}
                        count={5}
                        onChange={setNewRating}
                        size={24}
                        isEdit={true}
                        activeColors={["#FFD700"]}
                    />
                    <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Deja un comentario"
                        className="w-full mt-2 text-sm border-gray-300 rounded-md shadow-sm"
                        rows={3}
                    />
                    <div className="flex items-center justify-between mt-2">
                        {editingRating && (
                            <Button
                                variant="outline"
                                onClick={cancelEdit}
                                className="text-gray-600"
                            >
                                Cancelar
                            </Button>
                        )}
                        <Button
                            onClick={handleSaveRating}
                            disabled={loading}
                            className="bg-green-500 hover:bg-green-600 text-white"
                        >
                            Agregar Calificación
                        </Button>
                    </div>
                </div>

                {/* Lista de calificaciones */}
                <div className="overflow-y-auto max-h-64">
                    {ratings.length > 0 ? (
                        ratings.map((rating) => (
                            <div
                                key={rating.foodRatingId}
                                className="p-4 border rounded-md shadow-sm hover:shadow-md mb-2"
                            >
                                <div className="flex justify-between items-center">
                                    <ReactStars
                                        value={rating.rating}
                                        count={5}
                                        isEdit={false}
                                        size={20}
                                        activeColors={["#FFD700"]}
                                    />
                                    <div className="space-x-2">
                                        <Button
                                            onClick={() => handleDelete(rating.foodRatingId)}
                                            variant="link"
                                            className="text-red-500 hover:underline"
                                        >
                                            <FiTrash2 />
                                        </Button>
                                    </div>
                                </div>
                                <p className="text-sm text-gray-600 mt-2">
                                    {rating.comment || 'Sin comentarios'}
                                </p>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500 text-center">No hay calificaciones aún.</p>
                    )}
                </div>

                <DialogFooter>
                    <Button onClick={onClose} className="w-full">
                        Cerrar
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default FoodRatingsModal;
