import { router } from "./routes/routes"
import express, { Router } from "express"

const app = express()
app.use(express.json())
app.use(router)

app.listen(3000, () => {
    console.log("server is running");
  });