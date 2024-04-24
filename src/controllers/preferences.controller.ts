import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

const PreferenceController = {
    async createPreference(req: Request, res: Response) {
        try {
            const { userId, ...preferenceData } = req.body;

            if (!userId) {
                return res
                    .status(400)
                    .json({ error: "ID de usuário não fornecido" });
            }

            const newPreference = await prisma.preference.create({
                data: {
                    ...preferenceData,
                    user: {
                        connect: { id: userId },
                    },
                },
            });

            return res.status(201).json(newPreference);
        } catch (error) {
            console.error("Erro ao criar preferência:", error);
            return res.status(500).json({ error: "Erro ao criar preferência" });
        }
    },

    async getPreferencesByUserId(req: Request, res: Response) {
        try {
            const userId = req.params.userId;

            if (!userId) {
                return res
                    .status(400)
                    .json({ error: "ID de usuário não fornecido" });
            }

            const preferences = await prisma.preference.findMany({
                where: { userId },
            });

            return res.status(200).json(preferences);
        } catch (error) {
            console.error("Erro ao obter preferências:", error);
            return res
                .status(500)
                .json({ error: "Erro ao obter preferências" });
        }
    },

    async getAllPreferences(req: Request, res: Response) {
        try {
            const preferences = await prisma.preference.findMany();

            return res.status(200).json(preferences);
        } catch (error) {
            console.error("Erro ao obter preferências:", error);
            return res
                .status(500)
                .json({ error: "Erro ao obter preferências" });
        }
    },

    async updatePreference(req: Request, res: Response) {
        try {
            const preferenceId = req.params.preferenceId;
            const { ...updateData } = req.body;

            const updatedPreference = await prisma.preference.update({
                where: { id: parseInt(preferenceId) },
                data: updateData,
            });

            return res.status(200).json(updatedPreference);
        } catch (error) {
            console.error("Erro ao atualizar preferência:", error);
            return res
                .status(500)
                .json({ error: "Erro ao atualizar preferência" });
        }
    },

    async deletePreference(req: Request, res: Response) {
        try {
            const preferenceId = req.params.preferenceId;

            await prisma.preference.delete({
                where: { id: parseInt(preferenceId) },
            });

            return res
                .status(200)
                .json({ message: "Preferência excluída com sucesso" });
        } catch (error) {
            console.error("Erro ao excluir preferência:", error);
            return res
                .status(500)
                .json({ error: "Erro ao excluir preferência" });
        }
    },
};

export default PreferenceController;
