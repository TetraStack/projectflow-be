import swaggerAutogen from "swagger-autogen";
import "dotenv/config";

const doc = {
  info: {
    title: "ProjectFlow Api",
    description:
      "A full-featured backend system to manage projects, team members, tasks, and notes.",
  },
  host:
    process.env.NODE_ENV !== "Production"
      ? "localhost:8080"
      : "http://projectflow.us/",
};

const outputFile = "./swagger-output.json";
const routes = ["./app.ts"];

swaggerAutogen(outputFile, routes, doc);
