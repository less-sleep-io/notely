import {
  Arrow,
  Content,
  Portal,
  Root,
  type TooltipProps as TooltipPrimitiveProps,
  Trigger,
} from "@radix-ui/react-tooltip";

interface TooltipProps extends TooltipPrimitiveProps {
  content: string;
}

const Tooltip = ({ children, content, ...rest }: TooltipProps) => {
  return (
    <Root {...rest}>
      <Trigger asChild={true}>{children}</Trigger>
      <Portal>
        <Content className="rounded-sm border border-neutral-700 bg-neutral-800 p-1 px-2 text-sm text-neutral-400">
          {content}
          <Arrow className="h-2 w-4 fill-neutral-800" />
        </Content>
      </Portal>
    </Root>
  );
};

export default Tooltip;
