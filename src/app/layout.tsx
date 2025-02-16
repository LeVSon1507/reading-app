"use client";

import React from "react";
import { Heart, Instagram, Linkedin, Mail, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    {
      icon: Instagram,
      href: "https://www.instagram.com/lev._.son/",
      label: "Instagram",
    },
    {
      icon: Linkedin,
      href: "https://www.linkedin.com/in/i-am-le-van-son/",
      label: "LinkedIn",
    },
    {
      icon: Mail,
      href: "mailto:sonlvs1507@gmail.com",
      label: "Email",
    },
  ];

  return (
    <footer className="border-t mt-auto bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left section - Copyright and Author */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Text Reader</h3>
            <div className="text-sm text-muted-foreground">
              © {currentYear} Created by Sol Lee. All rights reserved.
            </div>
            <div className="flex items-center space-x-1 text-sm text-muted-foreground">
              <span>Made with</span>
              <Heart className="h-4 w-4 text-red-500 fill-red-500" />
              <span>using</span>
              <a
                href="https://react.dev"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                React
              </a>
            </div>
          </div>

          {/* Middle section - Contact Info */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Contact</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>Vietnam</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                <a
                  href="mailto:sonlvs1507@gmail.com"
                  className="hover:text-foreground transition-colors"
                >
                  sonlvs1507@gmail.com
                </a>
              </div>
            </div>
          </div>

          {/* Right section - Social Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Connect</h3>
            <div className="flex items-center space-x-2">
              <TooltipProvider>
                {socialLinks.map((link) => (
                  <Tooltip key={link.label}>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => window.open(link.href, "_blank")}
                        className="hover:text-primary"
                      >
                        <link.icon className="h-5 w-5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{link.label}</p>
                    </TooltipContent>
                  </Tooltip>
                ))}
              </TooltipProvider>
            </div>
            <div className="flex items-center space-x-4 text-sm">
              <a
                href="/privacy"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Privacy Policy
              </a>
              <a
                href="/terms"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
