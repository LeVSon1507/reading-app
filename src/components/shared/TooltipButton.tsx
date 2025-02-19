import React from "react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface TooltipButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  tooltip: string;
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "icon" | "sm";
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

const TooltipButton = ({
  tooltip,
  variant = "outline",
  size = "icon",
  children,
  className,
  style,
  onClick,
  ...props
}: TooltipButtonProps) => {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={300}>
        <TooltipTrigger asChild>
          <Button
            variant={variant}
            size={size}
            className={className}
            style={style}
            onClick={onClick}
            type="button"
            {...props}
          >
            {children}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{tooltip}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default TooltipButton;
