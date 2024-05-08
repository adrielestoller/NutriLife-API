import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Users's CRUD
 */
const UserController = {

  /**
   * @swagger
   * /users:
   *   post:
   *     summary: Cria um novo usuário
   *     tags:
   *       - Users
   *     requestBody:
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               name:
   *                 type: string
   *                 description: Nome do usuário
   *               email:
   *                 type: string
   *                 description: Email do usuário
   *               role:
   *                 type: string
   *                 description: Função do usuário (por exemplo, "admin" ou "user")
   *               bio:
   *                 type: string
   *                 description: Biografia do perfil do usuário (opcional)
   *     responses:
   *       '201':
   *         description: Usuário criado com sucesso
   *       '400':
   *         description: Requisição inválida ou dados ausentes
   *       '500':
   *         description: Erro ao criar usuário
   */
  async createUser(req: Request, res: Response) {
    try {
      if (!req.body) {
        return res.status(400).json({ error: "Requisição inválida" });
      }

      const { name, email, role, bio } = req.body;
      const newUser = await prisma.user.create({
        data: {
          name,
          email,
          role,
          profile: bio
            ? {
                create: {
                  bio,
                },
              }
            : undefined,
        },
      });

      console.log("Novo usuário criado:", newUser);
      return res.status(201).json(newUser);
    } catch (error) {
      console.error("Erro ao criar usuário:", error);
      return res.status(500).json({ error: "Erro ao criar usuário" });
    }
  },

  /**
   * @swagger
   * /users:
   *   get:
   *     summary: Obtém todos os usuários
   *     tags:
   *       - Users
   *     responses:
   *       '200':
   *         description: Lista de usuários obtida com sucesso
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 type: object
   *                 properties:
   *                   id:
   *                     type: string
   *                     description: ID do usuário
   *                   name:
   *                     type: string
   *                     description: Nome do usuário
   *                   email:
   *                     type: string
   *                     description: Email do usuário
   *                   role:
   *                     type: string
   *                     description: Função do usuário
   *                   profile:
   *                     type: object
   *                     description: Perfil do usuário (se houver)
   *       '500':
   *         description: Erro ao obter usuários
   */
  async getAllUsers(req: Request, res: Response) {
    try {
      const users = await prisma.user.findMany();
      return res.status(200).json(users);
    } catch (error) {
      console.error("Erro ao obter usuários:", error);
      return res.status(500).json({ error: "Erro ao obter usuários" });
    }
  },

  /**
   * @swagger
   * /users/{userId}:
   *   get:
   *     summary: Obtém um usuário por ID
   *     tags:
   *       - Users
   *     parameters:
   *       - in: path
   *         name: userId
   *         required: true
   *         schema:
   *           type: string
   *         description: ID do usuário a ser obtido
   *     responses:
   *       '200':
   *         description: Usuário encontrado com sucesso
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 id:
   *                   type: string
   *                   description: ID do usuário
   *                 name:
   *                   type: string
   *                   description: Nome do usuário
   *                 email:
   *                   type: string
   *                   description: Email do usuário
   *                 role:
   *                   type: string
   *                   description: Função do usuário
   *                 profile:
   *                   type: object
   *                   description: Perfil do usuário (se houver)
   *       '404':
   *         description: Usuário não encontrado
   *       '500':
   *         description: Erro ao obter usuário
   */
  async getUserById(req: Request, res: Response) {
    try {
      const userId = req.params.userId;

      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          profile: true,
        },
      });

      if (!user) {
        return res.status(404).json({ error: "Usuário não encontrado" });
      }

      return res.status(200).json(user);
    } catch (error) {
      console.error("Erro ao buscar usuário:", error);
      return res.status(500).json({ error: "Erro ao buscar usuário" });
    }
  },

  /**
   * @swagger
   * /users/{userId}:
   *   delete:
   *     summary: Exclui um usuário por ID
   *     tags:
   *       - Users
   *     parameters:
   *       - in: path
   *         name: userId
   *         required: true
   *         schema:
   *           type: string
   *         description: ID do usuário a ser excluído
   *     responses:
   *       '200':
   *         description: Usuário excluído com sucesso
   *       '500':
   *         description: Erro ao excluir usuário
   */
  async deleteUserById(req: Request, res: Response) {
    try {
      const userId = req.params.userId;

      await prisma.post.deleteMany({
        where: { authorId: userId },
      });

      await prisma.profile.deleteMany({
        where: { userId },
      });

      await prisma.preference.deleteMany({
        where: { userId },
      });

      await prisma.meal.deleteMany({
        where: { userId },
      });

      await prisma.user.delete({
        where: { id: userId },
      });

      return res.status(200).json({ message: "Usuário excluído com sucesso" });
    } catch (error) {
      console.error("Erro ao excluir usuário:", error);
      return res.status(500).json({ error: "Erro ao excluir usuário" });
    }
  },
};

export default UserController;
