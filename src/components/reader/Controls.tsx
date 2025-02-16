import React from "react";
import {
  AlignLeft,
  AlignCenter,
  AlignRight,
  Type,
  Minus,
  Plus,
  Palette,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface ControlsProps {
  fontSize: number;
  setFontSize: (size: number) => void;
  alignment: "left" | "center" | "right";
  setAlignment: (alignment: "left" | "center" | "right") => void;
  fontFamily: string;
  setFontFamily: (font: string) => void;
  backgroundColor: string;
  setBackgroundColor: (color: string) => void;
}

const predefinedColors = [
  { name: "White", value: "#ffffff" },
  { name: "Light Gray", value: "#f3f4f6" },
  { name: "Cream", value: "#fdf6e3" },
  { name: "Mint", value: "#f0fff4" },
  { name: "Light Blue", value: "#f0f9ff" },
  { name: "Lavender", value: "#faf5ff" },
  { name: "Sepia", value: "#fdf2e9" },
  { name: "Night", value: "#1a1a1a" },
  // Add more Son'favorite predefined colors
  { name: "Soft Beige", value: "#f5f5dc" },
  { name: "Light Sepia", value: "#f4ecd8" },
  { name: "Warm Gray", value: "#e5e5e5" },
  { name: "Pale Yellow", value: "#fffff0" },
  { name: "Cream", value: "#fdf6e3" },
  { name: "Light Brown", value: "#d2b48c" },
  { name: "Off White", value: "#faf0e6" },
];

const Controls: React.FC<ControlsProps> = ({
  fontSize,
  setFontSize,
  alignment,
  setAlignment,
  fontFamily,
  setFontFamily,
  backgroundColor,
  setBackgroundColor,
}) => {
  return (
    <Card className="w-full">
      <CardContent className="flex items-center gap-4 p-4 flex-wrap">
        {/* Font Family Selection */}
        <div className="flex items-center gap-2">
          <Type className="w-4 h-4" />
          <Select value={fontFamily} onValueChange={setFontFamily}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select font" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="inter">Inter</SelectItem>
              <SelectItem value="roboto">Roboto</SelectItem>
              <SelectItem value="arial">Arial</SelectItem>
              <SelectItem value="times">Times New Roman</SelectItem>
              <SelectItem value="courier">Courier New</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Font Size Controls */}
        <div className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  suppressHydrationWarning
                  onClick={() => setFontSize(Math.max(8, fontSize - 2))}
                >
                  <Minus className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Decrease font size</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <Slider
            className="w-[100px]"
            value={[fontSize]}
            min={8}
            max={32}
            step={1}
            onValueChange={(value) => setFontSize(value[0])}
          />

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  suppressHydrationWarning
                  onClick={() => setFontSize(Math.min(32, fontSize + 2))}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Increase font size</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        {/* Text Alignment Controls */}
        <div className="flex items-center gap-1">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={alignment === "left" ? "default" : "outline"}
                  size="icon"
                  onClick={() => setAlignment("left")}
                >
                  <AlignLeft className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Align left</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={alignment === "center" ? "default" : "outline"}
                  size="icon"
                  onClick={() => setAlignment("center")}
                >
                  <AlignCenter className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Align center</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={alignment === "right" ? "default" : "outline"}
                  size="icon"
                  onClick={() => setAlignment("right")}
                >
                  <AlignRight className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Align right</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        {/* Background Color Picker */}
        <div className="flex items-center gap-2">
          <Popover>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="icon" className="relative">
                      <Palette className="w-4 h-4" />
                      <div
                        className="absolute bottom-0 right-0 w-2 h-2 rounded-full border border-muted"
                        style={{ backgroundColor }}
                      />
                    </Button>
                  </PopoverTrigger>
                </TooltipTrigger>
                <TooltipContent>Change background color</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <PopoverContent className="w-64">
              <div className="grid grid-cols-4 gap-2">
                {predefinedColors.map((color) => (
                  <TooltipProvider key={color.value}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="icon"
                          className="w-12 h-12 rounded-md"
                          style={{ backgroundColor: color.value }}
                          onClick={() => setBackgroundColor(color.value)}
                        >
                          {backgroundColor === color.value && (
                            <div className="absolute inset-0 border-2 border-primary rounded-md" />
                          )}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>{color.name}</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </CardContent>
    </Card>
  );
};

export default Controls;
