import React from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import TooltipButton from "@/components/shared/TooltipButton";

interface ColorOption {
  name: string;
  value: string;
}

interface ColorPickerProps {
  icon: React.ReactNode;
  tooltip: string;
  selectedColor: string;
  colors: ColorOption[];
  onColorChange: (color: string) => void;
}

const ColorPicker = ({
  icon,
  tooltip,
  selectedColor,
  colors,
  onColorChange,
}: ColorPickerProps) => {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div className="inline-block">
          {/* Add wrapper div */}
          <TooltipButton tooltip={tooltip} className="relative">
            {icon}
            <div
              className="absolute bottom-0 right-0 w-2 h-2 rounded-full border border-muted"
              style={{ backgroundColor: selectedColor }}
            />
          </TooltipButton>
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-3" sideOffset={5} align="center">
        <div className="grid grid-cols-4 gap-2">
          {colors.map((color) => (
            <TooltipButton
              key={color.value}
              tooltip={color.name}
              className="w-12 h-12 rounded-md relative"
              style={{ backgroundColor: color.value }}
              onClick={() => {
                onColorChange(color.value);
                setOpen(false);
              }}
            >
              {selectedColor === color.value && (
                <div className="absolute inset-0 border-2 border-primary rounded-md" />
              )}
            </TooltipButton>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ColorPicker;
