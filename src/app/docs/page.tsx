"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileText, Type, Palette } from "lucide-react";

const features = [
  {
    title: "File Support",
    description:
      "Upload and read text files with support for various encodings",
    icon: <FileText className="h-5 w-5 mt-1" />,
  },
  {
    title: "Text Formatting",
    description:
      "Advanced text formatting options including spacing, quotes, and line width",
    icon: <Type className="h-5 w-5 mt-1" />,
  },
  {
    title: "Customization",
    description:
      "Customize fonts, colors, and layout to match your preferences",
    icon: <Palette className="h-5 w-5 mt-1" />,
  },
];

const formattingOptions = [
  {
    title: "Smart Quotes",
    description: "Convert straight quotes to curly quotes",
    status: "Available",
  },
  {
    title: "Line Width",
    description: "Adjust the maximum width of text lines",
    status: "Available",
  },
  {
    title: "Spacing Control",
    description: "Remove extra spaces and normalize line breaks",
    status: "Available",
  },
  {
    title: "Unicode Normalization",
    description: "Standardize Unicode characters",
    status: "Available",
  },
  {
    title: "Paragraph Preservation",
    description: "Maintain paragraph structure during formatting",
    status: "Available",
  },
];

export default function DocsPage() {
  return (
    <div className="container mx-auto py-10 px-4">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Documentation</h1>
        <p className="text-muted-foreground">
          Learn how to use the Reading App features and capabilities
        </p>
      </div>

      <Tabs defaultValue="getting-started" className="space-y-4">
        <TabsList>
          <TabsTrigger value="getting-started">Getting Started</TabsTrigger>
          <TabsTrigger value="features">Features</TabsTrigger>
          <TabsTrigger value="formatting">Text Formatting</TabsTrigger>
          <TabsTrigger value="customization">Customization</TabsTrigger>
        </TabsList>

        <TabsContent value="getting-started">
          <Card>
            <CardHeader>
              <CardTitle>Getting Started</CardTitle>
              <CardDescription>
                Learn the basics of using the Reading App
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Upload Files</h3>
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  <p>Currently supports .txt files</p>
                </div>
                <p className="text-sm text-muted-foreground">
                  Drag and drop your file into the upload area or click to
                  browse files. The app will automatically load and display your
                  text content.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Basic Navigation</h3>
                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                  <li>Use the top toolbar to access formatting options</li>
                  <li>Scroll through your text in the main viewing area</li>
                  <li>Adjust display settings using the control panel</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="features">
          <Card>
            <CardHeader>
              <CardTitle>Features</CardTitle>
              <CardDescription>
                Explore the key features of the Reading App
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {features.map((feature) => (
                  <div key={feature.title} className="flex items-start gap-4">
                    {feature.icon}
                    <div>
                      <h3 className="font-semibold">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="formatting">
          <Card>
            <CardHeader>
              <CardTitle>Text Formatting Options</CardTitle>
              <CardDescription>
                Learn about available text formatting features
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px] pr-4">
                <div className="space-y-4">
                  {formattingOptions.map((feature) => (
                    <div key={feature.title} className="border-b pb-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold">{feature.title}</h3>
                        <Badge variant="secondary">{feature.status}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {feature.description}
                      </p>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="customization">
          <Card>
            <CardHeader>
              <CardTitle>Text customization</CardTitle>
              <CardDescription>
                Learn about available text customization features
              </CardDescription>
            </CardHeader>
            <CardContent>In development.</CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
