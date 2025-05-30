import { Request, Response } from "express";
import handleAsync from "../../../shared/handleAsync";


const registerController = handleAsync(async(req:Request,res:Response)=>{
   const userData = req.body;
   
})

export default {
    registerController
}