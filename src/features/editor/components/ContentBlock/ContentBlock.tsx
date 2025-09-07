import { Plus } from "iconoir-react";
import { type HTMLAttributes, useState } from "react";

import Tooltip from "~/components/Tooltip";

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
  className,
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
    <div className={cn("flex w-full flex-col", className)} {...rest}>
      <div className="flex w-full items-start gap-5" {...rest}>
        {children}
      </div>
      <DropdownMenu onOpenChange={setIsMenuOpen} open={isMenuOpen}>
        <DropdownMenu.Trigger asChild={true}>
          <DropdownMenu.Trigger>
            <div
              className={cn(
                "flex h-6 w-full cursor-pointer items-center gap-2 opacity-0 hover:opacity-100",
                {
                  "opacity-100": isMenuOpen,
                },
              )}
              {...rest}
            >
              <div className="h-px w-full border-b-2 border-neutral-700" />
              <Plus className="h-4 w-4 shrink-0" />
              <div className="h-px w-full border-b-2 border-neutral-700" />
            </div>
          </DropdownMenu.Trigger>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content align="center" side="top">
          {Object.entries(TEXT_BLOCK_TAGS).map(([tag, label]) => {
            return (
              <Tooltip content={`Add ${tag} block`}>
                <DropdownMenu.Item
                  onSelect={() =>
                    onAddContentBlock({
                      tag: tag as TextBlockTag,
                      type: "text",
                    })
                  }
                  key={tag}
                  title={label}
                >
                  {tag.toUpperCase()}
                </DropdownMenu.Item>
              </Tooltip>
            );
          })}
        </DropdownMenu.Content>
      </DropdownMenu>
    </div>
  );
};

export default ContentBlock;
