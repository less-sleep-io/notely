import { Outlet, createFileRoute } from "@tanstack/react-router";

import NoteList from "~/features/note-list/components/note-list";

const NoteBookListLayoutComponent = () => {
  const { notebookId } = Route.useParams();

  return (
    <>
      <div className="flex min-h-screen w-full bg-neutral-900 text-white">
        <nav className="w-64 shrink-0 border-r border-neutral-800 bg-neutral-800 text-white">
          <NoteList notebookId={notebookId} />
        </nav>
        <main className="grow">
          <Outlet />
        </main>
      </div>
    </>
  );
};

export const Route = createFileRoute("/notebooks/$notebookId")({
  component: NoteBookListLayoutComponent,
});
