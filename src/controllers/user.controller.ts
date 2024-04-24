import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

const UserController = {
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

    async getAllUsers(req: Request, res: Response) {
        try {
            const users = await prisma.user.findMany();
            return res.status(200).json(users);
        } catch (error) {
            console.error("Erro ao obter usuários:", error);
            return res.status(500).json({ error: "Erro ao obter usuários" });
        }
    },

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
                return res
                    .status(404)
                    .json({ error: "Usuário não encontrado" });
            }

            return res.status(200).json(user);
        } catch (error) {
            console.error("Erro ao buscar usuário:", error);
            return res.status(500).json({ error: "Erro ao buscar usuário" });
        }
    },

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

            return res
                .status(200)
                .json({ message: "Usuário excluído com sucesso" });
        } catch (error) {
            console.error("Erro ao excluir usuário:", error);
            return res.status(500).json({ error: "Erro ao excluir usuário" });
        }
    },
};

export default UserController;
