import { Request, Response } from "express"
import bcrypt from "bcrypt"
import {PrismaClient} from "@prisma/client"

const prisma = new PrismaClient()

export const accountController = {
    async createAccount(req: Request, res: Response) {
        try {
            const {name, email, nickName, password} = req.body

        const checkUnique = await prisma.user.findFirst({
            where: {
                OR: [
                    {
                        email: email
                    },
                    {
                        nickName: nickName
                    }
                ]
            }
        }) 

        const passwordHash = await bcrypt.hash(password, 12);

        if(email === checkUnique?.email) {
            return res.status(409).json({message: "email ja cadastrado"})
        }
        
        if (nickName === checkUnique?.nickName) {
            return res.status(409).json({message: "nickName ja cadastrado"})
        }

        const createUser = await prisma.user.create({
            data: {
                email: email,
                nickName: nickName,
                password: passwordHash,
                name:  name
            }
        })

        res.status(201).json({message: "usuario criado com sucesso"})
        } catch (err) {
            res.status(500).json({messae: `houve um erro: ${err}`})
        }
    }
}