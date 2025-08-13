import { MoreHorizCircle } from "iconoir-react";
import type { HTMLAttributes } from "react";

import DropdownMenu from "../DropdownMenu";

interface TriggerButtonProps extends HTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

const TriggerButton = ({ children, ...rest }: TriggerButtonProps) => {
  return (
    <button
      className="flex h-5 w-5 cursor-pointer items-center justify-center rounded hover:bg-neutral-700"
      {...rest}
    >
      {children}
    </button>
  );
};

const Controls = () => {
  return (
    <div className="flex items-center justify-between gap-1 py-1">
      <DropdownMenu>
        <DropdownMenu.Trigger asChild={true}>
          <TriggerButton>
            <MoreHorizCircle className="h-4 w-4" />
          </TriggerButton>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content>
          <DropdownMenu.Item>Add Content Block</DropdownMenu.Item>
          {/* Additional menu items can be added here */}
        </DropdownMenu.Content>
      </DropdownMenu>
    </div>
  );
};

export default Controls;
