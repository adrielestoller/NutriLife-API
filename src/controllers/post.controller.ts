import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import fs from "fs";
import path from "path";
import ImageUpload from "../services/image-uploader";

const prisma = new PrismaClient();
const imageUpload = new ImageUpload();

const PostController = {
    async createPost(req: Request, res: Response) {
        try {
            const { title, description, authorId } = req.body;
            let imagePath = null;

            if (req.file) {
                imagePath = `/uploads/posts/${req.file.filename}`;
            }

            const newPost = await prisma.post.create({
                data: {
                    title,
                    description,
                    published: false,
                    author: {
                        connect: { id: authorId },
                    },
                    image: imagePath,
                },
            });

            return res.status(201).json(newPost);
        } catch (error) {
            console.error("Erro ao criar post:", error);
            return res.status(500).json({ error: "Erro ao criar post" });
        }
    },

    async getPostById(req: Request, res: Response) {
        try {
            const postId = req.params.postId;

            const post = await prisma.post.findUnique({
                where: { id: postId },
                include: { author: true, categories: true },
            });

            if (!post) {
                return res.status(404).json({ error: "Post não encontrado" });
            }

            return res.status(200).json(post);
        } catch (error) {
            console.error("Erro ao obter post:", error);
            return res.status(500).json({ error: "Erro ao obter post" });
        }
    },

    async updatePost(req: Request, res: Response) {
        try {
            const postId = req.params.postId;
            const { title, description, published, categories } = req.body;
            let imagePath = null;

            if (req.file) {
                imagePath = `/uploads/posts/${req.file.filename}`;
            }

            const post = await prisma.post.findUnique({
                where: { id: postId },
            });

            if (!post) {
                return res.status(404).json({ error: "Post não encontrado" });
            }

            if (imagePath && post.image) {
                const oldImagePath = path.join(__dirname, post.image);

                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath);
                }
            }

            const updatedPost = await prisma.post.update({
                where: { id: postId },
                data: {
                    title,
                    description,
                    published,

                    image: imagePath || post.image,

                    categories: categories
                        ? {
                              set: categories.map((categoryId: string) => ({
                                  id: categoryId,
                              })),
                          }
                        : undefined,
                },
            });

            return res.status(200).json(updatedPost);
        } catch (error) {
            console.error("Erro ao atualizar post:", error);
            return res.status(500).json({ error: "Erro ao atualizar post" });
        }
    },

    async deletePost(req: Request, res: Response) {
        try {
            const postId = req.params.postId;

            const post = await prisma.post.findUnique({
                where: { id: postId },
            });

            if (!post) {
                return res.status(404).json({ error: "Post não encontrado" });
            }

            if (post.image) {
                const imagePath = path.join(__dirname, "..", post.image);
                if (fs.existsSync(imagePath)) {
                    fs.unlinkSync(imagePath);
                }
            }

            await prisma.post.delete({
                where: { id: postId },
            });

            return res
                .status(200)
                .json({ message: "Post excluído com sucesso" });
        } catch (error) {
            console.error("Erro ao excluir post:", error);
            return res.status(500).json({ error: "Erro ao excluir post" });
        }
    },
};

export default PostController;
