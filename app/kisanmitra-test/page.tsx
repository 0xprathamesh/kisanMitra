"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Loader2, Send, TestTube } from "lucide-react";

export default function KisanMitraTestPage() {
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [language, setLanguage] = useState("en");
  const [context, setContext] = useState({
    location: "",
    cropType: "",
    season: "",
  });

  const testMessages = [
    "What are today's cotton rates in Maharashtra?",
    "कापूस दर काय आहे?",
    "How to control pests in cotton field?",
    "What government schemes are available for farmers?",
    "Best crops to plant this season",
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isLoading) return;

    setIsLoading(true);
    setResponse("");

    try {
      const res = await fetch("/api/kisanmitra", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: message.trim(),
          language,
          context: Object.values(context).some(v => v) ? context : undefined,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setResponse(data.data.response);
      } else {
        setResponse(`Error: ${data.error}`);
      }
    } catch (error) {
      setResponse(`Network error: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickTest = (testMessage: string) => {
    setMessage(testMessage);
    setTimeout(() => {
      const syntheticEvent = { preventDefault: () => {} } as React.FormEvent;
      handleSubmit(syntheticEvent);
    }, 100);
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2">
            <TestTube className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold">KisanMitra API Test</h1>
          </div>
          <p className="text-muted-foreground">
            Test the production-ready KisanMitra chatbot API
          </p>
        </div>

        {/* Test Controls */}
        <Card className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Language</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full p-2 border rounded-md"
              >
                <option value="en">English</option>
                <option value="mr">Marathi</option>
                <option value="hi">Hindi</option>
                <option value="bn">Bengali</option>
                <option value="te">Telugu</option>
                <option value="ta">Tamil</option>
                <option value="gu">Gujarati</option>
                <option value="kn">Kannada</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Location</label>
              <Input
                placeholder="e.g., Maharashtra"
                value={context.location}
                onChange={(e) => setContext(prev => ({ ...prev, location: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Crop Type</label>
              <Input
                placeholder="e.g., Cotton"
                value={context.cropType}
                onChange={(e) => setContext(prev => ({ ...prev, cropType: e.target.value }))}
              />
            </div>
          </div>
        </Card>

        {/* Quick Test Buttons */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Quick Test Messages</h3>
          <div className="flex flex-wrap gap-2">
            {testMessages.map((testMsg, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => handleQuickTest(testMsg)}
                disabled={isLoading}
              >
                {testMsg.length > 30 ? testMsg.substring(0, 30) + "..." : testMsg}
              </Button>
            ))}
          </div>
        </Card>

        {/* Chat Interface */}
        <Card className="p-6 space-y-4">
          <h3 className="text-lg font-semibold">Test Chat</h3>
          
          <form onSubmit={handleSubmit} className="flex gap-3">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ask KisanMitra anything about farming..."
              disabled={isLoading}
              className="flex-1"
            />
            <Button type="submit" disabled={!message.trim() || isLoading}>
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </form>

          {/* Response Display */}
          {response && (
            <div className="mt-4 p-4 bg-muted rounded-lg">
              <h4 className="font-medium mb-2">Response:</h4>
              <div className="whitespace-pre-wrap text-sm">{response}</div>
            </div>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="mt-4 p-4 bg-muted rounded-lg">
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>KisanMitra is thinking...</span>
              </div>
            </div>
          )}
        </Card>

        {/* API Info */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">API Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-medium text-green-600">✅ Production Ready</h4>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>Rate limiting (10 req/min)</li>
                <li>Input validation with Zod</li>
                <li>Security middleware</li>
                <li>Error handling</li>
                <li>Token optimization</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-blue-600">🚀 Real-time Capabilities</h4>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>Market data detection</li>
                <li>Cotton rates & prices</li>
                <li>Multi-language support</li>
                <li>Context-aware responses</li>
                <li>Fast GPT-4o-mini model</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
} 