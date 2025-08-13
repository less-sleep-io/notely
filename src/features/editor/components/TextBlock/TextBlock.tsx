import { useClickOutside } from "@mantine/hooks";
import { MoreHorizCircle } from "iconoir-react";
import { type ChangeEvent, useEffect, useRef, useState } from "react";

import cn from "~/utils/cn";

import type { TextBlock as TextBlockType } from "../../../../shared.types";
import { useNoteStore } from "../../../../store/notes";
import ContentBlock, {
  type ContentBlockProps,
} from "../ContentBlock/ContentBlock";
import DropdownMenu from "../DropdownMenu";

interface EditBlockProps {
  block: TextBlockType;
  className: string;
  onClickOutside: () => void;
}

const EditBlock = ({ block, className, onClickOutside }: EditBlockProps) => {
  const updateContentBlock = useNoteStore((state) => state.updateContentBlock);
  const clickOutsideRef = useClickOutside<HTMLDivElement>(onClickOutside);
  const elementRef = useRef<HTMLTextAreaElement>(null);

  const handleChange = (evt: ChangeEvent<HTMLTextAreaElement>) => {
    if (elementRef.current) {
      elementRef.current.style.height = "0px";
      elementRef.current.style.height = `${evt.target.scrollHeight}px`;
    }

    updateContentBlock(block.id, evt.target.value);
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

  return (
    <div className="flex w-full items-start" ref={clickOutsideRef}>
      <textarea
        className={cn(
          className,
          "w-full resize-none p-0 pl-2.5 text-amber-600 outline-none",
        )}
        onChange={handleChange}
        ref={elementRef}
        value={block.content}
      />
    </div>
  );
};

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
    return state.contentBlocks.byId[blockId];
  });
  const [isEditing, setIsEditing] = useState(false);

  if (!block) {
    return (
      <div className="w-full" {...rest}>
        Block not found
      </div>
    );
  }

  const Tag = block.tag || "div";
  const tagStyles = getTagStyles(block.tag);

  return (
    <ContentBlock block={block} onAddContentBlock={onAddContentBlock} {...rest}>
      <div className="flex items-center justify-between gap-1 py-1">
        <DropdownMenu>
          <DropdownMenu.Trigger asChild={true}>
            <button className="flex h-5 w-5 cursor-pointer items-center justify-center rounded hover:bg-neutral-700">
              <MoreHorizCircle className="h-4 w-4" />
            </button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content>
            <DropdownMenu.Item>Add Content Block</DropdownMenu.Item>
            {/* Additional menu items can be added here */}
          </DropdownMenu.Content>
        </DropdownMenu>
      </div>
      {isEditing ? (
        <EditBlock
          block={block}
          className={tagStyles}
          onClickOutside={() => {
            if (isEditing) {
              setIsEditing(false);
            }
          }}
        />
      ) : (
        <Tag
          className={cn(
            tagStyles,
            "w-full cursor-pointer border-l-2 border-transparent pl-2 wrap-break-word whitespace-pre-wrap",
            "hover:border-neutral-600 hover:text-white",
          )}
          onClick={() => setIsEditing(true)}
        >
          {block.content}
        </Tag>
      )}
    </ContentBlock>
  );
};

export default TextBlock;
