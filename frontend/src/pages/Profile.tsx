import { demoRequest } from "@/demo/api";
import React, { useState } from "react";
import { useAuth } from "../AuthContext";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { BASE_URL } from "@/Api";
import { FaArrowLeft, FaEdit, FaSignOutAlt } from "react-icons/fa";
import { toast } from "sonner";
import Dropzone from "react-dropzone";
import { useLoading } from "@/hooks/useLoading";

const Profile: React.FC = () => {
  const { token, user, setToken, setUser } = useAuth();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editData, setEditData] = useState({
    name: user?.name || "",
    bio: user?.bio || "",
  });
  const [newImage, setNewImage] = useState<File | null>(null);
  const { setIsLoading } = useLoading();

  if (!user) {
    return (
      <div className="text-center text-red-500">
        <p>No estás autenticado. Por favor, inicia sesión.</p>
      </div>
    );
  }

  const handleLogout = () => {
    setIsLoading(true);
    setToken(null);
    setUser(null);
    localStorage.removeItem("authToken");
    localStorage.removeItem("authUser");
    window.location.href = "/login";
    setIsLoading(false);
  };

  const handleEditSubmit = async () => {
    setIsLoading(true);
    const formData = new FormData();

    // Adjuntar datos del usuario
    formData.append(
      "user",
      new Blob(
        [JSON.stringify({ name: editData.name, bio: editData.bio })],
        { type: "application/json" }
      )
    );

    // Adjuntar la nueva imagen si se seleccionó
    if (newImage) {
      formData.append("image", newImage);
    }

    try {
      const response = await demoRequest(`${BASE_URL}/users/${user.userId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Error al actualizar el perfil");
      }

      const updatedUser = await response.json();
      setUser(updatedUser);
      setIsEditModalOpen(false);

      toast.success("Perfil actualizado correctamente");
    } catch (error) {
      console.error(error);
      toast.error("No se pudo actualizar el perfil");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setNewImage(acceptedFiles[0]);
      toast.info("Nueva imagen seleccionada");
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex flex-col items-center justify-center p-6 relative"
      style={{
        backgroundImage: `url('bg.jpg')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className={`absolute inset-0 bg-black/60 ${isEditModalOpen ? "backdrop-blur-none" : "backdrop-blur-md"}`}></div>

      <div className="absolute top-4 left-4 z-20">
        <Button
          variant="ghost"
          className="flex items-center text-white hover:bg-transparent hover:text-white focus-visible:outline-none"
          onClick={() => (window.location.href = "/")}
        >
          <FaArrowLeft className="mr-2" /> Regresar
        </Button>
      </div>

      <Card className="w-full max-w-2xl bg-white/90 shadow-2xl rounded-lg z-20">
        <CardHeader className="flex items-center space-x-4">
          <img
            src={user.profilePicture || "placeholder.jpg"}
            alt="Foto de perfil"
            className="w-24 h-24 rounded-full object-cover border border-gray-300"
          />
          <div className="flex flex-col">
            <CardTitle className="text-3xl font-bold flex items-center justify-center">
              {user.name}
              <FaEdit
                className="ml-2 text-gray-500 cursor-pointer hover:text-gray-700 transition"
                onClick={() => setIsEditModalOpen(true)}
              />
            </CardTitle>
            <p className="text-sm text-gray-600">{user.email}</p>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold">Información Personal</h3>
            <Separator className="my-2" />
            <p><strong>Nombre:</strong> {user.name}</p>
            <p><strong>Biografía:</strong> {user.bio || "No especificada"}</p>
            <p><strong>Rol:</strong> {user.userType}</p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end space-x-4">
          <Button variant="outline" onClick={() => setIsEditModalOpen(true)}>
            <FaEdit className="mr-2" /> Editar Perfil
          </Button>
          <Button variant="destructive" onClick={handleLogout}>
            <FaSignOutAlt className="mr-2" /> Cerrar Sesión
          </Button>
        </CardFooter>
      </Card>

      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="bg-white p-6 rounded-lg shadow-xl z-50">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Editar Perfil</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Nombre</label>
              <Input
                value={editData.name}
                onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                className="border border-gray-300 rounded-lg w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Biografía</label>
              <Input
                value={editData.bio}
                onChange={(e) => setEditData({ ...editData, bio: e.target.value })}
                className="border border-gray-300 rounded-lg w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Nueva Foto de Perfil (Solo .jpg, menor a 2 MB)</label>
              <Dropzone onDrop={handleDrop} multiple={false} accept={{ "image/*": [] }}>
                {({ getRootProps, getInputProps }) => (
                  <div
                    {...getRootProps()}
                    className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-gray-500"
                  >
                    <input {...getInputProps()} />
                    <p>Arrastra una imagen aquí o haz clic para seleccionarla</p>
                    {newImage && <p className="text-sm text-gray-500 mt-2">{newImage.name}</p>}
                  </div>
                )}
              </Dropzone>
            </div>
          </div>
          <DialogFooter className="flex justify-end space-x-2 mt-4">
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleEditSubmit}>Guardar Cambios</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Profile;
