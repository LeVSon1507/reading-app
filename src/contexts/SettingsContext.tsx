/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

interface Settings {
  appearance: {
    darkMode: boolean;
    theme: "system" | "light" | "dark";
    fontFamily: string;
    fontSize: number;
    compactMode: boolean;
    showSidebar: boolean;
    accentColor: string;
    borderRadius: number;
    animation: boolean;
  };
  reading: {
    lineSpacing: number;
    paragraphSpacing: number;
    textWidth: number;
    justifyText: boolean;
    autoScroll: boolean;
    scrollSpeed: number;
    smartQuotes: boolean;
    autoHyphenation: boolean;
    linkBehavior: "hover" | "click" | "none";
  };
  notifications: {
    pushNotifications: boolean;
    emailUpdates: boolean;
    soundEnabled: boolean;
    notificationPosition:
      | "top-right"
      | "top-left"
      | "bottom-right"
      | "bottom-left";
    showBadges: boolean;
    quietHours: {
      enabled: boolean;
      start: string;
      end: string;
    };
  };
  accessibility: {
    highContrast: boolean;
    reducedMotion: boolean;
    largeText: boolean;
    screenReader: boolean;
    keyboardNavigation: boolean;
    focusIndicator: boolean;
  };
  performance: {
    prefetch: boolean;
    lazyLoading: boolean;
    cacheSize: number;
    offlineMode: boolean;
  };
  privacy: {
    trackingConsent: boolean;
    cookiePreferences: {
      necessary: boolean;
      functional: boolean;
      analytics: boolean;
      advertising: boolean;
    };
    dataRetention: number;
  };
  language: {
    preferred: string;
    fallback: string;
    spellCheck: boolean;
    autoTranslate: boolean;
  };
}

const defaultSettings: Settings = {
  appearance: {
    darkMode: false,
    theme: "system",
    fontFamily: "inter",
    fontSize: 16,
    compactMode: false,
    showSidebar: true,
    accentColor: "#007AFF",
    borderRadius: 8,
    animation: true,
  },
  reading: {
    lineSpacing: 1.5,
    paragraphSpacing: 1.2,
    textWidth: 720,
    justifyText: false,
    autoScroll: false,
    scrollSpeed: 1,
    smartQuotes: true,
    autoHyphenation: false,
    linkBehavior: "hover",
  },
  notifications: {
    pushNotifications: false,
    emailUpdates: false,
    soundEnabled: true,
    notificationPosition: "top-right",
    showBadges: true,
    quietHours: {
      enabled: false,
      start: "22:00",
      end: "07:00",
    },
  },
  accessibility: {
    highContrast: false,
    reducedMotion: false,
    largeText: false,
    screenReader: false,
    keyboardNavigation: true,
    focusIndicator: true,
  },
  performance: {
    prefetch: true,
    lazyLoading: true,
    cacheSize: 50,
    offlineMode: false,
  },
  privacy: {
    trackingConsent: false,
    cookiePreferences: {
      necessary: true,
      functional: true,
      analytics: false,
      advertising: false,
    },
    dataRetention: 90,
  },
  language: {
    preferred: "en",
    fallback: "en",
    spellCheck: true,
    autoTranslate: false,
  },
};

interface SettingsContextType {
  settings: Settings;
  updateSettings: (newSettings: Partial<Settings>) => void;
  resetSettings: () => void;
  updateSettingsByPath: (path: string, value: any) => void;
}

const SettingsContext = createContext<SettingsContextType>({
  settings: defaultSettings,
  updateSettings: () => {},
  resetSettings: () => {},
  updateSettingsByPath: () => {},
});

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = () => {
    try {
      const savedSettings = localStorage.getItem("appSettings");
      if (savedSettings) {
        const parsedSettings = JSON.parse(savedSettings);
        setSettings(parsedSettings);
        applySettings(parsedSettings);
      } else {
        applySettings(defaultSettings);
      }
    } catch (error) {
      console.error("Error loading settings:", error);
      applySettings(defaultSettings);
    } finally {
      setIsLoaded(true);
    }
  };

  const applySettings = (settingsToApply: Settings) => {
    // Theme
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    const shouldUseDark =
      settingsToApply.appearance.theme === "dark" ||
      (settingsToApply.appearance.theme === "system" && prefersDark);

    document.documentElement.classList.toggle("dark", shouldUseDark);

    // Font settings
    document.documentElement.style.fontFamily =
      settingsToApply.appearance.fontFamily;
    document.documentElement.style.fontSize = `${settingsToApply.appearance.fontSize}px`;

    // Accessibility
    document.documentElement.classList.toggle(
      "high-contrast",
      settingsToApply.accessibility.highContrast
    );
    document.documentElement.classList.toggle(
      "reduced-motion",
      settingsToApply.accessibility.reducedMotion
    );

    // Custom properties
    document.documentElement.style.setProperty(
      "--accent-color",
      settingsToApply.appearance.accentColor
    );
    document.documentElement.style.setProperty(
      "--border-radius",
      `${settingsToApply.appearance.borderRadius}px`
    );

    // Line spacing
    document.documentElement.style.setProperty(
      "--line-height",
      settingsToApply.reading.lineSpacing.toString()
    );

    // Animation
    document.documentElement.classList.toggle(
      "disable-animations",
      !settingsToApply.appearance.animation
    );
  };

  const updateSettings = (newSettings: Partial<Settings>) => {
    setSettings((prevSettings) => {
      const updatedSettings = {
        ...prevSettings,
        ...newSettings,
      };
      localStorage.setItem("appSettings", JSON.stringify(updatedSettings));
      applySettings(updatedSettings);
      return updatedSettings;
    });
  };

  const resetSettings = () => {
    localStorage.removeItem("appSettings");
    setSettings(defaultSettings);
    applySettings(defaultSettings);
  };

  const updateSettingsByPath = (path: string, value: any) => {
    setSettings((prevSettings) => {
      const newSettings = { ...prevSettings };
      let current = newSettings;
      const keys = path.split(".");

      // Navigate to the nested property
      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i] as keyof typeof current] as any;
      }

      // Update the value
      const lastKey = keys[keys.length - 1];
      current[lastKey as keyof typeof current] = value;

      localStorage.setItem("appSettings", JSON.stringify(newSettings));
      applySettings(newSettings);
      return newSettings;
    });
  };

  if (!isLoaded) {
    return null;
  }

  return (
    <SettingsContext.Provider
      value={{
        settings,
        updateSettings,
        resetSettings,
        updateSettingsByPath,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
};

// Utility hook for accessing specific settings
export const useSettingValue = <T,>(path: string): T => {
  const { settings } = useSettings();
  return path.split(".").reduce((obj, key) => obj[key], settings) as T;
};
