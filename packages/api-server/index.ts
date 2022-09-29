import express from "express";
import * as trpc from "@trpc/server";
import * as trpcExpress from "@trpc/server/adapters/express";

const appRouter = trpc.router().query("hello", {
  resolve() {
    return "Hello world!";
  },
});

const app = express();
const port = 8081;

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
