import { FastifyInstance } from "fastify";
import { BadRequest } from "../routes/_errors/bad-request";
import { ZodError } from "zod";
type FastifyErrorHandler = FastifyInstance['errorHandler']

export const errorHandler : FastifyErrorHandler = (error, req, res)=>{

  const {validation, validationContext} = error

  if(error instanceof ZodError ){
    return res.status(400).send({
      message: `Error during validation`,
      errors: error.flatten().fieldErrors
    })
  }

  if(error instanceof BadRequest){
     return res.status(400).send({message: error.message})
  }
  
  
  return res.status(500).send({message: "Internal Server Error!"})
}