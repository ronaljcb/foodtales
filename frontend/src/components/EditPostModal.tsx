// components/EditPostModal.tsx
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { PostRequestDto } from "@/api/postsApi";

interface EditPostModalProps {
    open: boolean;
    onClose: () => void;
    formData: PostRequestDto;
    setFormData: (data: PostRequestDto) => void;
    handleSave: () => void;
    image: File | null;
    setImage: (file: File | null) => void;
    isEditing: boolean;
}

const EditPostModal: React.FC<EditPostModalProps> = ({
    open,
    onClose,
    formData,
    setFormData,
    handleSave,
    setImage,
    isEditing,
}) => {
    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-auto">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-gray-800">
                        {isEditing ? "Editar Publicación" : "Nueva Publicación"}
                    </DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Título</label>
                        <Input
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Contenido</label>
                        <Textarea
                            value={formData.content}
                            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Imagen (opcional) (max 2MB, jpg)
                        </label>
                        <Input type="file" onChange={(e) => setImage(e.target.files?.[0] || null)} />
                    </div>
                </div>
                <DialogFooter className="flex justify-end space-x-2 mt-4">
                    <Button variant="outline" onClick={onClose}>
                        Cancelar
                    </Button>
                    <Button onClick={handleSave}>
                        {isEditing ? "Guardar Cambios" : "Crear Publicación"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default EditPostModal;
