import { Outlet, createRootRoute } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

import NotesList from "~/features/notesList";

export const Route = createRootRoute({
  component: () => (
    <>
      <div className="flex min-h-screen w-full bg-neutral-900 text-white">
        <nav className="w-64 shrink-0 border-r border-neutral-800 bg-neutral-800 text-white">
          <NotesList />
        </nav>
        <main className="grow p-4">
          <Outlet />
        </main>
      </div>
      <TanStackRouterDevtools />
    </>
  ),
});
