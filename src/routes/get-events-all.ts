import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../lib/prisma";
// import { BadRequest } from "./_errors/bad-request";

export async function getEventsAll(app: FastifyInstance){
  app
    .withTypeProvider<ZodTypeProvider>()
    .get("/events", {
      schema: {
        summary: "Get all events",
        tags: ["events"],
        response: {
          200: z.array(
              z.object({
                id: z.string().uuid(),
                title: z.string(),
                slug: z.string(),
                details: z.string().nullable(),
                maximumAttendees: z.number().int().nullable(),
              }))
        }
      }
    }, async (req,res)=>{
      
      const events = await prisma.event.findMany({
        select: {
          id: true,
          title: true,
          slug: true,
          details: true,
          maximumAttendees: true,
        }
      })

      return res.send(events)
    })
}

