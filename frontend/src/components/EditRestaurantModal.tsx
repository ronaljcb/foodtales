import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FiX } from "react-icons/fi";
import { toast } from "sonner";
import { useLoading } from "@/hooks/useLoading";
import GoogleMapComponent from "@/components/GoogleMapComponent";
import { Restaurant, RestaurantRequestDto } from "@/api/restaurantApi";

interface EditRestaurantModalProps {
    open: boolean;
    onClose: () => void;
    restaurant?: Restaurant | null;
    onSave: (data: RestaurantRequestDto) => Promise<void>;
}

const EditRestaurantModal: React.FC<EditRestaurantModalProps> = ({ open, onClose, restaurant, onSave }) => {
    const [formData, setFormData] = useState<RestaurantRequestDto>({
        name: "",
        email: "",
        latitude: -12.0464,
        longitude: -77.0428,
        status: "OPEN",
    });
    const [image, setImage] = useState<File | null>(null);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const { isLoading, setIsLoading } = useLoading();

    useEffect(() => {
        if (restaurant) {
            setFormData({
                name: restaurant.name,
                email: restaurant.email,
                latitude: restaurant.latitude,
                longitude: restaurant.longitude,
                status: restaurant.status,
            });
            setPreviewImage(restaurant.image || null);
        } else {
            setFormData({
                name: "",
                email: "",
                latitude: -12.0464,
                longitude: -77.0428,
                status: "OPEN",
            });
            setPreviewImage(null);
        }
        setImage(null);
    }, [restaurant]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev: any) => ({
            ...prev,
            [name]: name === "latitude" || name === "longitude" ? parseFloat(value) : value,
        }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setImage(e.target.files[0]);
            setPreviewImage(URL.createObjectURL(e.target.files[0]));
        }
    };

    const handleSubmit = async () => {
        setIsLoading(true);
        if (!formData.name.trim() || !formData.email.trim() || !formData.status) {
            toast.error("Por favor, completa todos los campos.");
            return;
        }

        if (!image && !restaurant) {
            toast.error("Por favor, selecciona una imagen.");
            return;
        }

        const payload: RestaurantRequestDto = {
            ...formData,
        };

        if (image) {
            payload.image = image;
        }
        try {
            await onSave(payload);
            toast.success("Restaurante guardado correctamente.");
            onClose();
        } catch (error) {
            console.error("Error al guardar el restaurante:", error);
            toast.error("Error al guardar el restaurante. Por favor, intenta nuevamente.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="bg-white p-4 sm:p-6 rounded-lg shadow-xl max-w-lg w-full">
                <DialogHeader>
                    <DialogTitle className="text-lg font-bold text-gray-800">
                        {restaurant ? "Editar Restaurante" : "Nuevo Restaurante"}
                        <span
                            className={`ml-4 px-2 py-1 rounded text-xs font-medium ${formData.status === "OPEN" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                                }`}
                        >
                            {formData.status === "OPEN" ? "Abierto" : "Cerrado"}
                        </span>
                    </DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    {/* Grid compacto */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Nombre</label>
                            <Input
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                placeholder="Nombre del restaurante"
                                className="text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Email</label>
                            <Input
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                placeholder="Correo electrónico"
                                className="text-sm"
                            />
                        </div>
                    </div>
                    {/* Estado */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Estado</label>
                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                        >
                            <option value="OPEN">Abierto</option>
                            <option value="CLOSED">Cerrado</option>
                        </select>
                    </div>
                    {/* Ubicación */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Ubicación</label>
                        <GoogleMapComponent
                            latitude={formData.latitude}
                            longitude={formData.longitude}
                            onLocationChange={(lat, lng) =>
                                setFormData((prev) => ({ ...prev, latitude: lat, longitude: lng }))
                            }
                        />
                        <p className="text-xs text-gray-500 mt-2">
                            Latitud: {formData.latitude.toFixed(6)} | Longitud: {formData.longitude.toFixed(6)}
                        </p>
                    </div>
                    {/* Imagen */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Imagen (obligatorio) (max 2MB, jpg)
                        </label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="text-xs mt-1"
                        />
                        {previewImage && (
                            <img
                                src={previewImage}
                                alt="Previsualización"
                                className="mt-2 w-full h-36 object-cover rounded"
                            />
                        )}
                    </div>
                </div>
                <DialogFooter className="mt-4 flex justify-end space-x-2">
                    <Button variant="outline" onClick={onClose} className="text-sm">
                        <FiX />
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={isLoading}
                        className="bg-green-500 hover:bg-green-600 text-white text-sm"
                    >
                        {isLoading ? "Guardando..." : restaurant ? "Guardar Cambios" : "Crear Restaurante"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default EditRestaurantModal;
