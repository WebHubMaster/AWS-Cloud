import { Router } from "express"
import { downloadFile, uploadFile } from "../controller/storage.contoler"

const StorageRouter = Router()

StorageRouter.post("/download", downloadFile)
StorageRouter.post("/upload", uploadFile)

export default StorageRouter