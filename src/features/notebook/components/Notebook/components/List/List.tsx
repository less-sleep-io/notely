import { Link } from "@tanstack/react-router";
import { Trash } from "iconoir-react";

import { useNoteStore } from "../../../../../../store/notes";

interface ListProps {
  notebookId: string;
}

const List = ({ notebookId }: ListProps) => {
  const state = useNoteStore((state) => state);
  const notebook = state.getNotebook(notebookId);
  const deleteNote = state.deleteNote;

  if (notebook.notes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center space-y-2">
        <h2 className="text-center text-base text-neutral-300">
          No notes available.
        </h2>
        <p className="text-center text-sm text-neutral-400">
          Click "Add Note" to create one.
        </p>
      </div>
    );
  }

  return (
    <ul className="space-y-2">
      {notebook.notes.map((note) => (
        <li
          className="flex cursor-pointer justify-between rounded-sm text-sm has-data-[status='active']:bg-neutral-700 has-data-[status='active']:text-white"
          key={note.id}
        >
          <Link
            className="grow px-3 py-2 text-sm text-neutral-300 group-hover:text-white"
            params={{ notebookId: notebook.id, noteId: note.id }}
            to="/notebooks/$notebookId/notes/$noteId"
          >
            {note.title || "Untitled Note"}
          </Link>
          <button
            className="cursor-pointer px-3 py-1 text-neutral-400 group-hover:text-shadow-neutral-100"
            onClick={() => deleteNote(note)}
          >
            <Trash className="h-4 w-4" />
          </button>
        </li>
      ))}
    </ul>
  );
};

export default List;
