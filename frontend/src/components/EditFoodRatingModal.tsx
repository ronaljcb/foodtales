import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import ReactStars from "react-rating-star-with-type";

interface EditFoodRatingModalProps {
    open: boolean;
    onClose: () => void;
    rating?: { rating: number; comment: string } | null;
    onSave: (data: { rating: number; comment: string }) => Promise<void>;
}

const EditFoodRatingModal: React.FC<EditFoodRatingModalProps> = ({ open, onClose, rating, onSave }) => {
    const [formData, setFormData] = useState<{ rating: number; comment: string }>({
        rating: 0,
        comment: '',
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (rating) {
            setFormData({
                rating: Math.min(Math.max(rating.rating, 1), 5),
                comment: rating.comment || '',
            });
        } else {
            setFormData({
                rating: 0,
                comment: '',
            });
        }
    }, [rating]);

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async () => {
        if (!formData.rating || formData.rating < 1 || formData.rating > 5) {
            alert('La calificación debe estar entre 1 y 5.');
            return;
        }

        setLoading(true);
        try {
            await onSave(formData);
            onClose();
        } catch (error) {
            console.error('Error al guardar la calificación:', error);
            alert('No se pudo guardar la calificación.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="bg-white p-6 rounded-lg shadow-xl max-w-lg w-full">
                <DialogHeader>
                    <DialogTitle className="text-lg font-bold">
                        {rating ? 'Editar Calificación' : 'Nueva Calificación'}
                    </DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Calificación</label>
                        <ReactStars
                            value={formData.rating}
                            count={5}
                            onChange={(newRating) => setFormData((prev) => ({ ...prev, rating: newRating }))}
                            size={24}
                            isEdit={true}
                            activeColors={["#FFD700"]}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Comentario</label>
                        <textarea
                            name="comment"
                            value={formData.comment}
                            onChange={handleInputChange}
                            placeholder="Escribe tu comentario"
                            rows={4}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md mt-1"
                        />
                    </div>
                </div>
                <DialogFooter className="mt-4 flex justify-end space-x-2">
                    <Button variant="outline" onClick={onClose}>
                        Cancelar
                    </Button>
                    <Button onClick={handleSubmit} disabled={loading}>
                        {loading ? 'Guardando...' : rating ? 'Guardar Cambios' : 'Crear Calificación'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default EditFoodRatingModal;
