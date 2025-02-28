import express from 'express'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const app = express()
app.use(express.json())

app.post('/clientes', async (req, res) => {
    
    await prisma.cliente.create({
        data: {
            empresa: req.body.empresa,
            cnpj: req.body.cnpj
        },
    })

    res.status(201).json(req.body)
})

app.get('/clientes', async (req, res) => {
    let cliente = []

    if (req.query) {
        cliente = await prisma.cliente.findMany({
            where: {
                empresa: req.query.empresa
            }
        })
    } else {
        cliente = await prisma.cliente.findMany()
    }

    res.status(200).json(cliente)
})

app.put('/clientes/:id', async (req, res) => {
    
    await prisma.cliente.update({
        where:{
            id: req.params.id
        },
        data: {
            empresa: req.body.empresa,
            cnpj: req.body.cnpj
        },
    })

    res.status(201).json(req.body)
})

app.delete('/clientes/:id', async (req, res) => {
    
    await prisma.cliente.delete({
        where:{
            id: req.params.id
        },
    })

    res.status(200).json({ message: 'Usuário deletado com Sucesso!'})
})

app.listen(3000)

/*

user - mmarianosanches

password - EhFWdjGpSDpgTmfj


*/