import { Plus } from "iconoir-react";
import { type HTMLAttributes, useState } from "react";

import { TEXT_BLOCK_TAGS } from "../../../../shared.constants";
import type { TextBlock, TextBlockTag } from "../../../../shared.types";
import cn from "../../../../utils/cn";
import DropdownMenu from "../DropdownMenu";

interface onAddContentBlockArgs {
  tag: TextBlockTag;
  type: "text";
}

export interface ContentBlockProps extends HTMLAttributes<HTMLDivElement> {
  block: TextBlock;
  onAddContentBlock: ({ tag, type }: onAddContentBlockArgs) => void;
}

const ContentBlock = ({
  block,
  children,
  onAddContentBlock,
  ...rest
}: ContentBlockProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  if (!block) {
    return (
      <div className="w-full" {...rest}>
        Block not found
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col" {...rest}>
      <div className="flex w-full items-start gap-5" {...rest}>
        {children}
      </div>
      <div
        className={cn(
          "flex h-6 w-full cursor-pointer items-center gap-5 opacity-0 hover:opacity-100",
          {
            "opacity-100": isMenuOpen,
          },
        )}
        {...rest}
      >
        <DropdownMenu onOpenChange={setIsMenuOpen} open={isMenuOpen}>
          <DropdownMenu.Trigger asChild={true}>
            <DropdownMenu.Trigger>
              <Plus className="h-4 w-4" />
            </DropdownMenu.Trigger>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content align="start" className="min-w-40">
            <DropdownMenu.Label>Add block after:</DropdownMenu.Label>
            {Object.entries(TEXT_BLOCK_TAGS).map(([tag, label]) => {
              return (
                <DropdownMenu.Item
                  onSelect={() =>
                    onAddContentBlock({
                      tag: tag as TextBlockTag,
                      type: "text",
                    })
                  }
                  key={tag}
                >
                  {label}
                </DropdownMenu.Item>
              );
            })}
          </DropdownMenu.Content>
        </DropdownMenu>
        <div className="h-px w-full border-b-2 border-neutral-700" />
      </div>
    </div>
  );
};

export default ContentBlock;
