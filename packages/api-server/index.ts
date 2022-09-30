import express from "express";
import * as trpc from "@trpc/server";
import * as trpcExpress from "@trpc/server/adapters/express";
import cors from "cors";
import { z } from "zod";

interface ChatMessage {
  user: string;
  message: string;
}

const messages: ChatMessage[] = [
  { user: "h", message: "world" },
  { user: "d", message: "hi" },
];

// route is: http://localhost:8081/trpc/hello
const appRouter = trpc
  .router()
  .query("hello", {
    resolve() {
      return "Hello world!";
    },
  })
  .query("messages", {
    input: z.number().default(10),
    resolve({ input }) {
      // this returns us the last 10 messages
      return messages.slice(-input);
    },
  });

const app = express();
const port = 8081;

// exports types (for the routes, so what the route takes for input and output) for the client
// By adding "main": "index.ts", to the package.json we can expose these types from our server to our client
// yarn add api-server@1.0.0 (in the client directory) will directly link the client to the server's types
export type AppRouter = typeof appRouter;

app.use(cors());

// Connects trpc to express
app.use(
  "/trpc",
  trpcExpress.createExpressMiddleware({
    router: appRouter,
    // doing things like authorization (anything that has to do with user)
    createContext: () => null,
  })
);

app.get("/", (req, res) => {
  res.send("Hello from api-server");
});

app.listen(port, () => {
  console.log(`api-server listening at http://localhost:${port}`);
});

// tRPC Notes
// - is based on TS and is end to end strongly typed
// - on the client side, you can use the generated types to make sure you are calling the right thing and passing the appropriate args
