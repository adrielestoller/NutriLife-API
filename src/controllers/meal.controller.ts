import fs from "fs";
import path from "path";
import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import ImageUpload from "../services/image-uploader";

const prisma = new PrismaClient();
const imageUpload = new ImageUpload();

const MealController = {
    async createMeal(req: Request, res: Response) {
        try {
            const { userId, title, description, calories } = req.body;
            let imagePath = null;

            if (req.file) {
                imagePath = `../../uploads/meals/${req.file.filename}`;
            }

            if (!userId) {
                return res
                    .status(400)
                    .json({ error: "ID do usuário é obrigatório." });
            }

            const newMeal = await prisma.meal.create({
                data: {
                    user: {
                        connect: { id: userId },
                    },
                    title,
                    description,
                    calories: parseInt(calories, 10),
                    datetime: new Date(),
                    image: imagePath,
                },
            });

            return res.status(201).json(newMeal);
        } catch (error) {
            console.error("Erro ao criar refeição:", error);
            return res.status(500).json({ error: "Erro ao criar refeição" });
        }
    },

    async updateMeal(req: Request, res: Response) {
        try {
            const mealId = req.params.mealId;
            const { title, description, calories } = req.body;
            let imagePath = null;

            if (req.file) {
                imagePath = `../../uploads/meals/${req.file.filename}`;
            }

            const meal = await prisma.meal.findUnique({
                where: { id: parseInt(mealId) },
            });

            if (!meal) {
                return res
                    .status(404)
                    .json({ error: "Refeição não encontrada" });
            }

            if (imagePath && meal.image) {
                const oldImagePath = path.join(__dirname, meal.image);
                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath);
                }
            }

            const updatedMeal = await prisma.meal.update({
                where: { id: parseInt(mealId) },
                data: {
                    title,
                    description,
                    calories: parseInt(calories, 10),

                    image: imagePath || meal.image,
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

    async deleteMeal(req: Request, res: Response) {
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

            if (meal.image) {
                const imagePath = path.join(__dirname, meal.image);
                if (fs.existsSync(imagePath)) {
                    fs.unlinkSync(imagePath);
                }
            }

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
