import { type StateCreator } from "zustand";

import type { TextBlock, TextBlockTag } from "../shared.types";

export interface AddContentBlockArgs {
  content?: string;
  tag: TextBlockTag;
  type: "text";
}

export interface TextBlockSliceArgs {
  content?: string;
  tag: TextBlockTag;
}

export interface RemoveContentBlockArgs {
  blockId: string;
}

export interface UpdateContentBlockArgs {
  id: string;
  content: string;
}

export interface ContentBlockSlice {
  addContentBlock: (args: AddContentBlockArgs) => TextBlock;
  contentBlocks: {
    entities: {
      [id: string]: TextBlock;
    };
    ids: string[];
  };
  removeContentBlock: (args: RemoveContentBlockArgs) => void;
  updateContentBlock: (
    args: UpdateContentBlockArgs,
  ) => Pick<TextBlock, "content" | "id" | "updatedAt">;
}

const createContentBlock = ({
  content = "New block",
  tag,
}: TextBlockSliceArgs): TextBlock => ({
  content,
  createdAt: new Date(),
  id: crypto.randomUUID(),
  tag,
  updatedAt: new Date(),
});

export const createContentBlockSlice: StateCreator<
  ContentBlockSlice,
  [],
  [],
  ContentBlockSlice
  // eslint-disable-next-line max-params
> = (set, get) => ({
  addContentBlock: ({ content, tag }) => {
    const state = get();
    const contentBlocks = state.contentBlocks;

    const newBlock = createContentBlock({ content, tag });
    set({
      contentBlocks: {
        entities: {
          ...contentBlocks.entities,
          [newBlock.id]: newBlock,
        },
        ids: [...contentBlocks.ids, newBlock.id],
      },
    });

    return newBlock;
  },
  contentBlocks: {
    entities: {},
    ids: [],
  },
  removeContentBlock: ({ blockId }) => {
    const state = get();
    const contentBlocks = state.contentBlocks;
    const blockToDelete = state.contentBlocks.entities[blockId];

    if (!blockToDelete) {
      throw new Error(`Content block with id ${blockId} not found`);
    }

    delete contentBlocks.entities[blockId];
    set({
      contentBlocks: {
        entities: { ...contentBlocks.entities },
        ids: contentBlocks.ids.filter((id) => id !== blockId),
      },
    });

    return blockToDelete;
  },
  updateContentBlock: ({ id, content }) => {
    const state = get();
    const contentBlocks = state.contentBlocks;
    const block = contentBlocks.entities[id];
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
        entities: {
          ...contentBlocks.entities,
          [updatedBlock.id]: updatedBlock,
        },
      },
    });

    return updatedBlock;
  },
});
