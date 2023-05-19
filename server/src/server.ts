import cors from "@fastify/cors"; // biblioteca para a "protecao" do backend
import fastify from "fastify";
import { memoriesRoutes } from "./rotes/memories";

const app = fastify();

app.register(cors, {
  origin: true, // colocar quais sao as urls que podem fazer a requisicao com o back
});
app.register(memoriesRoutes);

app
  .listen({
    port: 3333,
  })
  .then(() => {
    console.log("🚀 HTTP server running on http://localhost:3333");
  });
