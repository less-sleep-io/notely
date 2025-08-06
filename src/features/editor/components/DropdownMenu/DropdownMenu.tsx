import {
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

import cn from "../../../../utils/cn";

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
        className={cn(className, "bg-neutral-800 p-0")}
        sideOffset={sideOffset}
        {...rest}
      >
        {children}
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
        "cursor-pointer px-4 py-3 text-sm text-neutral-300 hover:bg-neutral-700",
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
