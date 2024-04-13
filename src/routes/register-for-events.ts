import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { BadRequest } from "./_errors/bad-request";


export async function registerForEvents(app: FastifyInstance){
  app
  .withTypeProvider<ZodTypeProvider>()
  .post("/events/:eventId/attendees", {
    schema: {
      summary: "Resgister for event",
      tags: ["Attendee"], 
      body: z.object({
        name: z.string().min(2),
        email: z.string().email(),
      }),
      params: z.object({
        eventId:  z.string().uuid()
      }),
      response: {
        201: z.object({
          attendeeId: z.number( )
        })
      }
    }
  }, async (req,res)=>{
      const {eventId} = req.params
      const {name, email} = req.body
      const emailExistsInEvent = await prisma.attendee.findUnique({
        where: {
          eventId_email: {
            email,
            eventId
          }
        }
      })

      if(emailExistsInEvent){
        throw new BadRequest("Already exists a attendee with the same email")
      }

      const [event, ammountOfAttendeesForEvent] = await Promise.all([
        prisma.event.findUnique({
          where: {
            id: eventId
          }
        }),
        prisma.attendee.count({
          where: {
            eventId
          }
        })
      ])


      if(event?.maximumAttendees && ammountOfAttendeesForEvent >= event?.maximumAttendees){
        throw new BadRequest(`the maximum number of attendees for this event has been reached`)
      }


      const attendee = await prisma.attendee.create({
        data: {
          name,
          email,
          eventId,        
        }
      })

      return res.status(201).send({attendeeId: attendee.id})
    })
}