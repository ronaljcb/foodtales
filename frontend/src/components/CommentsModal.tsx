import React from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { CommentResponseDto } from "@/api/commentsApi";
import { useAuth } from "@/AuthContext";

interface CommentsModalProps {
    open: boolean;
    onClose: () => void;
    comments: CommentResponseDto[];
    newCommentContent: string;
    setNewCommentContent: (value: string) => void;
    handleAddComment: () => void;
}

const CommentsModal: React.FC<CommentsModalProps> = ({
    open,
    onClose,
    comments,
    newCommentContent,
    setNewCommentContent,
    handleAddComment,
}) => {

    const { user } = useAuth();
    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-auto">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-gray-800">
                        Comentarios
                    </DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    {/* Mostrar lista de comentarios */}
                    <div className="space-y-3 max-h-64 overflow-y-auto">
                        {comments.length > 0 ? (
                            comments.map((comment) => (
                                <div
                                    key={comment.commentId}
                                    className="flex items-start space-x-3 p-2"
                                >
                                    {/* Imagen de perfil */}
                                    <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                                        <img
                                            src={
                                                comment.userPhoto ||
                                                "placeholder.jpg"
                                            }
                                            alt={`Foto de ${comment.userName}`}
                                            className="object-cover w-full h-full"
                                        />
                                    </div>
                                    {/* Detalles del comentario */}
                                    <div className="flex flex-col bg-gray-100 rounded-lg p-3 w-full">
                                        <div className="flex items-center justify-between">
                                            <p className="text-sm font-semibold text-gray-800">
                                                @{comment.userName}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {new Date(
                                                    comment.commentDate
                                                ).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <p className="text-sm text-gray-700">
                                            {comment.content}
                                        </p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500 text-center">
                                No hay comentarios.
                            </p>
                        )}
                    </div>

                    {/* Formulario para agregar un nuevo comentario */}
                    <div className="flex items-center space-x-3 mt-4">
                        {/* Imagen de perfil del usuario actual */}
                        <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                            <img
                                src={user?.profilePicture || "placeholder.jpg"}
                                alt="Tu perfil"
                                className="object-cover w-full h-full"
                            />
                        </div>
                        <Textarea
                            value={newCommentContent}
                            onChange={(e) =>
                                setNewCommentContent(e.target.value)
                            }
                            placeholder="Escribe un comentario..."
                            className="flex-1 border border-gray-300 rounded-lg"
                        />
                        <Button
                            onClick={handleAddComment}
                            className="text-blue-500 hover:text-blue-600 font-semibold"
                        >
                            Publicar
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default CommentsModal;
