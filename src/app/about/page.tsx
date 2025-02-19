"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Linkedin, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      <div className="container mx-auto py-10 px-4 max-w-4xl">
        {/* Hero Section */}
        <section className="text-center space-y-6 mb-12">
          <h1 className="text-5xl font-bold tracking-tight">Reading App</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A modern text reading and formatting application built for better
            reading experience
          </p>
          <div className="flex justify-center gap-3">
            <Badge variant="secondary" className="px-4 py-1 text-sm">
              Version 1.0.0
            </Badge>
            <Badge variant="outline" className="px-4 py-1 text-sm">
              Open Source
            </Badge>
          </div>
        </section>

        <div className="grid gap-8">
          {/* Mission Section */}
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="text-2xl">Our Mission</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground">
              <p className="leading-relaxed">
                Reading App was created with the goal of providing a simple yet
                powerful tool for reading and formatting text files. We believe
                in making content more accessible and easier to read through
                smart formatting and customization options.
              </p>
            </CardContent>
          </Card>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                title: "Text File Support",
                description:
                  "Upload and read .txt files with various encoding support",
                icon: "📄",
              },
              {
                title: "Smart Formatting",
                description:
                  "Intelligent text formatting with customizable rules",
                icon: "⚡",
              },
              {
                title: "Customization",
                description:
                  "Personalize your reading experience with fonts, colors, and layout options",
                icon: "🎨",
              },
              {
                title: "Accessibility",
                description: "Built with accessibility in mind for all users",
                icon: "♿",
              },
            ].map((feature) => (
              <Card
                key={feature.title}
                className="border hover:border-primary/50 transition-colors"
              >
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{feature.icon}</span>
                    <CardTitle>{feature.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Tech Stack */}
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="text-2xl">Technology Stack</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
                {[
                  "Next.js",
                  "TypeScript",
                  "Tailwind CSS",
                  "shadcn/ui",
                  "React",
                  "Node.js",
                ].map((tech) => (
                  <Badge
                    key={tech}
                    variant="secondary"
                    className="justify-center py-2 px-4"
                  >
                    {tech}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Contact Section */}
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="text-2xl">Connect With Us</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center gap-6">
                <div className="flex gap-4">
                  <Link
                    href={"https://www.linkedin.com/in/i-am-le-van-son/"}
                    target="_blank"
                    rel="noopener noreferrer"
                    passHref
                  >
                    <Button variant="outline" size="lg">
                      <Linkedin className="mr-2 h-5 w-5" />
                      LinkedIn
                    </Button>
                  </Link>
                  <Link
                    href={"mailto:sonlvs1507@gmail.com"}
                    target="_blank"
                    rel="noopener noreferrer"
                    passHref
                  >
                    <Button variant="outline" size="lg">
                      <Mail className="mr-2 h-5 w-5" />
                      Contact
                    </Button>
                  </Link>
                </div>
                <p className="text-sm text-muted-foreground">
                  Email: sonlvs1507@gmail.com
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <footer className="mt-16 text-center space-y-4 pb-8">
          <Separator />
          <div className="text-sm text-muted-foreground">
            <p>© 2024 Reading App. All rights reserved.</p>
            <p>Made with ❤️ using React</p>
          </div>
        </footer>
      </div>
    </div>
  );
}