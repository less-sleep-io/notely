import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { TEXT_BLOCK_TAGS } from "../shared.constants";
import type {
  Note,
  NotePrimitive,
  TextBlock,
  TextBlockTag,
} from "../shared.types";

export type NoteUpdate = Pick<Note, "id" | "title" | "content">;
export type NoteDelete = Pick<Note, "id">;

export interface AddContentBlockArgs {
  index: number;
  noteId: string;
  tag: TextBlockTag;
  type: "text";
}

export interface RemoveContentBlockArgs {
  blockId: string;
  noteId: string;
}

export interface NoteStore {
  addNote: () => NotePrimitive;
  addContentBlock: (args: AddContentBlockArgs) => void;
  contentBlocks: {
    allIds: string[];
    byId: {
      [id: string]: TextBlock;
    };
  };
  deleteNote: (args: NoteDelete) => void;
  getNote: (args: { id: string }) => Note;
  getNotes: () => Note[];
  notes: {
    allIds: string[];
    byId: {
      [id: string]: NotePrimitive;
    };
  };
  removeContentBlock: (args: RemoveContentBlockArgs) => void;
  selectedNoteId: string | null;
  setSelectedNoteId: (id: string | null) => void;
  updateContentBlock: (
    blockId: string,
    content: string,
  ) => Pick<TextBlock, "content" | "id" | "updatedAt">;
  updateNote: (note: NoteUpdate) => void;
}

const createContentBlock = (
  content = "New block",
  tag: TextBlockTag,
  parentId: string,
): TextBlock => ({
  id: crypto.randomUUID(),
  content,
  createdAt: new Date(),
  parentId,
  tag,
  updatedAt: new Date(),
});

export const useNoteStore = create<NoteStore>()(
  persist(
    (set, get) => ({
      contentBlocks: {
        allIds: [],
        byId: {},
      },
      notes: {
        allIds: [],
        byId: {},
      },
      selectedNoteId: null,
      addNote: () => {
        const contentBlocks = get().contentBlocks;
        const notes = get().notes;
        const noteId = crypto.randomUUID();
        const initialBlock = createContentBlock("Note 1", "h1", noteId);
        const newNote: NotePrimitive = {
          content: [initialBlock.id],
          createdAt: new Date(),
          id: noteId,
          title: `Note ${get().notes.allIds.length + 1}`,
          updatedAt: new Date(),
        };

        // Add the new note to the store
        set({
          contentBlocks: {
            allIds: [...contentBlocks.allIds, initialBlock.id],
            byId: {
              ...contentBlocks.byId,
              [initialBlock.id]: initialBlock,
            },
          },
          notes: {
            allIds: [...notes.allIds, newNote.id],
            byId: {
              ...notes.byId,
              [newNote.id]: newNote,
            },
          },
        });

        return newNote;
      },
      addContentBlock: ({ index, noteId, tag }) => {
        const state = get();
        const notes = state.notes;
        const note = notes.byId[noteId];
        const contentBlocks = state.contentBlocks;

        if (!note) {
          throw new Error(`Note with id ${noteId} not found`);
        }

        const newBlock = createContentBlock(TEXT_BLOCK_TAGS[tag], tag, noteId);
        const updatedContent = [...note.content];
        updatedContent.splice(index, 0, newBlock.id);
        const updatedNote: NotePrimitive = {
          ...note,
          content: updatedContent,
          updatedAt: new Date(),
        };
        set({
          contentBlocks: {
            allIds: [...contentBlocks.allIds, newBlock.id],
            byId: {
              ...contentBlocks.byId,
              [newBlock.id]: newBlock,
            },
          },
          notes: {
            ...notes,
            byId: {
              ...notes.byId,
              [updatedNote.id]: updatedNote,
            },
          },
        });

        return newBlock;
      },
      deleteNote: ({ id }: NoteDelete) => {
        const notes = get().notes;
        const noteToDelete = notes.byId[id];
        const selectedNoteId = get().selectedNoteId;
        if (!noteToDelete) {
          throw new Error(`Note with id ${id} not found`);
        }
        const nextNotes = {
          allIds: notes.allIds.filter((value) => value !== id),
          byId: { ...notes.byId },
        };
        delete nextNotes.byId[id];

        // Add the new note to the store
        set({
          notes: nextNotes,
          selectedNoteId: selectedNoteId === id ? null : selectedNoteId,
        });

        return noteToDelete;
      },
      getNote: ({ id }: { id: string }) => {
        const state = get();
        const note = state.notes.byId[id];
        const contentBlocks = state.contentBlocks;

        if (!note) {
          throw new Error("Could not find note");
        }

        return {
          ...note,
          content: note.content.map((blockId) => {
            return contentBlocks.byId[blockId];
          }),
        };
      },
      getNotes: () => {
        const state = get();
        const notes = state.notes;
        return notes.allIds.map((id) => state.getNote({ id }));
      },
      removeContentBlock: ({ blockId, noteId }) => {
        const state = get();
        const notes = state.notes;
        const note = notes.byId[noteId];
        const contentBlocks = state.contentBlocks;
        const blockToDelete = state.contentBlocks.byId[blockId];

        if (!note) {
          throw new Error(`Note with id ${noteId} not found`);
        }

        const updatedNote: NotePrimitive = {
          ...note,
          content: [...note.content].filter((id) => id !== blockId),
          updatedAt: new Date(),
        };
        delete contentBlocks.byId[blockId];
        set({
          contentBlocks: {
            allIds: contentBlocks.allIds.filter((id) => id === blockId),
            byId: { ...contentBlocks.byId },
          },
          notes: {
            ...notes,
            byId: {
              ...notes.byId,
              [updatedNote.id]: updatedNote,
            },
          },
        });

        return blockToDelete;
      },
      setSelectedNoteId: (id: string | null) => {
        set({ selectedNoteId: id });
      },
      updateContentBlock: (id: string, content: string) => {
        const contentBlocks = get().contentBlocks;
        const block = contentBlocks.byId[id];
        if (!block) {
          throw new Error(`Content with id ${id} not found`);
        }
        const updatedBlock: TextBlock = {
          ...block,
          content,
          updatedAt: new Date(),
        };

        set({
          contentBlocks: {
            ...contentBlocks,
            byId: {
              ...contentBlocks.byId,
              [updatedBlock.id]: updatedBlock,
            },
          },
        });

        return updatedBlock;
      },
      updateNote: ({ id, title }: NoteUpdate) => {
        const notes = get().notes;
        const note = notes.byId[id];
        if (!note) {
          throw new Error(`Note with id ${id} not found`);
        }
        const updatedNote: NotePrimitive = {
          ...note,
          title,
          updatedAt: new Date(),
        };

        set({
          notes: {
            ...notes,
            byId: {
              ...notes.byId,
              [updatedNote.id]: updatedNote,
            },
          },
        });

        return updatedNote;
      },
    }),
    {
      name: "notely",
      partialize: (state) => ({
        contentBlocks: state.contentBlocks,
        notes: state.notes,
      }),
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
