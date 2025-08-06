import { useLayoutEffect } from "react";

import Editor from "./features/editor";
import NotesList from "./features/notesList";
import { useNoteStore } from "./store/notes";

function App() {
  const setSelectedNoteId = useNoteStore((state) => state.setSelectedNoteId);
  const notes = useNoteStore((state) => state.notes);

  useLayoutEffect(() => {
    console.log("Setting selected note ID on app load");
    setSelectedNoteId(notes[0]?.id ?? null);
  });

  return (
    <div className="flex min-h-screen w-full bg-neutral-900 text-white">
      <nav className="w-64 shrink-0 border-r border-neutral-800 bg-neutral-800 text-white">
        <NotesList />
      </nav>
      <main className="grow p-4">
        <Editor />
      </main>
    </div>
  );
}

export default App;
