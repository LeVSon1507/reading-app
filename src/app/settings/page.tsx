"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Toggle } from "@/components/ui/toggle";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Moon } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";

export interface Settings {
  appearance: {
    darkMode: boolean;
    fontFamily: string;
    fontSize: number;
    compactMode: boolean;
    showSidebar: boolean;
  };
  reading: {
    lineSpacing: string;
    textWidth: number;
    autoScroll: boolean;
    smartQuotes: boolean;
    autoHyphenation: boolean;
    linkDetection: boolean;
  };
  notifications: {
    pushNotifications: boolean;
    emailUpdates: boolean;
    readingReminders: boolean;
  };
  accessibility: {
    highContrast: boolean;
    motionReduction: boolean;
    screenReader: boolean;
  };
}

const defaultSettings: Settings = {
  appearance: {
    darkMode: false,
    fontFamily: "inter",
    fontSize: 16,
    compactMode: false,
    showSidebar: true,
  },
  reading: {
    lineSpacing: "1.5",
    textWidth: 720,
    autoScroll: false,
    smartQuotes: false,
    autoHyphenation: false,
    linkDetection: true,
  },
  notifications: {
    pushNotifications: false,
    emailUpdates: false,
    readingReminders: false,
  },
  accessibility: {
    highContrast: false,
    motionReduction: false,
    screenReader: false,
  },
};

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const { toast } = useToast();

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem("appSettings");
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  // Save settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("appSettings", JSON.stringify(settings));
  }, [settings]);

  // Update appearance settings
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateAppearance = (key: keyof Settings["appearance"], value: any) => {
    setSettings((prev) => ({
      ...prev,
      appearance: { ...prev.appearance, [key]: value },
    }));

    // Apply dark mode
    if (key === "darkMode") {
      document.documentElement.classList.toggle("dark", value);
    }

    // Apply font family
    if (key === "fontFamily") {
      document.documentElement.style.fontFamily = value;
    }

    // Apply font size
    if (key === "fontSize") {
      document.documentElement.style.fontSize = `${value}px`;
    }

    toast({
      title: "Settings Updated",
      description: "Your appearance settings have been saved.",
    });
  };

  // Update reading settings
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateReading = (key: keyof Settings["reading"], value: any) => {
    setSettings((prev) => ({
      ...prev,
      reading: { ...prev.reading, [key]: value },
    }));

    toast({
      title: "Settings Updated",
      description: "Your reading settings have been saved.",
    });
  };

  // Update notification settings
  const updateNotifications = (
    key: keyof Settings["notifications"],
    value: boolean
  ) => {
    setSettings((prev) => ({
      ...prev,
      notifications: { ...prev.notifications, [key]: value },
    }));

    if (value) {
      // Request notification permissions if enabled
      if ("Notification" in window) {
        Notification.requestPermission();
      }
    }

    toast({
      title: "Settings Updated",
      description: "Your notification settings have been saved.",
    });
  };

  // Update accessibility settings
  const updateAccessibility = (
    key: keyof Settings["accessibility"],
    value: boolean
  ) => {
    setSettings((prev) => ({
      ...prev,
      accessibility: { ...prev.accessibility, [key]: value },
    }));

    // Apply high contrast
    if (key === "highContrast") {
      document.documentElement.classList.toggle("high-contrast", value);
    }

    // Apply reduced motion
    if (key === "motionReduction") {
      document.documentElement.classList.toggle("reduce-motion", value);
    }

    toast({
      title: "Settings Updated",
      description: "Your accessibility settings have been saved.",
    });
  };

  return (
    <div className="container mx-auto p-4 py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Settings</h1>
          <p className="text-muted-foreground">
            Manage your app preferences and configuration
          </p>
        </div>

        <Tabs defaultValue="appearance" className="space-y-4">
          <TabsList>
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
            <TabsTrigger value="reading">Reading</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="accessibility">Accessibility</TabsTrigger>
          </TabsList>

          <TabsContent value="appearance">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Theme</CardTitle>
                  <CardDescription>
                    Customize the app appearance
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Moon className="h-5 w-5" />
                      <div className="space-y-0.5">
                        <Label>Dark Mode</Label>
                        <p className="text-sm text-muted-foreground">
                          Switch between light and dark theme
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={settings.appearance.darkMode}
                      onCheckedChange={(checked) =>
                        updateAppearance("darkMode", checked)
                      }
                    />
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label>Font Family</Label>
                      <Select
                        value={settings.appearance.fontFamily}
                        onValueChange={(value) =>
                          updateAppearance("fontFamily", value)
                        }
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Select font" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="inter">Inter</SelectItem>
                          <SelectItem value="roboto">Roboto</SelectItem>
                          <SelectItem value="sf-pro">SF Pro</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label>Font Size</Label>
                        <span className="text-sm text-muted-foreground">
                          {settings.appearance.fontSize}px
                        </span>
                      </div>
                      <Slider
                        value={[settings.appearance.fontSize]}
                        onValueChange={([value]) =>
                          updateAppearance("fontSize", value)
                        }
                        max={24}
                        min={12}
                        step={1}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Layout</CardTitle>
                  <CardDescription>Configure the app layout</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Compact Mode</Label>
                      <p className="text-sm text-muted-foreground">
                        Reduce spacing between elements
                      </p>
                    </div>
                    <Switch
                      checked={settings.appearance.compactMode}
                      onCheckedChange={(checked) =>
                        updateAppearance("compactMode", checked)
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Show Sidebar</Label>
                      <p className="text-sm text-muted-foreground">
                        Toggle sidebar visibility
                      </p>
                    </div>
                    <Switch
                      checked={settings.appearance.showSidebar}
                      onCheckedChange={(checked) =>
                        updateAppearance("showSidebar", checked)
                      }
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Reading Tab Content */}
          <TabsContent value="reading">
            <Card>
              <CardHeader>
                <CardTitle>Reading Preferences</CardTitle>
                <CardDescription>
                  Customize your reading experience
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Line Spacing</Label>
                      <p className="text-sm text-muted-foreground">
                        Adjust space between lines
                      </p>
                    </div>
                    <Select
                      value={settings.reading.lineSpacing}
                      onValueChange={(value) =>
                        updateReading("lineSpacing", value)
                      }
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select spacing" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Single</SelectItem>
                        <SelectItem value="1.5">1.5 Lines</SelectItem>
                        <SelectItem value="2">Double</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Text Width</Label>
                      <span className="text-sm text-muted-foreground">
                        {settings.reading.textWidth}px
                      </span>
                    </div>
                    <Slider
                      value={[settings.reading.textWidth]}
                      onValueChange={([value]) =>
                        updateReading("textWidth", value)
                      }
                      max={1200}
                      min={400}
                      step={10}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Auto-scroll</Label>
                      <p className="text-sm text-muted-foreground">
                        Enable automatic scrolling
                      </p>
                    </div>
                    <Switch
                      checked={settings.reading.autoScroll}
                      onCheckedChange={(checked) =>
                        updateReading("autoScroll", checked)
                      }
                    />
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="font-medium">Text Processing</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Smart Quotes</Label>
                      <Toggle
                        pressed={settings.reading.smartQuotes}
                        onPressedChange={(pressed) =>
                          updateReading("smartQuotes", pressed)
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Auto Hyphenation</Label>
                      <Toggle
                        pressed={settings.reading.autoHyphenation}
                        onPressedChange={(pressed) =>
                          updateReading("autoHyphenation", pressed)
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Link Detection</Label>
                      <Toggle
                        pressed={settings.reading.linkDetection}
                        onPressedChange={(pressed) =>
                          updateReading("linkDetection", pressed)
                        }
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Tab Content */}
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>
                  Manage your notification preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Push Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive push notifications
                      </p>
                    </div>
                    <Switch
                      checked={settings.notifications.pushNotifications}
                      onCheckedChange={(checked) =>
                        updateNotifications("pushNotifications", checked)
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Email Updates</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive email notifications
                      </p>
                    </div>
                    <Switch
                      checked={settings.notifications.emailUpdates}
                      onCheckedChange={(checked) =>
                        updateNotifications("emailUpdates", checked)
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Reading Reminders</Label>
                      <p className="text-sm text-muted-foreground">
                        Get reminded about unfinished readings
                      </p>
                    </div>
                    <Switch
                      checked={settings.notifications.readingReminders}
                      onCheckedChange={(checked) =>
                        updateNotifications("readingReminders", checked)
                      }
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Accessibility Tab Content */}
          <TabsContent value="accessibility">
            <Card>
              <CardHeader>
                <CardTitle>Accessibility Settings</CardTitle>
                <CardDescription>
                  Configure accessibility options
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>High Contrast</Label>
                      <p className="text-sm text-muted-foreground">
                        Increase text contrast
                      </p>
                    </div>
                    <Switch
                      checked={settings.accessibility.highContrast}
                      onCheckedChange={(checked) =>
                        updateAccessibility("highContrast", checked)
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Motion Reduction</Label>
                      <p className="text-sm text-muted-foreground">
                        Reduce animation effects
                      </p>
                    </div>
                    <Switch
                      checked={settings.accessibility.motionReduction}
                      onCheckedChange={(checked) =>
                        updateAccessibility("motionReduction", checked)
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Screen Reader Optimization</Label>
                      <p className="text-sm text-muted-foreground">
                        Optimize content for screen readers
                      </p>
                    </div>
                    <Switch
                      checked={settings.accessibility.screenReader}
                      onCheckedChange={(checked) =>
                        updateAccessibility("screenReader", checked)
                      }
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}