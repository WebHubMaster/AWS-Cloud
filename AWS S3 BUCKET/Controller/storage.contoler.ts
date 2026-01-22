import { Request, Response } from "express"
import { CatchError, TryError } from "../util/Error"
import { downloadObject, isFileExist, updateObject } from "../util/S3"


export const downloadFile = async (req: Request, res: Response)=>{
    try{
        const path = req.body?.path

        if(!path)
            throw TryError("Faild to genrate download url beacuse path is missing", 404)

        const isExist = await isFileExist(path)

        if(!isExist)
            throw TryError("File does't exist", 404)

        const url = await downloadObject(path)
        res.json({url})
    }

    catch(err)
    {
        CatchError(err, res, "Faild to donwlod file")
    }
}

export const uploadFile = async (req: Request, res: Response)=>{
    try{
        const path = req.body?.path
        const type = req.body?.type
        const status = req.body?.status

        if(!path || !type || !status)
            throw TryError("Invalid request path, type or status missing", 400)

        const url = await updateObject(path, type, status)
        res.json({url})
    }

    catch(err)
    {
        CatchError(err, res, "Failed to genrate upload url")
    }
}
