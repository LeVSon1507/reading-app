import { useTheme } from "@/contexts/ThemeContext";
import classNames from "classnames";
import { Moon } from "lucide-react";

interface ThemeToggleProps {
  className?: string;
}

export const ThemeToggle = ({ className }: ThemeToggleProps) => {
  const { toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={classNames(
        "p-2 rounded-lg transition-colors",

        useTheme().theme === "dark"
          ? "bg-gray-800 text-white hover:bg-gray-700"
          : "bg-white text-gray-800 hover:bg-gray-100",
        className
      )}
    >
      <Moon size={20} />
    </button>
  );
};
