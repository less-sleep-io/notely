import { useNoteStore } from "../../../../store/notes";

const Editor = () => {
  const selectedNote = useNoteStore((state) => state.selectedNote);
  const updateNote = useNoteStore((state) => state.updateNote);

  if (!selectedNote) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <p className="text-xl text-neutral-300">Select a note.</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div key={selectedNote.id} className="h-full w-full">
        <input
          className="mb-4 w-full rounded-md border border-neutral-700 bg-neutral-800 px-3 py-2 text-2xl text-white focus-visible:outline"
          onChange={(e) => {
            updateNote({
              content: selectedNote.content,
              id: selectedNote.id,
              title: e.target.value,
            });
          }}
          placeholder="Untitled Note"
          type="text"
          value={selectedNote.title}
        />
        <textarea
          className="h-96 w-full rounded-md border border-neutral-700 bg-neutral-800 px-3 py-2 text-white focus-visible:outline"
          value={selectedNote.content}
          onChange={(e) => {
            updateNote({
              content: e.target.value,
              id: selectedNote.id,
              title: selectedNote.title,
            });
          }}
        />
        <div className="mt-4 text-sm text-neutral-500">
          <p>Created at: {selectedNote.createdAt.toLocaleString()}</p>
          <p>Updated at: {selectedNote.updatedAt.toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
};

export default Editor;
