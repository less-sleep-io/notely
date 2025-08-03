import { useClickOutside } from "@mantine/hooks";
import { type HTMLAttributes, useState } from "react";

import { useNoteStore } from "../../../../store/notes";

interface TextBlockProps extends HTMLAttributes<HTMLDivElement> {
  blockId: string;
  className?: string;
}

const TextBlock = ({ blockId, ...rest }: TextBlockProps) => {
  const block = useNoteStore((state) => {
    console.log("state", state);
    return state.contentBlocks.get(blockId);
  });
  const updateContentBlock = useNoteStore((state) => state.updateContentBlock);
  const [isEditing, setIsEditing] = useState(false);
  const ref = useClickOutside(() => {
    if (isEditing) {
      setIsEditing(false);
    }
  });

  if (!block) {
    return (
      <div className="w-full" {...rest}>
        Block not found
      </div>
    );
  }

  if (isEditing) {
    return (
      <div className="w-full" {...rest} ref={ref}>
        <textarea
          className="w-full rounded border border-neutral-300 p-2"
          onChange={(e) => {
            updateContentBlock(blockId, e.target.value);
          }}
          value={block.content}
        />
      </div>
    );
  }

  const Tag = block.type || "div"; // Default to 'div' if type is not defined

  return (
    <Tag className="w-full" onClick={() => setIsEditing(true)}>
      {block.content}
    </Tag>
  );
};

export default TextBlock;
