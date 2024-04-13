import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { BadRequest } from "./_errors/bad-request";

export async function getAttendeeBadge(app: FastifyInstance){
  app
    .withTypeProvider<ZodTypeProvider>()
    .get('/attendees/:attendeeId/badge', {
      schema: {
        summary: "Get attendee badge",
        tags: ["Attendee"], 
        params: z.object({
          attendeeId: z.coerce.number().int(),
        }),
        response: {
          200: z.object({
            badge: z.object({
              name: z.string(),
              email: z.string().email(),
              eventTitle: z.string(),
              checkInURL: z.string().url()
            })
          })
        }
      }
    },async (req,res)=>{
      const { attendeeId } = req.params

      const attendee = await prisma.attendee.findUnique({
        select: {
          name: true,
          email: true,
          event: {
            select: {
              title: true
            }
          }
        },
        where: {
          id: attendeeId
        }
      })

      console.log(attendeeId)

      if(attendee === null){
        throw new BadRequest("attendee not found!")
      }

      const baseURL = `${req.protocol}://${req.hostname}`
      console.log(baseURL)


      const checkInURL = new URL(`/attendees/${attendeeId}/check-in`, baseURL)


      return res.send({
        badge: {
          name: attendee.name,
          email: attendee.email,
          eventTitle: attendee.event.title,
          checkInURL: checkInURL.toString()


        }
      })
    })

}