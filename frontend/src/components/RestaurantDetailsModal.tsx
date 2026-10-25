import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import ReactStars from "react-rating-star-with-type";
import GoogleMapComponent from "@/components/GoogleMapComponent";
import { Restaurant } from "@/api/restaurantApi";
import { getCommentsByRestaurantId } from "@/api/ratingApi";
import { useAuth } from "@/AuthContext";
import { toast } from "sonner";
import { useLoading } from "@/hooks/useLoading";

interface Comment {
    userId: number;
    rating: number;
    comment: string;
}

interface RestaurantDetailsModalProps {
    open: boolean;
    onClose: () => void;
    restaurant: Restaurant | null;
    onRate: (rating: number, comment: string) => Promise<void>;
}

const RestaurantDetailsModal: React.FC<RestaurantDetailsModalProps> = ({
    open,
    onClose,
    restaurant,
    onRate,
}) => {
    const [rating, setRating] = useState<number>(0);
    const [comment, setComment] = useState<string>("");
    const [loading, setLoading] = useState(false);
    const [averageRating, setAverageRating] = useState<number>(0);
    const [comments, setComments] = useState<Comment[]>([]);
    const { token } = useAuth();
    const { setIsLoading } = useLoading();

    useEffect(() => {
        const fetchComments = async () => {
            if (restaurant) {
                try {
                    const fetchedComments = await getCommentsByRestaurantId(restaurant.restaurantId, token!);
                    setComments(fetchedComments);
                    const totalRating = fetchedComments.reduce((acc, curr) => acc + curr.rating, 0);
                    const avgRating = fetchedComments.length ? totalRating / fetchedComments.length : 0;
                    setAverageRating(parseFloat(avgRating.toFixed(1)));
                } catch (error) {
                    console.error("Error al obtener comentarios:", error);
                }
            }
        };

        if (restaurant) {
            setIsLoading(true);
            fetchComments();
            setIsLoading(false);
        }
    }, [restaurant]);

    const handleRatingSubmit = async () => {
        if (!rating || !comment.trim()) {
            toast.error("Por favor, califica y deja un comentario.");
            return;
        }

        setLoading(true);
        try {
            await onRate(rating, comment);
            toast.success("¡Calificación enviada!");
            onClose();
        } catch (error) {
            console.error("Error al enviar la calificación:", error);
            toast.error("Error al enviar la calificación.");
        } finally {
            setLoading(false);
        }
    };

    if (!restaurant) return null;

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="bg-white p-4 sm:p-6 rounded-lg shadow-xl max-w-lg w-full h-screen overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-lg font-bold flex items-center justify-between">
                        <span>{restaurant.name}</span>
                        <span
                            className={`px-2 py-1 text-xs font-medium rounded ${restaurant.status === "OPEN" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                                }`}
                        >
                            {restaurant.status === "OPEN" ? "Abierto" : "Cerrado"}
                        </span>

                    </DialogTitle>
                    <DialogFooter>
                        <div className="flex items-start w-full">
                            <ReactStars
                                value={averageRating}
                                count={5}
                                isEdit={false}
                                size={20}
                                activeColors={["#FF6961", "#FFB347", "#FFD700", "#77DD77", "#03C03C"]}
                            />
                            <span className="ml-2 text-sm text-gray-600">{averageRating.toFixed(1)} / 5</span>
                        </div>
                    </DialogFooter>
                </DialogHeader>
                <div className="space-y-4">
                    {/* Imagen */}
                    <img
                        src={restaurant.image || "https://via.placeholder.com/400x200.png?text=No+Image"}
                        alt={`Imagen de ${restaurant.name}`}
                        className="w-full h-40 object-cover rounded-md"
                    />

                    {/* Mapa */}
                    <div>
                        <GoogleMapComponent
                            latitude={restaurant.latitude}
                            longitude={restaurant.longitude}
                        />
                    </div>
                    {/* Tu calificación */}
                    <div>
                        <h3 className="text-base font-semibold">Tu Calificación</h3>
                        <ReactStars
                            value={rating}
                            count={5}
                            onChange={(newRating) => setRating(newRating)}
                            size={20}
                            isEdit={true}
                            isHalf={true}
                            activeColors={["#FF6961", "#FFB347", "#FFD700", "#77DD77", "#03C03C"]}
                        />
                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Deja un comentario"
                            className="w-full mt-2 text-sm border-gray-300 rounded-md shadow-sm"
                        />
                    </div>

                    {/* Comentarios */}
                    <div>
                        <h3 className="text-base font-semibold">Comentarios</h3>
                        {comments.length ? (
                            <div className="space-y-2 mt-2">
                                {comments.map((c, idx) => (
                                    <div key={idx} className="border rounded-md p-2 text-sm">
                                        <p>
                                            <strong>Usuario {c.userId}:</strong> {c.comment}
                                        </p>
                                        <ReactStars
                                            value={c.rating}
                                            count={5}
                                            isEdit={false}
                                            size={16}
                                            activeColors={["#FFD700"]}
                                        />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-600 text-sm">No hay comentarios aún.</p>
                        )}
                    </div>
                </div>
                <DialogFooter className="mt-4 flex justify-end space-x-2">
                    <Button variant="outline" onClick={onClose} className="text-sm">
                        Cancelar
                    </Button>
                    <Button onClick={handleRatingSubmit} disabled={loading} className="text-sm">
                        {loading ? "Enviando..." : "Enviar Calificación"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default RestaurantDetailsModal;
