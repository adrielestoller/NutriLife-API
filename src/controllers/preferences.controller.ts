import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

/**
 * @swagger
 * tags:
 *   name: Preferences
 *   description: Preferences's CRUD
 */
const PreferenceController = {
  /**
   * @swagger
   * /preferences:
   *   post:
   *     summary: Cria uma nova preferência
   *     tags:
   *       - Preferences
   *     requestBody:
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               userId:
   *                 type: string
   *                 description: ID do usuário associado à preferência
   *               data:
   *                 type: object
   *                 description: Dados da preferência a serem criados
   *     responses:
   *       '201':
   *         description: Preferência criada com sucesso
   *       '400':
   *         description: ID de usuário não fornecido
   *       '500':
   *         description: Erro ao criar preferência
   */
  async createPreference(req: Request, res: Response) {
    try {
      const { userId, ...preferenceData } = req.body;

      if (!userId) {
        return res.status(400).json({ error: "ID de usuário não fornecido" });
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

  /**
   * @swagger
   * /preferences/{userId}:
   *   get:
   *     summary: Obtém todas as preferências por ID de usuário
   *     tags:
   *       - Preferences
   *     parameters:
   *       - in: path
   *         name: userId
   *         schema:
   *           type: string
   *         required: true
   *         description: ID do usuário associado às preferências
   *     responses:
   *       '200':
   *         description: Preferências encontradas com sucesso
   *       '400':
   *         description: ID de usuário não fornecido
   *       '500':
   *         description: Erro ao obter preferências
   */
  async getPreferencesByUserId(req: Request, res: Response) {
    try {
      const userId = req.params.userId;

      if (!userId) {
        return res.status(400).json({ error: "ID de usuário não fornecido" });
      }

      const preferences = await prisma.preference.findMany({
        where: { userId },
      });

      return res.status(200).json(preferences);
    } catch (error) {
      console.error("Erro ao obter preferências:", error);
      return res.status(500).json({ error: "Erro ao obter preferências" });
    }
  },

  /**
   * @swagger
   * /preferences:
   *   get:
   *     summary: Obtém todas as preferências
   *     tags:
   *       - Preferences
   *     responses:
   *       '200':
   *         description: Lista de preferências obtida com sucesso
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 type: object
   *                 properties:
   *                   id:
   *                     type: integer
   *                     description: ID da preferência
   *                   userId:
   *                     type: string
   *                     description: ID do usuário associado
   *                   data:
   *                     type: object
   *                     description: Dados da preferência
   *       '500':
   *         description: Erro ao obter preferências
   */
  async getAllPreferences(req: Request, res: Response) {
    try {
      const preferences = await prisma.preference.findMany();

      return res.status(200).json(preferences);
    } catch (error) {
      console.error("Erro ao obter preferências:", error);
      return res.status(500).json({ error: "Erro ao obter preferências" });
    }
  },

  /**
   * @swagger
   * /preferences/{preferenceId}:
   *   put:
   *     summary: Atualiza uma preferência por ID
   *     tags:
   *       - Preferences
   *     parameters:
   *       - in: path
   *         name: preferenceId
   *         schema:
   *           type: integer
   *         required: true
   *         description: ID da preferência a ser atualizada
   *     requestBody:
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               data:
   *                 type: object
   *                 description: Dados da preferência a serem atualizados
   *     responses:
   *       '200':
   *         description: Preferência atualizada com sucesso
   *       '404':
   *         description: Preferência não encontrada
   *       '500':
   *         description: Erro ao atualizar preferência
   */
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
      return res.status(500).json({ error: "Erro ao atualizar preferência" });
    }
  },

  /**
   * @swagger
   * /preferences/{preferenceId}:
   *   delete:
   *     summary: Exclui uma preferência por ID
   *     tags:
   *       - Preferences
   *     parameters:
   *       - in: path
   *         name: preferenceId
   *         schema:
   *           type: integer
   *         required: true
   *         description: ID da preferência a ser excluída
   *     responses:
   *       '200':
   *         description: Preferência excluída com sucesso
   *       '404':
   *         description: Preferência não encontrada
   *       '500':
   *         description: Erro ao excluir preferência
   */
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
      return res.status(500).json({ error: "Erro ao excluir preferência" });
    }
  },
};

export default PreferenceController;
