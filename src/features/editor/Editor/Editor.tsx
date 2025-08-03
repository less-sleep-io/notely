import { MoreHorizCircle, Plus } from "iconoir-react";

import { useNoteStore } from "../../../store/notes";
import TextBlock from "../components/TextBlock";

const Editor = () => {
  const selectedNoteId = useNoteStore((state) => state.selectedNoteId);
  const contentBlocks = useNoteStore((state) => state.contentBlocks);
  const addContentBlock = useNoteStore((state) => state.addContentBlock);
  const note = useNoteStore((state) =>
    state.notes.find((note) => note.id === selectedNoteId),
  );

  if (!note) {
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
        <div className="grid grow grid-cols-[40px_1fr] gap-5">
          <div className="grid items-end gap-1">
            {selectedNote.content.map((_, index) => {
              return (
                <div className="flex w-full items-center justify-between">
                  <button
                    className="flex h-5 w-5 cursor-pointer items-center justify-center rounded hover:bg-neutral-700"
                    onClick={() =>
                      addContentBlock({
                        index: index + 1,
                        noteId: selectedNote.id,
                        type: "p",
                      })
                    }
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                  <button className="flex h-5 w-5 items-center justify-center rounded hover:bg-neutral-700">
                    <MoreHorizCircle className="h-4 w-4" />
                  </button>
                </div>
              );
            })}
          </div>
          <div className="h-full gap-2">
            {selectedNote.content.map((block) => {
              return (
                <>
                  <TextBlock
                    blockId={block.id}
                    className="min-h-4"
                    key={block.id}
                  />
                  <div className="w-full">
                    <div className="border-bottom h-px border-dashed border-neutral-600" />
                  </div>
                </>
              );
            })}
          </div>
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
