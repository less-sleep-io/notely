import { useClickOutside } from "@mantine/hooks";
import { useState } from "react";

import type { TextBlock as TextBlockType } from "../../../../shared.types";
import { useNoteStore } from "../../../../store/notes";
import ContentBlock, {
  type ContentBlockProps,
} from "../ContentBlock/ContentBlock";
import Controls from "../Controls";

interface EditBlockProps {
  block: TextBlockType;
  onClickOutside: () => void;
}

const EditBlock = ({ block, onClickOutside }: EditBlockProps) => {
  const updateContentBlock = useNoteStore((state) => state.updateContentBlock);
  const ref = useClickOutside(onClickOutside);

  return (
    <textarea
      className="rounded border border-neutral-300 p-2"
      onChange={(e) => {
        updateContentBlock(block.id, e.target.value);
      }}
      ref={ref}
      value={block.content}
    />
  );
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

  const Tag = block.tag || "div"; // Default to 'div' if type is not defined

  return (
    <ContentBlock block={block} onAddContentBlock={onAddContentBlock} {...rest}>
      <Controls />
      {isEditing ? (
        <EditBlock
          block={block}
          onClickOutside={() => {
            if (isEditing) {
              setIsEditing(false);
            }
          }}
        />
      ) : (
        <Tag className="w-full" onClick={() => setIsEditing(true)}>
          {block.content}
        </Tag>
      )}
    </ContentBlock>
  );
};

export default TextBlock;
