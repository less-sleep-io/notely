import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { TEXT_BLOCK_TAGS } from "../shared.constants";
import type { Note, TextBlock, TextBlockTag } from "../shared.types";

export type NoteUpdate = Pick<Note, "id" | "title" | "content">;
export type NoteDelete = Pick<Note, "id">;

export interface AddContentBlockArgs {
  index: number;
  noteId: string;
  tag: TextBlockTag;
  type: "text";
}

type NoteStore = {
  addNote: () => Note;
  addContentBlock: (args: AddContentBlockArgs) => Note;
  contentBlocks: Map<string, TextBlock>;
  deleteNote: (args: NoteDelete) => Note;
  notes: Note[];
  selectedNoteId: string | null;
  setSelectedNoteId: (id: string | null) => void;
  updateContentBlock: (
    blockId: string,
    content: string,
  ) => Pick<TextBlock, "content" | "id" | "updatedAt">;
  updateNote: (note: NoteUpdate) => Note;
};

const createContentBlock = (
  content = "New block",
  tag: TextBlockTag,
): TextBlock => ({
  id: crypto.randomUUID(),
  content,
  createdAt: new Date(),
  tag,
  updatedAt: new Date(),
});

export const useNoteStore = create<NoteStore>()(
  persist(
    (set, get) => ({
      contentBlocks: new Map<string, TextBlock>(),
      notes: [],
      selectedNoteId: null,
      addNote: () => {
        const initialBlock = createContentBlock("Note 1", "h1");
        const newNote: Note = {
          content: [initialBlock.id],
          createdAt: new Date(),
          id: crypto.randomUUID(),
          title: `Note ${get().notes.length + 1}`,
          updatedAt: new Date(),
        };
        const currentNotes = get().notes;

        // Add the new note to the store
        set({
          contentBlocks: new Map(get().contentBlocks).set(
            initialBlock.id,
            initialBlock,
          ),
          notes: [...currentNotes, newNote],
        });

        return newNote;
      },
      addContentBlock: ({ index, noteId, tag }) => {
        const note = get().notes.find((note) => note.id === noteId);

        if (!note) {
          throw new Error(`Note with id ${noteId} not found`);
        }

        const newBlock = createContentBlock(TEXT_BLOCK_TAGS[tag], tag);
        const updatedContent = [...note.content];
        updatedContent.splice(index, 0, newBlock.id);
        const updatedNote: Note = {
          ...note,
          content: updatedContent,
          updatedAt: new Date(),
        };
        const nextContentBlocks = new Map(get().contentBlocks);
        nextContentBlocks.set(newBlock.id, newBlock);
        set({
          contentBlocks: nextContentBlocks,
          notes: get().notes.map((note) =>
            note.id === noteId ? updatedNote : note,
          ),
        });
        return updatedNote;
      },
      deleteNote: ({ id }: NoteDelete) => {
        const noteToDelete = get().notes.find((note) => note.id === id);
        const selectedNoteId = get().selectedNoteId;
        if (!noteToDelete) {
          throw new Error(`Note with id ${id} not found`);
        }
        const currentNotes = get().notes;

        // Add the new note to the store
        set({
          notes: currentNotes.filter((note) => note.id !== id),
          selectedNoteId: selectedNoteId === id ? null : selectedNoteId,
        });

        return noteToDelete;
      },
      setSelectedNoteId: (id: string | null) => {
        set({ selectedNoteId: id });
      },
      updateContentBlock: (blockId: string, content: string) => {
        const block = get().contentBlocks.get(blockId);
        if (!block) {
          throw new Error(`Content with id ${blockId} not found`);
        }
        const updatedBlock: TextBlock = {
          ...block,
          content,
          updatedAt: new Date(),
        };

        const nextContentBlocks = get().contentBlocks;
        nextContentBlocks.set(blockId, updatedBlock);

        set({
          contentBlocks: new Map(nextContentBlocks),
        });

        return updatedBlock;
      },
      updateNote: ({ content, id, title }: NoteUpdate) => {
        const note = get().notes.find((note) => note.id === id);
        if (!note) {
          throw new Error(`Note with id ${id} not found`);
        }
        const updatedNote: Note = {
          ...note,
          content,
          title,
          updatedAt: new Date(),
        };

        set({
          notes: get().notes.map((note) =>
            note.id === id ? updatedNote : note,
          ),
        });

        return updatedNote;
      },
    }),
    {
      name: "notely",
      storage: createJSONStorage(() => localStorage, {
        // Custom reviver to handle Map deserialization
        // This will convert the stored array back to a Map
        // when the state is rehydrated from localStorage
        // and format dates as Date objects
        reviver: (key, value) => {
          if (key === "contentBlocks") {
            const data = value as TextBlock[];
            const contentBlocks = new Map<string, TextBlock>();
            data.forEach((block: TextBlock) => {
              contentBlocks.set(block.id, {
                ...block,
                createdAt: new Date(block.createdAt),
                updatedAt: new Date(block.updatedAt),
              });
            });
            return contentBlocks;
          }

          if (key === "notes") {
            const notes = value as Note[];
            return notes.map((note) => ({
              ...note,
              createdAt: new Date(note.createdAt),
              updatedAt: new Date(note.updatedAt),
            }));
          }

          return value;
        },
        // Custom replacer to handle Map serialization
        // This will convert the Map to an array of objects
        // when the state is stored in localStorage
        // and format dates as ISO strings
        replacer: (key, value) => {
          if (key === "contentBlocks") {
            const contentBlocks = value as NoteStore["contentBlocks"];
            return Array.from(contentBlocks.values()).map((block) => ({
              ...block,
              createdAt: block.createdAt.toISOString(),
              updatedAt: block.updatedAt.toISOString(),
            }));
          }

          if (key === "notes") {
            const notes = value as NoteStore["notes"];
            return notes.map((note) => ({
              ...note,
              createdAt: note.createdAt.toISOString(),
              updatedAt: note.updatedAt.toISOString(),
            }));
          }

          // Default behavior for other keys
          return value;
        },
      }),
      partialize: (state) => ({
        contentBlocks: state.contentBlocks,
        notes: state.notes,
      }),
    },
  ),
);
