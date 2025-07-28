import { PagePlus } from "iconoir-react";
import { useState } from "react";

import { useNoteStore } from "./store";

function App() {
  const notes = useNoteStore((state) => state.notes);
  const addNote = useNoteStore((state) => state.addNote);
  const updateNote = useNoteStore((state) => state.updateNote);
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(
    notes[0]?.id || null,
  );
  const selectedNote = notes.find((note) => note.id === selectedNoteId);

  return (
    <div className="flex min-h-screen w-full bg-neutral-900 text-white">
      <nav className="w-64 border-r border-neutral-800 bg-neutral-800 text-white">
        <header className="flex items-center justify-end border-b border-neutral-700 p-2">
          <button
            className="flex cursor-pointer items-center justify-center rounded-sm p-1.5 text-neutral-300 hover:bg-neutral-700 hover:text-white"
            onClick={() => {
              const newNote = addNote();

              setSelectedNoteId(newNote.id);
            }}
          >
            <PagePlus className="h-5 w-5" />
          </button>
        </header>
        <div className="p-4">
          {notes.length > 0 ? (
            <ul className="space-y-2">
              {notes.map((note) => (
                <li
                  className="rounded-sm p-2 text-sm text-neutral-300 hover:bg-neutral-700 hover:text-white data-[selected=true]:bg-neutral-700 data-[selected=true]:text-white"
                  data-selected={selectedNoteId === note.id}
                  key={note.id}
                  onClick={() => setSelectedNoteId(note.id)}
                >
                  {note.title || "Untitled Note"}
                </li>
              ))}
            </ul>
          ) : (
            <div className="flex flex-col items-center justify-center space-y-2">
              <h2 className="text-center text-base text-neutral-300">
                No notes available.
              </h2>
              <p className="text-center text-sm text-neutral-400">
                Click "Add Note" to create one.
              </p>
            </div>
          )}
        </div>
      </nav>
      <main className="grow p-4">
        {selectedNote ? (
          <div key={selectedNote.id} className="h-full w-full">
            <input
              className="mb-4 w-full rounded-md border border-neutral-700 bg-neutral-800 p-2 text-2xl text-white"
              onChange={(e) =>
                updateNote({
                  content: selectedNote.content,
                  id: selectedNote.id,
                  title: e.target.value,
                })
              }
              placeholder="Untitled Note"
              type="text"
              value={selectedNote.title}
            />
            <textarea
              className="h-96 w-full rounded-md border border-neutral-700 bg-neutral-800 p-2 text-white"
              value={selectedNote.content}
              onChange={(e) =>
                updateNote({
                  content: e.target.value,
                  id: selectedNote.id,
                  title: selectedNote.title,
                })
              }
            />
            <div className="mt-4 text-sm text-neutral-500">
              <p>Created at: {selectedNote.createdAt.toLocaleString()}</p>
              <p>Updated at: {selectedNote.updatedAt.toLocaleString()}</p>
            </div>
          </div>
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <p className="text-xl text-neutral-300">Select a note.</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
