import { accountController } from "../controllers/user/account";
import { Router } from "express";

const router = Router()

router.post("/cadaster", accountController.createAccount)

export {router}