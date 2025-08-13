import { createFileRoute } from "@tanstack/react-router";

import Editor from "~/features/editor";

const Note = () => {
  const { noteId } = Route.useParams();

  return <Editor noteId={noteId} />;
};

export const Route = createFileRoute("/notes/$noteId")({
  component: Note,
});
