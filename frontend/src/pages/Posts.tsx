import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/AuthContext";
import {
    getCommentsByPostId,
    createComment,
    CommentResponseDto,
} from "@/api/commentsApi";

import { FaArrowLeft, FaPlus, FaRegFrown } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import CommentsModal from "@/components/CommentsModal";
import EditPostModal from "@/components/EditPostModal";
import PostsList from "@/components/PostList";
import { toast } from "sonner";
import {
    createPost,
    deletePost,
    getAllPosts,
    Post,
    PostRequestDto,
    updatePost,
} from "@/api/postsApi";
import { useLoading } from "@/hooks/useLoading";

const Posts: React.FC = () => {
    const { token, user } = useAuth();
    const [posts, setPosts] = useState<Post[]>([]);
    const [comments, setComments] = useState<CommentResponseDto[]>([]);
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [isCommentModalOpen, setCommentModalOpen] = useState(false);
    const [selectedPost, setSelectedPost] = useState<Post | null>(null);
    const [selectedPostComments, setSelectedPostComments] = useState<number | null>(null);
    const [image, setImage] = useState<File | null>(null);
    const [newCommentContent, setNewCommentContent] = useState<string>("");
    const { isLoading, setIsLoading } = useLoading();

    const [formData, setFormData] = useState<PostRequestDto>({
        title: "",
        content: "",
        userId: user?.userId?.toString() || "0",
        status: "ACTIVE",
    });

    const navigate = useNavigate();

    useEffect(() => {

        const fetchPosts = async () => {
            setIsLoading(true);
            if (!token) return;
            try {
                const fetchedPosts = await getAllPosts(token);
                setPosts(fetchedPosts);
            } catch (error) {
                console.error("Error fetching posts:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPosts();
    }, [token]);

    const fetchComments = async (postId: number) => {
        setIsLoading(true);
        try {
            const fetchedComments = await getCommentsByPostId(postId, token!);
            setComments(fetchedComments);
            setSelectedPostComments(postId);
            setCommentModalOpen(true);
        } catch (error) {
            console.error("Error fetching comments:", error);
        }
        setIsLoading(false);
    };

    const handleAddComment = async () => {
        setIsLoading(true);
        if (!token || !user || !selectedPostComments) return;
        try {
            const newComment = {
                userId: Number(user.userId),
                postId: selectedPostComments,
                content: newCommentContent,
            };
            const savedComment = await createComment(newComment, token);
            setComments((prevComments) => [...prevComments, savedComment]);
            setNewCommentContent("");
        } catch (error) {
            console.error("Error adding comment:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreateOrEditPost = async () => {
        setIsLoading(true);
        if (!user || !token) return;

        try {
            const savedPost = selectedPost
                ? await updatePost(selectedPost.postId, formData, image, token)
                : await createPost(formData, image, token);

            if (savedPost) {
                setPosts((prevPosts) =>
                    selectedPost
                        ? prevPosts.map((post) => (post.postId === savedPost.postId ? savedPost : post))
                        : [savedPost, ...prevPosts]
                );

                toast.success("Post actualizado correctamente");
                setEditModalOpen(false);
                setSelectedPost(null);
                setFormData({
                    title: "",
                    content: "",
                    userId: String(user.userId),
                    status: "ACTIVE",
                });
                setImage(null);
            }
        } catch (error) {
            console.error("Error handling post:", error);
            toast.error("No se pudo actualizar el post");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeletePost = async (postId: number, token: string) => {
        setIsLoading(true);
        try {
            await deletePost(postId, token);
            setPosts((prevPosts) => prevPosts.filter((post) => post.postId !== postId));
        } catch (error) {
            console.error("Error deleting post:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-6 relative flex flex-col items-center">
            {/* Botón de regreso */}
            <Button
                className="absolute top-4 left-4 flex items-center bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-2 sm:px-4 sm:py-2 rounded-lg shadow-md"
                onClick={() => navigate("/")}
            >
                <FaArrowLeft className="mr-2" />
                Regresar
            </Button>

            {/* Encabezado */}
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 mt-12 w-full max-w-3xl space-y-4 sm:space-y-0">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
                    Publicaciones
                </h1>
                <Button
                    className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold flex items-center"
                    onClick={() => setEditModalOpen(true)}
                >
                    <FaPlus className="mr-2" /> Nueva Publicación
                </Button>
            </div>

            {/* Contenedor de publicaciones */}
            <div className="flex-1 w-full max-w-3xl overflow-y-auto pb-6">
                {isLoading ? (
                    <p className="text-center text-gray-500">
                        Cargando publicaciones...
                    </p>
                ) : posts.length === 0 ? (
                    <div className="flex flex-col items-center space-y-4 mt-12">
                        <FaRegFrown className="text-6xl text-gray-400" />
                        <h2 className="text-xl font-semibold text-gray-600">
                            ¡No hay publicaciones aún!
                        </h2>
                        <p className="text-gray-500 text-center">
                            Crea una nueva publicación para que aparezca aquí.
                        </p>
                        <Button
                            className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-4 py-2 mt-4"
                            onClick={() => setEditModalOpen(true)}
                        >
                            <FaPlus className="mr-2" /> Nueva Publicación
                        </Button>
                    </div>
                ) : (
                    <PostsList
                        posts={posts}
                        onEdit={(post: Post) => {
                            setSelectedPost(post);
                            setFormData({
                                title: post.title,
                                content: post.content,
                                userId: post.userId.toString(),
                                status: post.status,
                            });
                            setEditModalOpen(true);
                        }}
                        onDelete={(postId: number) => {
                            if (token) {
                                handleDeletePost(postId, token);
                            } else {
                                console.error("Token is null");
                            }
                        }}
                        onViewComments={(postId: number) => fetchComments(postId)}
                    />
                )}
            </div>

            {/* Modales */}
            <CommentsModal
                open={isCommentModalOpen}
                onClose={() => setCommentModalOpen(false)}
                comments={comments}
                newCommentContent={newCommentContent}
                setNewCommentContent={setNewCommentContent}
                handleAddComment={handleAddComment}
            />

            <EditPostModal
                open={isEditModalOpen}
                onClose={() => setEditModalOpen(false)}
                formData={formData}
                setFormData={setFormData}
                handleSave={handleCreateOrEditPost}
                image={image}
                setImage={setImage}
                isEditing={!!selectedPost}
            />
        </div>
    );
};

export default Posts;
