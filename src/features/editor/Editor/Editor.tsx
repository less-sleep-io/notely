import useSearchParam from "../../../hooks/useSearchParams";
import { useNoteStore } from "../../../store/notes";
import TextBlock from "../components/TextBlock";

const Editor = () => {
  const state = useNoteStore((state) => state);
  const contentBlocks = state.contentBlocks;
  const addContentBlock = state.addContentBlock;
  const { value: noteId } = useSearchParam("id");
  const note = noteId ? state.notes.byId[noteId] : null;

  if (!noteId) {
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
        return contentBlocks.byId[blockId];
      })
      .filter((block) => block !== undefined),
  };

  return (
    <div className="w-full" key={noteId}>
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
