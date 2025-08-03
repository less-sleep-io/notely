export type TextBlockType = "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p";

export interface TextBlock {
  createdAt: Date;
  id: string;
  content: string;
  type: TextBlockType;
  updatedAt: Date;
}

export interface Note {
  content: string[];
  createdAt: Date;
  id: string;
  title: string;
  updatedAt: Date;
}
