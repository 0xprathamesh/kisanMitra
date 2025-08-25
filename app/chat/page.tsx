"use client";

import type React from "react";
import { useRef, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Send,
  ArrowLeft,
  Sprout,
  User,
  Loader2,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/hooks/use-language";
import { LanguageSelector } from "@/components/language-selector";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt?: Date;
}

export default function ChatPage() {
  const { t, language } = useLanguage();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        language === "mr"
          ? "नमस्कार! मी KisanMitra आहे, तुमचा कृषी सल्लागार. मी तुम्हाला शेती, पिके, बाजार किंमती, सरकारी योजना आणि इतर कृषी विषयांवर मदत करू शकतो. तुम्हाला काय माहिती हवे आहे?"
          : language === "hi"
          ? "नमस्ते! मैं KisanMitra हूं, आपका कृषि सलाहकार। मैं आपकी खेती, फसलों, बाजार कीमतों, सरकारी योजनाओं और अन्य कृषि विषयों पर मदद कर सकता हूं। आपको क्या जानकारी चाहिए?"
          : "Hello! I'm KisanMitra, your agricultural advisor. I can help you with farming, crops, market prices, government schemes, and other agricultural topics. What information do you need?",
      createdAt: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      createdAt: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((m) => ({
            role: m.role,
            content: m.content,
          })),
          language,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response");
      }

      // Parse the JSON response
      const data = await response.json();

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.content || "Sorry, I couldn't generate a response.",
        createdAt: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      setError("Failed to get response. Please try again.");
      console.error("Chat error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as any);
    }
  };

  const handleQuickSuggestion = (suggestion: string) => {
    setInput(suggestion);
    setTimeout(() => {
      const syntheticEvent = { preventDefault: () => {} } as React.FormEvent;
      handleSubmit(syntheticEvent);
    }, 100);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Link>
              </Button>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Sprout className="w-5 h-5 text-primary-foreground" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-foreground font-sans">
                    {t("chatTitle")}
                  </h1>
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        error ? "bg-red-500" : "bg-green-500"
                      }`}
                    />
                    <p className="text-xs text-muted-foreground">
                      {error ? "Connection Error" : "AI Assistant Online"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <LanguageSelector variant="ghost" size="sm" />
          </div>
        </div>
      </header>

      {/* Chat Messages */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto px-4 py-6">
          <div className="container mx-auto max-w-4xl space-y-6">
            {error && (
              <Card className="bg-red-50 border-red-200 p-4">
                <div className="flex items-center gap-2 text-red-700">
                  <AlertCircle className="w-4 h-4" />
                  <p className="text-sm">Connection error. Please try again.</p>
                </div>
              </Card>
            )}

            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {message.role === "assistant" && (
                  <Avatar className="w-8 h-8 bg-primary">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      <Sprout className="w-4 h-4" />
                    </AvatarFallback>
                  </Avatar>
                )}

                <Card
                  className={`max-w-[80%] md:max-w-[60%] p-4 ${
                    message.role === "user"
                      ? "bg-primary text-primary-foreground ml-auto"
                      : "bg-card border-border"
                  }`}
                >
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">
                    {message.content}
                    {message.role === "assistant" &&
                      isLoading &&
                      message === messages[messages.length - 1] && (
                        <span className="inline-block w-2 h-4 bg-current animate-pulse ml-1" />
                      )}
                  </p>
                  <p
                    className={`text-xs mt-2 ${
                      message.role === "user"
                        ? "text-primary-foreground/70"
                        : "text-muted-foreground"
                    }`}
                  >
                    {message.createdAt
                      ? new Date(message.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "Now"}
                  </p>
                </Card>

                {message.role === "user" && (
                  <Avatar className="w-8 h-8 bg-secondary">
                    <AvatarFallback className="bg-secondary text-secondary-foreground">
                      <User className="w-4 h-4" />
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-3 justify-start">
                <Avatar className="w-8 h-8 bg-primary">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    <Sprout className="w-4 h-4" />
                  </AvatarFallback>
                </Avatar>
                <Card className="bg-card border-border p-4">
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-primary" />
                    <p className="text-sm text-muted-foreground">
                      {t("typing")}
                    </p>
                    <div className="flex gap-1">
                      <div
                        className="w-1 h-1 bg-primary rounded-full animate-bounce"
                        style={{ animationDelay: "0ms" }}
                      />
                      <div
                        className="w-1 h-1 bg-primary rounded-full animate-bounce"
                        style={{ animationDelay: "150ms" }}
                      />
                      <div
                        className="w-1 h-1 bg-primary rounded-full animate-bounce"
                        style={{ animationDelay: "300ms" }}
                      />
                    </div>
                  </div>
                </Card>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>

      {/* Input Area */}
      <div className="border-t border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto max-w-4xl px-4 py-4">
          <form onSubmit={handleSubmit} className="flex gap-3 items-end">
            <div className="flex-1">
              <Input
                ref={inputRef}
                value={input}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                placeholder={t("chatPlaceholder")}
                disabled={isLoading}
                className="min-h-[44px] resize-none bg-background border-border focus:ring-primary"
              />
            </div>
            <Button
              type="submit"
              disabled={!input.trim() || isLoading}
              size="lg"
              className="h-[44px] px-4"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              <span className="sr-only">{t("send")}</span>
            </Button>
          </form>

          <div className="mt-3 flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                handleQuickSuggestion(
                  "What are today's cotton rates in Maharashtra?"
                )
              }
              disabled={isLoading}
              className="text-xs"
            >
              Cotton rates
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                handleQuickSuggestion("What crops should I plant this season?")
              }
              disabled={isLoading}
              className="text-xs"
            >
              Crop recommendations
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                handleQuickSuggestion("How do I control pests in my field?")
              }
              disabled={isLoading}
              className="text-xs"
            >
              Pest control
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                handleQuickSuggestion("What are today's market prices?")
              }
              disabled={isLoading}
              className="text-xs"
            >
              Market prices
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                handleQuickSuggestion("How to improve soil health?")
              }
              disabled={isLoading}
              className="text-xs"
            >
              Soil management
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                handleQuickSuggestion(
                  "What government schemes are available for farmers?"
                )
              }
              disabled={isLoading}
              className="text-xs"
            >
              Govt schemes
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                handleQuickSuggestion(
                  "How to get agricultural loans and insurance?"
                )
              }
              disabled={isLoading}
              className="text-xs"
            >
              Loans & insurance
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
