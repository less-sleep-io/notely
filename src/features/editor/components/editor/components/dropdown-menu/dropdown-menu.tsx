import {
  Arrow,
  Content,
  type DropdownMenuContentProps,
  type DropdownMenuItemProps,
  type DropdownMenuLabelProps,
  type DropdownMenuProps,
  type DropdownMenuTriggerProps,
  Item,
  Label,
  Portal,
  Root,
  Trigger,
} from "@radix-ui/react-dropdown-menu";

import cn from "~/utils/cn";

const DropdownMenuContent = ({
  alignOffset = -8,
  children,
  className,
  sideOffset = 8,
  ...rest
}: DropdownMenuContentProps) => {
  return (
    <Portal>
      <Content
        alignOffset={alignOffset}
        className={cn(
          "flex rounded-md border border-neutral-700 bg-neutral-800 p-0",
          className,
        )}
        aria-orientation="horizontal"
        data-orientation="horizontal"
        sideOffset={sideOffset}
        {...rest}
      >
        {children}
        <Arrow className="h-2 w-4 fill-neutral-800" />
      </Content>
    </Portal>
  );
};

const DropdownMenuLabel = ({
  children,
  className,
  ...rest
}: DropdownMenuLabelProps) => {
  return (
    <Label
      className={cn(
        className,
        "cursor-pointer px-4 py-3 text-sm text-neutral-300 hover:bg-neutral-700",
      )}
      {...rest}
    >
      {children}
    </Label>
  );
};

const DropdownMenuItem = ({
  children,
  className,
  ...rest
}: DropdownMenuItemProps) => {
  return (
    <Item
      className={cn(
        className,
        "cursor-pointer border-r border-neutral-700 px-4 py-3 text-sm text-neutral-300 last:border-r-0 hover:bg-neutral-700",
      )}
      {...rest}
    >
      {children}
    </Item>
  );
};

const DropdownMenuTrigger = ({
  children,
  ...rest
}: DropdownMenuTriggerProps) => {
  return (
    <Trigger className="cursor-pointer" {...rest}>
      {children}
    </Trigger>
  );
};

const DropdownMenu = ({ children, ...rest }: DropdownMenuProps) => {
  return <Root {...rest}>{children}</Root>;
};

DropdownMenu.Content = DropdownMenuContent;
DropdownMenu.Item = DropdownMenuItem;
DropdownMenu.Label = DropdownMenuLabel;

DropdownMenu.Trigger = DropdownMenuTrigger;

export default DropdownMenu;
