import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

const ProfileController = {
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
