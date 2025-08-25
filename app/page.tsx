"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  MessageCircle,
  Globe,
  Sprout,
  Users,
  TrendingUp,
  Shield,
  ChevronRight,
  Menu,
  X,
  TestTube,
} from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/hooks/use-language";
import { LanguageSelector } from "@/components/language-selector";

const features = [
  {
    icon: MessageCircle,
    titleKey: "realTimeChat" as const,
    descriptionKey: "realTimeChatDesc" as const,
  },
  {
    icon: Globe,
    titleKey: "multiLanguage" as const,
    descriptionKey: "multiLanguageDesc" as const,
  },
  {
    icon: Sprout,
    titleKey: "cropGuidance" as const,
    descriptionKey: "cropGuidanceDesc" as const,
  },
  {
    icon: TrendingUp,
    titleKey: "marketInsights" as const,
    descriptionKey: "marketInsightsDesc" as const,
  },
  {
    icon: Shield,
    titleKey: "pestControl" as const,
    descriptionKey: "pestControlDesc" as const,
  },
  {
    icon: Users,
    titleKey: "communitySupport" as const,
    descriptionKey: "communitySupportDesc" as const,
  },
];

export default function HomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Sprout className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground font-sans">
                  {t("title")}
                </h1>
                <p className="text-xs text-muted-foreground">{t("subtitle")}</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              <Link
                href="#features"
                className="text-foreground hover:text-primary transition-colors"
              >
                {t("features")}
              </Link>
              <LanguageSelector />
              <Button asChild>
                <Link href="/chat">{t("startChat")}</Link>
              </Button>
            </nav>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-4 pb-4 border-t border-border pt-4">
              <nav className="flex flex-col space-y-4">
                <Link
                  href="#features"
                  className="text-foreground hover:text-primary transition-colors"
                >
                  {t("features")}
                </Link>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    {t("selectLanguage")}
                  </label>
                  <LanguageSelector variant="outline" />
                </div>
                <Button asChild className="w-full">
                  <Link href="/chat">{t("startChat")}</Link>
                </Button>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <Badge variant="secondary" className="mb-6">
            <Globe className="w-4 h-4 mr-2" />
            Available in 8+ Indian Languages
          </Badge>

          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 font-sans leading-tight">
            {t("hero")}
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed max-w-3xl mx-auto">
            {t("heroDesc")}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" asChild className="text-lg px-8 py-6">
              <Link href="/chat">
                {t("startChat")}
                <ChevronRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="text-lg px-8 py-6 bg-transparent"
              asChild
            >
              <Link href="/kisanmitra-test">
                <TestTube className="w-4 h-4 mr-2" />
                Test API
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 font-sans">
              {t("features")}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t("featuresDesc")}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="border-border hover:shadow-lg transition-shadow"
              >
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl font-semibold font-sans">
                    {t(feature.titleKey)}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed">
                    {t(feature.descriptionKey)}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <div className="bg-primary/5 rounded-2xl p-12 border border-primary/10">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 font-sans">
              {t("getStarted")}
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              {t("getStartedDesc")}
            </p>
            <Button size="lg" asChild className="text-lg px-8 py-6">
              <Link href="/chat">
                {t("startChat")}
                <MessageCircle className="w-5 h-5 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 px-4">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Sprout className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold font-sans">{t("title")}</span>
          </div>
          <p className="text-muted-foreground">
            Empowering Indian farmers with KisanMitra AI technology
          </p>
        </div>
      </footer>
    </div>
  );
}
