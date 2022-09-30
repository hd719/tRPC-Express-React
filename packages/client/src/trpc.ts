import { createReactQueryHooks } from "@trpc/react";

// contains all the typed definitions for the routes from our API Server
import { AppRouter } from "api-server";

// Pass in the router types
export const trpc = createReactQueryHooks<AppRouter>();
