import { RouterProvider, createRouter } from "@tanstack/react-router";

import "~/index.css";

import { routeTree } from "../routeTree.gen";

// Create a new router instance
const router = createRouter({ routeTree });

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const AppRouter = () => <RouterProvider router={router} />;

export { AppRouter };
