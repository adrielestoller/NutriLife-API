import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import fs from "fs";
import path from "path";
import ImageUpload from "../services/image-uploader";

const prisma = new PrismaClient();
const imageUpload = new ImageUpload();

/**
 * @swagger
 * tags:
 *   name: Posts
 *   description: Posts's CRUD
 */
const PostController = {
  /**
   * @swagger
   * /posts:
   *   post:
   *     summary: Cria um novo post
   *     tags:
   *       - Posts
   *     requestBody:
   *       required: true
   *       content:
   *         multipart/form-data:
   *           schema:
   *             type: object
   *             properties:
   *               title:
   *                 type: string
   *                 description: Título do post
   *               description:
   *                 type: string
   *                 description: Descrição do post
   *               authorId:
   *                 type: string
   *                 description: ID do autor do post
   *               image:
   *                 type: string
   *                 format: binary
   *                 description: Imagem associada ao post
   *     responses:
   *       '201':
   *         description: Post criado com sucesso
   *       '500':
   *         description: Erro ao criar post
   */
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

  /**
   * @swagger
   * /posts/{postId}:
   *   get:
   *     summary: Obtém um post por ID
   *     tags:
   *       - Posts
   *     parameters:
   *       - in: path
   *         name: postId
   *         schema:
   *           type: string
   *         required: true
   *         description: ID do post a ser obtido
   *     responses:
   *       '200':
   *         description: Post obtido com sucesso
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 id:
   *                   type: string
   *                   description: ID do post
   *                 title:
   *                   type: string
   *                   description: Título do post
   *                 description:
   *                   type: string
   *                   description: Descrição do post
   *                 author:
   *                   type: object
   *                   properties:
   *                     id:
   *                       type: string
   *                       description: ID do autor
   *                     name:
   *                       type: string
   *                       description: Nome do autor
   *                 image:
   *                   type: string
   *                   description: URL ou caminho da imagem associada
   *                 categories:
   *                   type: array
   *                   items:
   *                     type: object
   *                     properties:
   *                       id:
   *                         type: string
   *                         description: ID da categoria
   *                       name:
   *                         type: string
   *                         description: Nome da categoria
   *       '404':
   *         description: Post não encontrado
   *       '500':
   *         description: Erro ao obter post
   */
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

  /**
   * @swagger
   * /posts/{postId}:
   *   put:
   *     summary: Atualiza um post por ID
   *     tags:
   *       - Posts
   *     parameters:
   *       - in: path
   *         name: postId
   *         schema:
   *           type: string
   *         required: true
   *         description: ID do post a ser atualizado
   *     requestBody:
   *       required: true
   *       content:
   *         multipart/form-data:
   *           schema:
   *             type: object
   *             properties:
   *               title:
   *                 type: string
   *                 description: Novo título do post
   *               description:
   *                 type: string
   *                 description: Nova descrição do post
   *               published:
   *                 type: boolean
   *                 description: Se o post deve ser publicado
   *               image:
   *                 type: string
   *                 format: binary
   *                 description: Nova imagem do post (opcional)
   *               categories:
   *                 type: array
   *                 items:
   *                   type: string
   *                   description: IDs das categorias associadas
   *     responses:
   *       '200':
   *         description: Post atualizado com sucesso
   *       '404':
   *         description: Post não encontrado
   *       '500':
   *         description: Erro ao atualizar post
   */
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

  /**
   * @swagger
   * /posts/{postId}:
   *   delete:
   *     summary: Deleta um post por ID
   *     tags:
   *       - Posts
   *     parameters:
   *       - in: path
   *         name: postId
   *         schema:
   *           type: string
   *         required: true
   *         description: ID do post a ser deletado
   *     responses:
   *       '204':
   *         description: Post deletado com sucesso
   *       '404':
   *         description: Post não encontrado
   *       '500':
   *         description: Erro ao deletar post
   */
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

      return res.status(200).json({ message: "Post excluído com sucesso" });
    } catch (error) {
      console.error("Erro ao excluir post:", error);
      return res.status(500).json({ error: "Erro ao excluir post" });
    }
  },
};

export default PostController;
