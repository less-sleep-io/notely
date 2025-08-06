import { useNoteStore } from "../../../store/notes";
import TextBlock from "../components/TextBlock";

const Editor = () => {
  const selectedNoteId = useNoteStore((state) => state.selectedNoteId);
  const contentBlocks = useNoteStore((state) => state.contentBlocks);
  const addContentBlock = useNoteStore((state) => state.addContentBlock);
  const note = useNoteStore((state) =>
    state.notes.find((note) => note.id === selectedNoteId),
  );

  if (!selectedNoteId) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <p className="text-xl text-neutral-300">Select a note.</p>
      </div>
    );
  }

  if (!note) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <p className="text-xl text-neutral-300">Note not found.</p>
      </div>
    );
  }

  const selectedNote = {
    ...note,
    content: note?.content
      .map((blockId) => {
        return contentBlocks.get(blockId);
      })
      .filter((block) => block !== undefined),
  };

  return (
    <div className="w-full" key={selectedNoteId}>
      <div className="flex min-h-full w-full flex-col gap-4">
        <div className="flex grow flex-col">
          {selectedNote.content.map((block, i) => {
            return (
              <TextBlock
                blockId={block.id}
                key={block.id}
                onAddContentBlock={({ tag, type }) =>
                  addContentBlock({
                    index: i + 1,
                    noteId: selectedNote.id,
                    tag,
                    type,
                  })
                }
              />
            );
          })}
        </div>
        <div className="mt-4 text-sm text-neutral-500">
          <p>Created at: {selectedNote.createdAt.toLocaleString()}</p>
          <p>Updated at: {selectedNote.updatedAt.toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
};

export default Editor;
