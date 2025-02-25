"use client";

import { TextFormatOptions } from "@/components/reader/type";
import { FormatRules } from "@/lib/helpers";
import { createContext, useContext, useState } from "react";

export const formatOptionsInitialValues: TextFormatOptions = {
  lineWidth: 80,
  preserveParagraphs: true,
  removeExtraSpaces: true,
  normalizeNewlines: true,
  smartQuotes: true,
  normalizeUnicode: true,
  preserveIndentation: true,
  languageHint: "auto",
  fontSize: 16,
  alignment: "left",
  fontFamily: "inter",
  backgroundColor: "#d2b48c",
  textColor: "#000000",
};

export const formatRulesInitialValues: FormatRules = {
  removeExtraSpaces: false,
  normalizeNewlines: false,
  smartQuotes: false,
  capitalizeFirstLetter: false,
  fixPunctuation: false,
  removeEmptyLines: false,
  trimLines: false,
  lineWidth: 80,
};

type FormatType = {
  formatOptions: TextFormatOptions;
  formatRules: FormatRules;
};

type FormatContextType = [
  FormatType,
  React.Dispatch<React.SetStateAction<FormatType>>
];

const initialState: FormatType = {
  formatOptions: formatOptionsInitialValues,
  formatRules: formatRulesInitialValues,
};

export const FormatContext = createContext<FormatContextType>([
  initialState,
  () => {},
]);

export const useFormat = () => {
  const [formats, setFormats] = useContext(FormatContext);
  return { formats, setFormats };
};

interface FormatProviderProps {
  children: React.ReactNode;
}

export const FormatProvider: React.FC<FormatProviderProps> = ({ children }) => {
  const [formats, setFormats] = useState<FormatType>(initialState);

  return (
    <FormatContext.Provider value={[formats, setFormats]}>
      {children}
    </FormatContext.Provider>
  );
};
