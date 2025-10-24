import { useNoteStore } from "../../../store/notes";
import TextBlock from "../components/TextBlock";

interface EditorProps {
  noteId: string;
}

const Editor = ({ noteId }: EditorProps) => {
  const getNote = useNoteStore((state) => state.getNote);
  const addContentBlock = useNoteStore((state) => state.addContentBlock);
  const note = noteId ? getNote({ id: noteId }) : null;

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
      .map((block) => {
        return block;
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
                onAddContentBlock={({ tag, type }) => {
                  const args = {
                    index: i + 1,
                    noteId: selectedNote.id,
                    tag,
                    type,
                  };
                  const block = addContentBlock(args);
                  console.log(block);
                }}
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
