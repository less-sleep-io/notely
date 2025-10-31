import { useClickOutside } from "@mantine/hooks";
import { MoreHorizCircle } from "iconoir-react";
import { type ChangeEvent, useEffect, useRef, useState } from "react";

import cn from "~/utils/cn";

import { useNoteStore } from "../../../../store/notes";
import type { TextBlock as TextBlockType } from "../../../../types/app";
import ContentBlock, {
  type ContentBlockProps,
} from "../ContentBlock/ContentBlock";
import DropdownMenu from "../DropdownMenu";

const getTagStyles = (tag: TextBlockType["tag"]) => {
  switch (tag) {
    case "h1":
      return "text-5xl text-neutral-300";
    case "h2":
      return "text-4xl text-neutral-300";
    case "h3":
      return "text-3xl text-neutral-300";
    case "h4":
      return "text-2xl text-neutral-300";
    case "h5":
      return "text-xl text-neutral-300";
    case "h6":
      return "text-lg text-neutral-300";
    case "p":
    default:
      return "text-sm text-neutral-300";
  }
};

interface TextBlockProps extends Omit<ContentBlockProps, "block"> {
  blockId: string;
}

const TextBlock = ({ blockId, onAddContentBlock, ...rest }: TextBlockProps) => {
  const block = useNoteStore((state) => {
    return state.contentBlocks.entities[blockId];
  });
  const [isEditing, setIsEditing] = useState(false);
  const updateContentBlock = useNoteStore((state) => state.updateContentBlock);
  const removeContentBlock = useNoteStore((state) => state.removeContentBlock);
  const clickOutsideRef = useClickOutside<HTMLDivElement>(() => {
    if (isEditing) {
      setIsEditing(false);
    }
  });
  const elementRef = useRef<HTMLTextAreaElement>(null);

  const handleChange = (evt: ChangeEvent<HTMLTextAreaElement>) => {
    if (elementRef.current) {
      elementRef.current.style.height = "0px";
      elementRef.current.style.height = `${evt.target.scrollHeight}px`;
    }

    updateContentBlock({ content: evt.target.value, id: block.id });
  };

  const handleRemove = () => {
    removeContentBlock({ blockId: block.id });
  };

  useEffect(() => {
    if (elementRef.current) {
      const textareaElement = elementRef.current;
      textareaElement.focus();
      textareaElement.setSelectionRange(
        textareaElement.textLength,
        textareaElement.textLength,
      );
      textareaElement.style.height = "0px";
      textareaElement.style.height = `${textareaElement.scrollHeight}px`;
    }
  });

  if (!block) {
    return (
      <div className="w-full" {...rest}>
        Block not found
      </div>
    );
  }

  const tagStyles = getTagStyles(block.tag);

  return (
    <ContentBlock block={block} onAddContentBlock={onAddContentBlock} {...rest}>
      <div className="group flex w-full">
        <div className="flex items-start justify-between gap-1 py-1 opacity-0 group-hover:opacity-100">
          <DropdownMenu>
            <DropdownMenu.Trigger asChild={true}>
              <button className="flex h-5 w-5 cursor-pointer items-center justify-center rounded hover:bg-neutral-700">
                <MoreHorizCircle className="h-4 w-4" />
              </button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content>
              <DropdownMenu.Item onClick={handleRemove}>
                Remove
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu>
        </div>
        <div className="flex w-full items-start" ref={clickOutsideRef}>
          <textarea
            className={cn(
              "w-full resize-none p-0 pl-2.5 text-amber-600 outline-none hover:text-white",
              tagStyles,
            )}
            onChange={handleChange}
            onSelect={() => setIsEditing(true)}
            readOnly={!isEditing}
            ref={elementRef}
            value={block.content}
          />
        </div>
      </div>
    </ContentBlock>
  );
};

export default TextBlock;
