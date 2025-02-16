"use client";

import React from "react";
import { FileText, Github } from "lucide-react";
import { Button } from "components/ui/button";
import Link from "next/link";

const Header = () => {
  return (
    <header className="border-b">
      <div className="container mx-auto px-4 h-16">
        <div className="flex items-center justify-between h-full">
          {/* Logo and App Name */}
          <div className="flex items-center space-x-2">
            <FileText className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold">Text Reader</h1>
          </div>

          {/* Right side links */}
          <div className="flex items-center space-x-4">
            <nav className="hidden md:flex items-center space-x-4">
              <Button variant="ghost" className="text-sm">
                Docs
              </Button>
              <Button variant="ghost" className="text-sm">
                About
              </Button>
            </nav>

            <Button
              variant="outline"
              size="icon"
              onClick={() => {
                <Link
                  href={'https://github.com/LeVSon1507"'}
                  target="_blank"
                  rel="noopener noreferrer"
                />;
              }}
            >
              <Github className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
