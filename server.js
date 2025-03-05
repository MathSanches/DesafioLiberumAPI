import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const app = express();
app.use(express.json());
app.use(cors());

app.post('/clientes', async (req, res) => {
    try {
        const { empresa, cnpj } = req.body;

        if (!empresa || !cnpj) {
            return res.status(400).json({ message: "Empresa e CNPJ são obrigatórios!" });
        }

        const newClient = await prisma.cliente.create({
            data: {
                empresa,
                cnpj
            }
        });

        res.status(201).json(newClient);
    } catch (error) {
        console.error("Erro ao criar cliente:", error);
        res.status(500).json({ message: "Erro interno ao criar cliente.", error: error.message });
    }
});

app.get('/clientes', async (req, res) => {
    try {
        let cliente = [];

        if (req.query.empresa) {
            cliente = await prisma.cliente.findMany({
                where: {
                    empresa: req.query.empresa
                }
            });
        } else {
            cliente = await prisma.cliente.findMany();
        }

        res.status(200).json(cliente);
    } catch (error) {
        console.error("Erro ao buscar clientes:", error);
        res.status(500).json({ message: "Erro interno ao buscar clientes.", error: error.message });
    }
});

app.put('/clientes/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { empresa, cnpj, status } = req.body;

        if (!empresa || !cnpj || !status) {
            return res.status(400).json({ message: "Todos os campos (empresa, cnpj, status) são obrigatórios." });
        }

        const existingClient = await prisma.cliente.findUnique({
            where: { id }
        });

        if (!existingClient) {
            return res.status(404).json({ message: "Cliente não encontrado!" });
        }

        const updatedClient = await prisma.cliente.update({
            where: { id },
            data: {
                empresa,
                cnpj,
                status
            }
        });

        return res.status(200).json(updatedClient);
    } catch (error) {
        console.error("Erro ao atualizar cliente:", error);
        return res.status(500).json({ message: "Erro interno ao atualizar o cliente.", error: error.message });
    }
});

app.delete('/clientes/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const existingClient = await prisma.cliente.findUnique({
            where: { id }
        });

        if (!existingClient) {
            return res.status(404).json({ message: "Cliente não encontrado!" });
        }

        await prisma.cliente.delete({
            where: { id }
        });

        res.status(200).json({ message: 'Cliente deletado com sucesso!' });
    } catch (error) {
        console.error("Erro ao deletar cliente:", error);
        res.status(500).json({ message: "Erro interno ao deletar cliente.", error: error.message });
    }
});

app.listen(3000, () => {
    console.log("Servidor rodando na porta 3000...");
});
