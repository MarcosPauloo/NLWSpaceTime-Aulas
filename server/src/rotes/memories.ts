import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../lib/prisma";

export async function memoriesRoutes(app: FastifyInstance) {
  app.get("/memories", async () => {
    const memories = await prisma.memory.findMany({
      orderBy: {
        createAt: "asc",
      },
    });

    return memories.map((memory) => {
      return {
        id: memory.id,
        convertUrl: memory.converUrl,
        excerpt: memory.content.substring(0, 115).concat("..."), // pegando um "resumo" do conteudo
      };
    });
  });

  app.get("/memories/:id", async (request) => {
    const paramsSchema = z.object({
      id: z.string().uuid(),
    });

    const { id } = paramsSchema.parse(request.params);

    const memory = await prisma.memory.findFirstOrThrow({
      where: {
        id,
      },
    });
    return memory;
  });

  app.post("/memories", async (request) => {
    const bodySchema = z.object({
      content: z.string(),
      converUrl: z.string(),
      isPublic: z.coerce.boolean().default(false), // recebendo um valor boleano (o coerce é para transformar em boolean)
    });

    const { content, converUrl, isPublic } = bodySchema.parse(request.body);

    const memory = await prisma.memory.create({
      data: {
        content,
        converUrl,
        isPublic,
        userId: "fce2cbde-a158-49f7-96f8-25973d9573e6",
      },
    });

    return memory;
  });

  app.put("/memories/:id", async (request) => {
    const paramsSchema = z.object({
      id: z.string().uuid(),
    });
    const bodySchema = z.object({
      content: z.string(),
      converUrl: z.string(),
      isPublic: z.coerce.boolean().default(false), // recebendo um valor boleano (o coerce é para transformar em boolean)
    });

    const { id } = paramsSchema.parse(request.params);

    const { content, converUrl, isPublic } = bodySchema.parse(request.body);

    const memory = prisma.memory.update({
      where: {
        id,
      },
      data: {
        content,
        converUrl,
        isPublic,
      },
    });
    return memory;
  });

  app.delete("/memories/:id", async (request) => {
    const paramsSchema = z.object({
      id: z.string().uuid(),
    });

    const { id } = paramsSchema.parse(request.params);

    await prisma.memory.delete({
      where: {
        id,
      },
    });
  });
}
