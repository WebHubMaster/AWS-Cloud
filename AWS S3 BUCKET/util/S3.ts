import { GetObjectCommand, HeadObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"

export const connection = new S3Client({
    region: process.env.REGION,
    endpoint:`https://s3-${process.env.REGION}.amazonaws.com`,
    credentials:{
        accessKeyId:process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!
    }
})

export const isFileExist = async (path: string)=>{
    try{
        const command = new HeadObjectCommand({
            Bucket: process.env.S3_BUCKET,
            Key: path
        })
        await connection.send(command)
        return true
    }

    catch(err)
    {
        return false
    }
}

export const downloadObject = async (path: string, expiresIn: number = 60)=>{
    const options = {
        Bucket:process.env.S3_BUCKET,
        Key:path
    } 

    const command = new GetObjectCommand(options)

    const url = await getSignedUrl(connection, command, {expiresIn: expiresIn})
    return url
}

export const updateObject = async (path: string, type: string)=>{
    const command = new PutObjectCommand({
        Bucket: process.env.S3_BUCKET,
        Key: path,
        ContentType: type
    })

    const url = await getSignedUrl(connection, command, {expiresIn: 60})
    return url
}