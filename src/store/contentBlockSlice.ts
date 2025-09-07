import { type StateCreator } from "zustand";

import type { TextBlock, TextBlockTag } from "../shared.types";

export interface AddContentBlockArgs {
  content?: string;
  tag: TextBlockTag;
  type: "text";
}

export interface RemoveContentBlockArgs {
  blockId: string;
}

export interface ContentBlockSlice {
  addContentBlock: (args: AddContentBlockArgs) => TextBlock;
  contentBlocks: {
    allIds: string[];
    byId: {
      [id: string]: TextBlock;
    };
  };
  removeContentBlock: (args: RemoveContentBlockArgs) => void;
  updateContentBlock: (
    blockId: string,
    content: string,
  ) => Pick<TextBlock, "content" | "id" | "updatedAt">;
}

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

export const createContentBlockSlice: StateCreator<
  ContentBlockSlice,
  [],
  [],
  ContentBlockSlice
> = (set, get) => ({
  contentBlocks: {
    allIds: [],
    byId: {},
  },
  addContentBlock: ({ content, tag }) => {
    const state = get();
    const contentBlocks = state.contentBlocks;

    const newBlock = createContentBlock(content, tag);
    set({
      contentBlocks: {
        allIds: [...contentBlocks.allIds, newBlock.id],
        byId: {
          ...contentBlocks.byId,
          [newBlock.id]: newBlock,
        },
      },
    });

    return newBlock;
  },
  removeContentBlock: ({ blockId }) => {
    const state = get();
    const contentBlocks = state.contentBlocks;
    const blockToDelete = state.contentBlocks.byId[blockId];

    if (!blockToDelete) {
      throw new Error(`Content block with id ${blockId} not found`);
    }

    delete contentBlocks.byId[blockId];
    set({
      contentBlocks: {
        allIds: contentBlocks.allIds.filter((id) => id !== blockId),
        byId: { ...contentBlocks.byId },
      },
    });

    return blockToDelete;
  },
  updateContentBlock: (id: string, content: string) => {
    const state = get();
    const contentBlocks = state.contentBlocks;
    const block = contentBlocks.byId[id];
    if (!block) {
      throw new Error(`Content block with id ${id} not found`);
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
});
