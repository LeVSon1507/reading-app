"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Image from "next/image";
import { useRouter } from "next/navigation";

const Header = () => {
  const router = useRouter();

  const NavButton = ({
    path,
    iconSrc,
    label,
  }: {
    path: string;
    iconSrc: string;
    label: string;
  }) => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            onClick={() => router.push(path)}
            variant="ghost"
            className="text-sm font-medium"
          >
            {label}
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="p-4">
          <div className="space-y-2">
            <Image
              width={150}
              height={150}
              src={iconSrc}
              alt={`${label} Icon Large`}
              className="mx-auto"
            />
            <p className="text-center font-medium">{label}</p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 h-16">
        <div className="flex items-center justify-between h-full">
          <div
            className="flex items-center space-x-2 cursor-pointer"
            onClick={() => router.push("/")}
          >
            <Image
              src="/reading_icon_1.svg"
              alt="Reading Icon"
              width={70}
              height={70}
              className="text-primary"
            />
            <h1 className="text-2xl font-bold text-[#d2b48c]">Reading App</h1>
          </div>

          <div className="flex items-center space-x-4">
            <nav className="flex items-center space-x-2">
              <NavButton path="/docs" iconSrc="/docs.svg" label="Documents" />
              <NavButton path="/about" iconSrc="/about.svg" label="About" />
              <NavButton
                path="/settings"
                iconSrc="/settings.svg"
                label="Settings"
              />
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;