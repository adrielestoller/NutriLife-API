import fs from "fs";
import path from "path";
import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import ImageUpload from "../services/image-uploader";

const prisma = new PrismaClient();
const imageUpload = new ImageUpload();

/**
 * @swagger
 * tags:
 *   name: Meals
 *   description: Meals's CRUD
 */
const MealController = {
  /**
   * @swagger
   * /meals:
   *   post:
   *     summary: Cria uma nova refeição
   *     tags:
   *       - Meals
   *     requestBody:
   *       content:
   *         multipart/form-data:
   *           schema:
   *             type: object
   *             properties:
   *               userId:
   *                 type: string
   *                 description: ID do usuário associado à refeição
   *               title:
   *                 type: string
   *                 description: Título da refeição
   *               description:
   *                 type: string
   *                 description: Descrição da refeição
   *               calories:
   *                 type: integer
   *                 description: Calorias na refeição
   *               image:
   *                 type: string
   *                 format: binary
   *                 description: Imagem associada à refeição (opcional)
   *     responses:
   *       '201':
   *         description: Refeição criada com sucesso
   *       '400':
   *         description: Dados de entrada inválidos
   *       '500':
   *         description: Erro ao criar refeição
   */
  async createMeal(req: Request, res: Response) {
    try {
      const { userId, title, description, calories } = req.body;
      let imagePath = null;

      if (req.file) {
        imagePath = `../../uploads/meals/${req.file.filename}`;
      }

      if (!userId) {
        return res.status(400).json({ error: "ID do usuário é obrigatório." });
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

  /**
   * @swagger
   * /meals/{mealId}:
   *   put:
   *     summary: Atualiza uma refeição por ID
   *     tags:
   *       - Meals
   *     parameters:
   *       - in: path
   *         name: mealId
   *         required: true
   *         schema:
   *           type: integer
   *         description: ID da refeição a ser atualizada
   *     requestBody:
   *       content:
   *         multipart/form-data:
   *           schema:
   *             type: object
   *             properties:
   *               title:
   *                 type: string
   *                 description: Título da refeição
   *               description:
   *                 type: string
   *                 description: Descrição da refeição
   *               calories:
   *                 type: integer
   *                 description: Calorias na refeição
   *               image:
   *                 type: string
   *                 format: binary
   *                 description: Nova imagem da refeição (opcional)
   *     responses:
   *       '200':
   *         description: Refeição atualizada com sucesso
   *       '404':
   *         description: Refeição não encontrada
   *       '500':
   *         description: Erro ao atualizar refeição
   */
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
        return res.status(404).json({ error: "Refeição não encontrada" });
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
      return res.status(500).json({ error: "Erro ao atualizar refeição" });
    }
  },

  /**
   * @swagger
   * /meals:
   *   get:
   *     summary: Obtém todas as refeições
   *     tags:
   *       - Meals
   *     parameters:
   *       - in: query
   *         name: page
   *         schema:
   *           type: integer
   *           minimum: 1
   *         description: Número da página para paginação
   *       - in: query
   *         name: limit
   *         schema:
   *           type: integer
   *           minimum: 1
   *         description: Número de refeições por página
   *     responses:
   *       '200':
   *         description: Lista de refeições obtida com sucesso
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 type: object
   *                 properties:
   *                   id:
   *                     type: integer
   *                     description: ID da refeição
   *                   userId:
   *                     type: string
   *                     description: ID do usuário associado
   *                   title:
   *                     type: string
   *                     description: Título da refeição
   *                   description:
   *                     type: string
   *                     description: Descrição da refeição
   *                   calories:
   *                     type: integer
   *                     description: Calorias na refeição
   *                   datetime:
   *                     type: string
   *                     format: date-time
   *                     description: Data e hora da refeição
   *                   image:
   *                     type: string
   *                     description: Caminho ou URL da imagem da refeição
   *       '500':
   *         description: Erro ao obter refeições
   */
  async getAllMeals(req: Request, res: Response) {
    try {
      const meals = await prisma.meal.findMany();

      return res.status(200).json(meals);
    } catch (error) {
      console.error("Erro ao obter refeições:", error);
      return res.status(500).json({ error: "Erro ao obter refeições" });
    }
  },

  /**
   * @swagger
   * /meals/{mealId}:
   *   get:
   *     summary: Obtém uma refeição por ID
   *     tags:
   *       - Meals
   *     parameters:
   *       - in: path
   *         name: mealId
   *         required: true
   *         schema:
   *           type: integer
   *         description: ID da refeição a ser obtida
   *     responses:
   *       '200':
   *         description: Refeição encontrada com sucesso
   *       '404':
   *         description: Refeição não encontrada
   *       '500':
   *         description: Erro ao obter refeição
   */
  async getMealById(req: Request, res: Response) {
    try {
      const mealId = req.params.mealId;

      const meal = await prisma.meal.findUnique({
        where: { id: parseInt(mealId) },
      });

      if (!meal) {
        return res.status(404).json({ error: "Refeição não encontrada" });
      }

      return res.status(200).json(meal);
    } catch (error) {
      console.error("Erro ao obter refeição:", error);
      return res.status(500).json({ error: "Erro ao obter refeição" });
    }
  },

  /**
   * @swagger
   * /meals/{mealId}:
   *   delete:
   *     summary: Exclui uma refeição por ID
   *     tags:
   *       - Meals
   *     parameters:
   *       - in: path
   *         name: mealId
   *         required: true
   *         schema:
   *           type: integer
   *         description: ID da refeição a ser excluída
   *     responses:
   *       '200':
   *         description: Refeição excluída com sucesso
   *       '404':
   *         description: Refeição não encontrada
   *       '500':
   *         description: Erro ao excluir refeição
   */
  async deleteMeal(req: Request, res: Response) {
    try {
      const mealId = req.params.mealId;

      const meal = await prisma.meal.findUnique({
        where: { id: parseInt(mealId) },
      });

      if (!meal) {
        return res.status(404).json({ error: "Refeição não encontrada" });
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

      return res.status(200).json({ message: "Refeição excluída com sucesso" });
    } catch (error) {
      console.error("Erro ao excluir refeição:", error);
      return res.status(500).json({ error: "Erro ao excluir refeição" });
    }
  },
};

export default MealController;
