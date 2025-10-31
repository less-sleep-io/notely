import type { Entity } from "./shared";

export const TEXT_BLOCK_TAGS = {
  h1: "Heading 1",
  h2: "Heading 2",
  h3: "Heading 3",
  h4: "Heading 4",
  h5: "Heading 5",
  h6: "Heading 6",
  p: "Paragraph",
} as const;

export type TextBlockTag = keyof typeof TEXT_BLOCK_TAGS;

export type TextBlock = Entity<{
  content: string;
  tag: TextBlockTag;
}>;

export type Notebook = Entity<{
  notes: Note[];
  title: string;
}>;

export type Note = Entity<{
  content: TextBlock[];
  title: string;
}>;
