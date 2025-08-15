import { TEXT_BLOCK_TAGS } from "./shared.constants";

export type TextBlockTag = keyof typeof TEXT_BLOCK_TAGS;

export interface TextBlock {
  createdAt: Date;
  content: string;
  id: string;
  parentId: string;
  tag: TextBlockTag;
  updatedAt: Date;
}

export interface NotePrimitive {
  content: string[];
  createdAt: Date;
  id: string;
  title: string;
  updatedAt: Date;
}

export interface Note extends Omit<NotePrimitive, "content"> {
  content: TextBlock[];
}
