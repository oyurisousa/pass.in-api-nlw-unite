import fastify from "fastify";

import {fastifySwagger} from "@fastify/swagger"
import {fastifySwaggerUi} from "@fastify/swagger-ui"

import { serializerCompiler, validatorCompiler, ZodTypeProvider,jsonSchemaTransform } from "fastify-type-provider-zod";

import fastifyCors from "@fastify/cors";

import { createEvent } from "./routes/create-events";
import { registerForEvents } from "./routes/register-for-events";
import { getEvent } from "./routes/get-event";
import { getAttendeeBadge } from "./routes/get-attendee-badge";
import { checkIn } from "./routes/check-in";
import { getEventAttendees } from "./routes/get-event-attendees";
import { errorHandler } from "./utils/error-handler";
import { getEventsAll } from "./routes/get-events-all";

export const app = fastify().withTypeProvider<ZodTypeProvider>()

app.register(fastifyCors, {
  origin: "*"
})

app.register(fastifySwagger, {
  swagger: {
    consumes: ["aplication/json"],
    produces: ["aplication/json"],
    info: {
      title: "pass.in",
      description: "Especificações da API para o back-end da aplixação pass.in, construída durante o nlw Unite da Rocketseat ",
      version: "1.0.0"
    }
  },
  transform: jsonSchemaTransform,
})

app.register(fastifySwaggerUi, {
  routePrefix: "/docs"
})

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(createEvent)
app.register(registerForEvents)
app.register(getEventsAll)
app.register(getEvent)
app.register(getAttendeeBadge)
app.register(checkIn)
app.register(getEventAttendees)

app.setErrorHandler(errorHandler)

app.listen({port: 3333, host: '0.0.0.0'}).then(()=>{
  console.log("server running")
})