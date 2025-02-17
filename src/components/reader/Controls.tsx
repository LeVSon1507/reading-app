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
import { FormatRules } from "@/lib/helpers";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  predefinedColors,
  predefinedTextColors,
} from "@/components/reader/constants";

export interface ControlsProps {
  removeExtraSpaces?: boolean;
  normalizeNewlines?: boolean;
  smartQuotes?: boolean;
  normalizeUnicode?: boolean;
  preserveIndentation?: boolean;
  languageHint?: string;
  preserveParagraphs?: boolean;
  lineWidth?: number;
  fontSize: number;
  setFontSize: (size: number) => void;
  alignment: "left" | "center" | "right";
  setAlignment: (alignment: "left" | "center" | "right") => void;
  fontFamily: string;
  setFontFamily: (font: string) => void;
  backgroundColor: string;
  setBackgroundColor: (color: string) => void;
  setTextColor: (color: string) => void;
  textColor?: string;

  //format txt props
  formatRules?: FormatRules;
  onFormatRulesChange: (rules: Partial<FormatRules>) => void;
  onFormatText?: () => void;
  isFormatting?: boolean;
}

const Controls: React.FC<ControlsProps> = ({
  fontSize,
  setFontSize,
  alignment,
  setAlignment,
  fontFamily,
  setFontFamily,
  backgroundColor,
  setBackgroundColor,
  formatRules,
  setTextColor,
  textColor,
  onFormatRulesChange,
  // onFormatText,
  // isFormatting = false,
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
        {/* Text Color */}
        <div className="flex items-center gap-2">
          <Popover>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="icon" className="relative">
                      <Type className="w-4 h-4" />
                      <div
                        className="absolute bottom-0 right-0 w-2 h-2 rounded-full border border-muted"
                        style={{ backgroundColor: textColor }}
                      />
                    </Button>
                  </PopoverTrigger>
                </TooltipTrigger>
                <TooltipContent>Change text color</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <PopoverContent className="w-64">
              <div className="grid grid-cols-4 gap-2">
                {predefinedTextColors.map((color) => (
                  <TooltipProvider key={color.value}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="icon"
                          className="w-12 h-12 rounded-md relative"
                          style={{ backgroundColor: color.value }}
                          onClick={() => setTextColor(color.value)}
                        >
                          {textColor === color.value && (
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
                          className="w-12 h-12 rounded-md relative"
                          style={{ backgroundColor: color.value }}
                          onClick={() => {
                            setBackgroundColor(color.value);
                          }}
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
        {/* Format Options */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <Switch
              checked={formatRules.removeExtraSpaces}
              onCheckedChange={(checked) =>
                onFormatRulesChange({ removeExtraSpaces: checked })
              }
            />
            <Label>Remove Extra Spaces</Label>
          </div>

          <div className="flex items-center gap-2">
            <Switch
              checked={formatRules.removeEmptyLines}
              onCheckedChange={(checked) =>
                onFormatRulesChange({ removeEmptyLines: checked })
              }
            />
            <Label>Remove Empty Lines</Label>
          </div>

          <div className="flex items-center gap-2">
            <Switch
              checked={formatRules.normalizeNewlines}
              onCheckedChange={(checked) =>
                onFormatRulesChange({ normalizeNewlines: checked })
              }
            />
            <Label>Normalize Line Breaks</Label>
          </div>

          <div className="flex items-center gap-2">
            <Switch
              checked={formatRules.smartQuotes}
              onCheckedChange={(checked) =>
                onFormatRulesChange({ smartQuotes: checked })
              }
            />
            <Label>Smart Quotes</Label>
          </div>

          <div className="flex items-center gap-2">
            <Switch
              checked={formatRules.capitalizeFirstLetter}
              onCheckedChange={(checked) =>
                onFormatRulesChange({ capitalizeFirstLetter: checked })
              }
            />
            <Label>Capitalize First Letter</Label>
          </div>

          <div className="flex items-center gap-2">
            <Switch
              checked={formatRules.fixPunctuation}
              onCheckedChange={(checked) =>
                onFormatRulesChange({ fixPunctuation: checked })
              }
            />
            <Label>Fix Punctuation</Label>
          </div>
        </div>
        {/* Format Button */}
        {/* <Button
          className="w-full"
          onClick={onFormatText}
          disabled={isFormatting}
        >
          {isFormatting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Formatting...
            </>
          ) : (
            "Format Text"
          )}
        </Button> */}
      </CardContent>
    </Card>
  );
};

export default Controls;
