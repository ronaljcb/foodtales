import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Food, FoodRequestDto } from '@/Api';
import { toast } from 'sonner';
import { useDropzone } from 'react-dropzone';
import { useLoading } from '@/hooks/useLoading';

interface EditFoodModalProps {
    open: boolean;
    onClose: () => void;
    food?: Food | null; // Platillo seleccionado para editar
    onSave: (data: FoodRequestDto, image?: File) => Promise<void>; // Función para guardar
}

const EditFoodModal: React.FC<EditFoodModalProps> = ({ open, onClose, food, onSave }) => {
    const { restaurantId } = useParams<{ restaurantId: string }>();
    const [formData, setFormData] = useState<FoodRequestDto>({
        name: '',
        description: '',
        price: 0,
        restaurantId: Number(restaurantId),
        status: 'AVAILABLE',
        image: null, // La imagen se asignará aquí
    });

    const { isLoading, setIsLoading } = useLoading();
    const [preview, setPreview] = useState<string | null>(null); // Vista previa de la imagen

    useEffect(() => {
        if (food) {
            setFormData({
                name: food.name,
                description: food.description,
                price: food.price,
                status: food.status,
                restaurantId: food.restaurantId,
                image: null,
            });
            setPreview(food.imageUrl || null); // Mostrar preview de la imagen existente
        } else {
            setFormData({
                name: '',
                description: '',
                price: 0,
                restaurantId: Number(restaurantId),
                status: 'AVAILABLE',
                image: null,
            });
            setPreview(null);
        }
    }, [food, restaurantId]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: name === 'price' ? parseFloat(value) || 0 : value }));
    };

    const handleSubmit = async () => {
        if (!formData.name.trim() || formData.price <= 0 || !formData.image) {
            toast.error('Por favor, complete todos los campos y cargue una imagen válida.');
            return;
        }

        setIsLoading(true);
        try {
            await onSave(formData, formData.image!); // Pasa el archivo al método onSave
            onClose();
        } catch (error) {
            console.error('Error al guardar el platillo:', error);
            toast.error('Error al guardar el platillo. Por favor, inténtelo de nuevo.');
        } finally {
            setIsLoading(false);
        }
    };

    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles && acceptedFiles.length > 0) {
            const file = acceptedFiles[0];
            setFormData((prev) => ({ ...prev, image: file })); // Asigna el archivo al campo image
            setPreview(URL.createObjectURL(file)); // Generar preview temporal de la imagen
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'image/*': [] }, // Aceptar solo imágenes
        maxFiles: 1,
    });

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="bg-white p-6 rounded-lg shadow-xl max-w-lg w-full overflow-scroll">
                <DialogHeader>
                    <DialogTitle className="text-lg font-bold">
                        {food ? 'Editar Platillo' : 'Nuevo Platillo'}
                    </DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Nombre</label>
                        <Input
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="Nombre del platillo"
                            className="mt-1"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Descripción</label>
                        <textarea
                            name="description"
                            value={formData.description || ""}
                            onChange={handleInputChange}
                            placeholder="Descripción del platillo"
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Precio</label>
                        <Input
                            name="price"
                            type="number"
                            step="0.01"
                            value={formData.price.toString()}
                            onChange={handleInputChange}
                            placeholder="Precio del platillo"
                            className="mt-1"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Estado</label>
                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md mt-1"
                        >
                            <option value="AVAILABLE">Disponible</option>
                            <option value="UNAVAILABLE">No disponible</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Imagen (Obligatoria) (max 2 MB, jpg)</label>
                        <div
                            {...getRootProps()}
                            className={`border-dashed border-2 p-4 rounded-md text-center cursor-pointer ${isDragActive ? 'border-blue-400' : 'border-gray-300'}`}
                        >
                            <input {...getInputProps()} />
                            {isDragActive ? (
                                <p>Suelta la imagen aquí...</p>
                            ) : (
                                <p>Arrastra y suelta una imagen aquí o haz clic para seleccionar</p>
                            )}
                        </div>
                        {preview && (
                            <img
                                src={preview}
                                alt="Vista previa"
                                className="mt-4 w-full h-40 object-cover rounded-md"
                            />
                        )}
                    </div>
                </div>
                <DialogFooter className="mt-4 flex justify-end space-x-2">
                    <Button variant="outline" onClick={onClose}>
                        Cancelar
                    </Button>
                    <Button onClick={handleSubmit} disabled={isLoading}>
                        {isLoading ? 'Guardando...' : food ? 'Guardar Cambios' : 'Crear Platillo'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default EditFoodModal;
