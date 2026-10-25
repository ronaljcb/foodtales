import { Post } from "@/api/postsApi";
import React from "react";
import { FaTrash, FaEdit, FaCommentDots } from "react-icons/fa";
import { useAuth } from "@/AuthContext"; // Asegúrate de importar el hook useAuth

interface PostsListProps {
  posts: Post[];
  onEdit: (post: Post) => void;
  onDelete: (postId: number) => void;
  onViewComments: (postId: number) => void;
}

const PostsList: React.FC<PostsListProps> = ({ posts, onEdit, onDelete, onViewComments }) => {
  // Obtener el userId del usuario logueado desde el contexto
  const { user } = useAuth();

  // Si el usuario no está logueado, podemos retornar null o un mensaje de carga
  if (!user) {
    return <div>Cargando...</div>;  // O cualquier UI que prefieras para el estado de carga
  }

  return (
    <div className="flex flex-col items-center space-y-6">
      {posts.map((post) => (
        <div
          key={post.postId}
          className="bg-white shadow-md rounded-lg overflow-hidden w-full max-w-md border border-gray-200"
        >
          {/* Encabezado */}
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 bg-gray-300 rounded-full">
                <img
                  src={post.userProfilePicture || "placeholder.jpg"}
                  alt={post.userName}
                  className="object-cover w-full h-full rounded-full"
                />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-800">{post.userName}</h3>
                <p className="text-xs text-gray-500">
                  {new Date(post.createdDate).toLocaleDateString()}
                </p>
              </div>
            </div>
            <button className="text-gray-500 hover:text-gray-800">
              <span className="text-xl">...</span>
            </button>
          </div>

          {/* Imagen (opcional) */}
          {post.image && (
            <div className="w-full h-72 bg-gray-200 overflow-hidden">
              <img
                src={post.image}
                alt={post.title}
                className="object-cover w-full h-full"
              />
            </div>
          )}

          {/* Contenido */}
          <div className="px-4 py-3">
            <h3 className="text-lg font-semibold text-gray-800">{post.title}</h3>
            <p className="text-sm text-gray-600 mt-1">{post.content}</p>
          </div>

          {/* Acciones */}
          <div className="flex justify-between px-4 py-3 border-t border-gray-200">
            <button
              onClick={() => onViewComments(post.postId)}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-800"
            >
              <FaCommentDots />
              <span className="text-sm">Comentarios</span>
            </button>

            {/* Mostrar los botones solo si el userId coincide */}
            {user.userId == String(post.userId) && (
              <>
                <button
                  onClick={() => onEdit(post)}
                  className="flex items-center space-x-2 text-gray-600 hover:text-gray-800"
                >
                  <FaEdit />
                  <span className="text-sm">Editar</span>
                </button>
                <button
                  onClick={() => onDelete(post.postId)}
                  className="flex items-center space-x-2 text-red-600 hover:text-red-800"
                >
                  <FaTrash />
                  <span className="text-sm">Eliminar</span>
                </button>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default PostsList;
