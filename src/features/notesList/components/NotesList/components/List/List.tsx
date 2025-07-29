import { Trash } from "iconoir-react";

import { useNoteStore } from "../../../../../../store/notes";

const List = () => {
  const notes = useNoteStore((state) => state.notes);
  const selectedNote = useNoteStore((state) => state.selectedNote);
  const setSelectedNote = useNoteStore((state) => state.setSelectedNote);
  const deleteNote = useNoteStore((state) => state.deleteNote);

  if (notes.length === 0) {
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
      {notes.map((note) => (
        <li
          className="flex cursor-pointer justify-between rounded-sm text-sm data-[selected=true]:bg-neutral-700 data-[selected=true]:text-white"
          data-selected={selectedNote?.id === note.id}
          key={note.id}
        >
          <p
            className="grow p-2 text-sm text-neutral-300 group-hover:text-white"
            onClick={() => setSelectedNote(note.id)}
          >
            {note.title || "Untitled Note"}
          </p>
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
