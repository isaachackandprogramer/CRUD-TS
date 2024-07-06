import { Request, Response } from "express"
import bcrypt from "bcrypt"
import {PrismaClient} from "@prisma/client"

const prisma = new PrismaClient()

export const accountController = {
    async registerAccount(req: Request, res: Response) {
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
    },

    async authController(req: Request, res: Response) {
        try {
            const {email, password} = req.body

            const user = await prisma.user.findUnique({
                where: {
                    email: email
                }, select: {
                    name: true,
                    nickName: true,
                    email: true,
                    password: true
                }
            })

            if(!user) {
               return res.status(401).json({message: "email ou senha incorretos"})
            }
        
            const verificaSenha = await bcrypt.compare(password, user.password)

            if (!verificaSenha) {
                return res.status(401).json({message: "email ou senha incorretos"})
            }

            res.status(200).json({ message: 'logado !' })
            
        } catch (err) {
            res.status(500).json({message: `houve um erro: ${err}`})
        }
    }
        
}