import { PagePlus } from "iconoir-react";

import { useNoteStore } from "../../../../store/notes";
import List from "./components/List";

const NotesList = () => {
  const { addNote, setSelectedNoteId } = useNoteStore((state) => state);

  return (
    <nav className="h-full w-full bg-neutral-800 text-white">
      <header className="flex items-center justify-between border-b border-neutral-700 py-2 pr-2 pl-4">
        <h1 className="text-md text-neutral-300">Notely</h1>
        <button
          className="flex cursor-pointer items-center justify-end rounded-sm p-1.5 text-neutral-300 hover:bg-neutral-700 hover:text-white"
          onClick={() => setSelectedNoteId(addNote().id)}
        >
          <PagePlus className="h-5 w-5" />
        </button>
      </header>
      <div className="p-4">
        <List />
      </div>
    </nav>
  );
};

export default NotesList;
