import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

const MealController = {
    async createMeal(req: Request, res: Response) {
        try {
            const { userId, description, calories, datetime } = req.body;

            if (!userId || !datetime) {
                return res.status(400).json({
                    error: "ID de usuário e data/hora da refeição são obrigatórios",
                });
            }

            const newMeal = await prisma.meal.create({
                data: {
                    user: {
                        connect: { id: userId },
                    },
                    description,
                    calories,
                    datetime: new Date(datetime),
                },
            });

            return res.status(201).json(newMeal);
        } catch (error) {
            console.error("Erro ao criar refeição:", error);
            return res.status(500).json({ error: "Erro ao criar refeição" });
        }
    },

    async getAllMeals(req: Request, res: Response) {
        try {
            const meals = await prisma.meal.findMany();

            return res.status(200).json(meals);
        } catch (error) {
            console.error("Erro ao obter refeições:", error);
            return res.status(500).json({ error: "Erro ao obter refeições" });
        }
    },

    async getMealById(req: Request, res: Response) {
        try {
            const mealId = req.params.mealId;

            const meal = await prisma.meal.findUnique({
                where: { id: parseInt(mealId) },
            });

            if (!meal) {
                return res
                    .status(404)
                    .json({ error: "Refeição não encontrada" });
            }

            return res.status(200).json(meal);
        } catch (error) {
            console.error("Erro ao obter refeição:", error);
            return res.status(500).json({ error: "Erro ao obter refeição" });
        }
    },

    async updateMeal(req: Request, res: Response) {
        try {
            const mealId = req.params.mealId;
            const { description, calories, datetime } = req.body;

            const updatedMeal = await prisma.meal.update({
                where: { id: parseInt(mealId) },
                data: {
                    description,
                    calories,
                    datetime: datetime ? new Date(datetime) : undefined,
                },
            });

            return res.status(200).json(updatedMeal);
        } catch (error) {
            console.error("Erro ao atualizar refeição:", error);
            return res
                .status(500)
                .json({ error: "Erro ao atualizar refeição" });
        }
    },

    async deleteMeal(req: Request, res: Response) {
        try {
            const mealId = req.params.mealId;

            await prisma.meal.delete({
                where: { id: parseInt(mealId) },
            });

            return res
                .status(200)
                .json({ message: "Refeição excluída com sucesso" });
        } catch (error) {
            console.error("Erro ao excluir refeição:", error);
            return res.status(500).json({ error: "Erro ao excluir refeição" });
        }
    },
};

export default MealController;
