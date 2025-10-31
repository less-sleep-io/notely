import { Outlet, createRootRoute } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

import NoteBookList from "~/features/notebooks-list/components/notebooks-list";

export const Route = createRootRoute({
  component: () => (
    <>
      <div className="flex min-h-screen w-full bg-neutral-900 text-white">
        <nav className="w-64 shrink-0 border-r border-neutral-800 bg-neutral-800 text-white">
          <NoteBookList />
        </nav>
        <main className="grow">
          <Outlet />
        </main>
      </div>
      <TanStackRouterDevtools />
    </>
  ),
});
