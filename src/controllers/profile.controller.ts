import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

/**
 * @swagger
 * tags:
 *   name: Profiles
 *   description: Profiles's CRUD
 */
const ProfileController = {
    /**
     * @swagger
     * /profiles:
     *   post:
     *     summary: Cria um novo perfil para um usuário
     *     tags:
     *       - Profiles
     *     requestBody:
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               userId:
     *                 type: string
     *                 description: ID do usuário associado ao perfil
     *               bio:
     *                 type: string
     *                 description: Biografia do perfil
     *     responses:
     *       '201':
     *         description: Perfil criado com sucesso
     *       '400':
     *         description: ID de usuário não fornecido ou perfil já existente
     *       '500':
     *         description: Erro ao criar perfil
     */
    async createProfile(req: Request, res: Response) {
        try {
            const { bio, userId } = req.body;

            if (!userId) {
                return res
                    .status(400)
                    .json({ error: "ID de usuário não fornecido" });
            }

            const existingProfile = await prisma.profile.findUnique({
                where: { userId: userId },
            });

            if (existingProfile) {
                return res
                    .status(400)
                    .json({ error: "O usuário já possui um perfil" });
            }

            const newProfile = await prisma.profile.create({
                data: {
                    bio,
                    user: {
                        connect: {
                            id: userId,
                        },
                    },
                },
            });

            return res.status(201).json(newProfile);
        } catch (error) {
            console.error("Erro ao criar perfil:", error);
            return res.status(500).json({ error: "Erro ao criar perfil" });
        }
    },

    /**
     * @swagger
     * /profiles/{userId}:
     *   get:
     *     summary: Obtém o perfil de um usuário pelo ID de usuário
     *     tags:
     *       - Profiles
     *     parameters:
     *       - in: path
     *         name: userId
     *         required: true
     *         schema:
     *           type: string
     *         description: ID do usuário associado ao perfil
     *     responses:
     *       '200':
     *         description: Perfil encontrado com sucesso
     *       '404':
     *         description: Perfil não encontrado
     *       '500':
     *         description: Erro ao obter perfil
     */
    async getProfileByUserId(req: Request, res: Response) {
        try {
            const userId = req.params.userId;
            const profile = await prisma.profile.findUnique({
                where: { userId: userId },
            });
            if (!profile) {
                return res.status(404).json({ error: "Perfil não encontrado" });
            }
            return res.status(200).json(profile);
        } catch (error) {
            console.error("Erro ao obter perfil:", error);
            return res.status(500).json({ error: "Erro ao obter perfil" });
        }
    },

    /**
     * @swagger
     * /profiles/{userId}:
     *   put:
     *     summary: Atualiza o perfil de um usuário pelo ID de usuário
     *     tags:
     *       - Profiles
     *     parameters:
     *       - in: path
     *         name: userId
     *         required: true
     *         schema:
     *           type: string
     *         description: ID do usuário associado ao perfil
     *     requestBody:
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               bio:
     *                 type: string
     *                 description: Nova biografia do perfil
     *     responses:
     *       '200':
     *         description: Perfil atualizado com sucesso
     *       '404':
     *         description: Perfil não encontrado
     *       '500':
     *         description: Erro ao atualizar perfil
     */
    async updateProfile(req: Request, res: Response) {
        try {
            const userId = req.params.userId;
            const { bio } = req.body;
            const updatedProfile = await prisma.profile.update({
                where: { userId: userId },
                data: { bio },
            });

            return res.status(200).json(updatedProfile);
        } catch (error) {
            console.error("Erro ao atualizar perfil:", error);
            return res.status(500).json({ error: "Erro ao atualizar perfil" });
        }
    },

    /**
     * @swagger
     * /profiles/{userId}:
     *   delete:
     *     summary: Exclui o perfil de um usuário pelo ID de usuário
     *     tags:
     *       - Profiles
     *     parameters:
     *       - in: path
     *         name: userId
     *         required: true
     *         schema:
     *           type: string
     *         description: ID do usuário associado ao perfil
     *     responses:
     *       '200':
     *         description: Perfil excluído com sucesso
     *       '404':
     *         description: Perfil não encontrado
     *       '500':
     *         description: Erro ao excluir perfil
     */
    async deleteProfile(req: Request, res: Response) {
        try {
            const userId = req.params.userId;

            await prisma.profile.delete({
                where: { userId: userId },
            });

            return res
                .status(200)
                .json({ message: "Perfil excluído com sucesso" });
        } catch (error) {
            console.error("Erro ao excluir perfil:", error);
            return res.status(500).json({ error: "Erro ao excluir perfil" });
        }
    },
};

export default ProfileController;
