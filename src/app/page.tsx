"use client";

import { useState } from "react";
import {
  Frown,
  Loader2,
  Meh,
  Smile,
  HeartPulse,
  BrainCircuit,
  BatteryCharging,
  Bot,
  User,
  Sparkles,
  Send,
} from "lucide-react";
import { getAdviceForMood, getExpenseAdvice } from "./actions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

const moods = [
  { name: "Happy", icon: <Smile className="h-8 w-8" />, value: "happy" },
  { name: "Sad", icon: <Frown className="h-8 w-8" />, value: "sad" },
  { name: "Neutral", icon: <Meh className="h-8 w-8" />, value: "neutral" },
  { name: "Stressed", icon: <HeartPulse className="h-8 w-8" />, value: "stressed" },
  { name: "Anxious", icon: <BrainCircuit className="h-8 w-8" />, value: "anxious" },
  { name: "Tired", icon: <BatteryCharging className="h-8 w-8" />, value: "tired" },
] as const;

type Mood = (typeof moods)[number]["value"];

export default function Home() {
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null);
  const [advice, setAdvice] = useState<string | null>(null);
  const [isAdviceLoading, setIsAdviceLoading] = useState(false);
  const [isDialogOpwn, setIsDialogOpen] = useState(false);

  const [chatHistory, setChatHistory] = useState<
    { role: "user" | "model"; content: string }[]
  >([]);
  const [expenseQuery, setExpenseQuery] = useState("");
  const [isChatLoading, setIsChatLoading] = useState(false);

  const handleMoodClick = async (mood: Mood) => {
    setSelectedMood(mood);
    setIsAdviceLoading(true);
    setIsDialogOpen(true);
    try {
      const result = await getAdviceForMood(mood);
      setAdvice(result.advice);
    } catch (error) {
      setAdvice("Sorry, I couldn't get advice for you right now.");
      console.error(error);
    } finally {
      setIsAdviceLoading(false);
    }
  };

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!expenseQuery.trim()) return;

    const newHistory = [...chatHistory, { role: "user" as const, content: expenseQuery }];
    setChatHistory(newHistory);
    setExpenseQuery("");
    setIsChatLoading(true);

    try {
      const result = await getExpenseAdvice(newHistory);
      setChatHistory([...newHistory, { role: "model", content: result.advice }]);
    } catch (error) {
      setChatHistory([
        ...newHistory,
        {
          role: "model",
          content: "Sorry, I couldn't process your request. Please try again.",
        },
      ]);
      console.error(error);
    } finally {
      setIsChatLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-background text-foreground p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-4xl space-y-12">
        <Card className="bg-card/50 border-primary/20">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">
              How are you feeling today?
            </CardTitle>
            <CardDescription>
              Select a mood to get some financial advice.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {moods.map((mood) => (
                <button
                  key={mood.value}
                  onClick={() => handleMoodClick(mood.value)}
                  className="flex flex-col items-center justify-center gap-2 p-6 rounded-lg bg-background hover:bg-primary/10 transition-colors border border-transparent hover:border-primary/50"
                >
                  {mood.icon}
                  <span className="font-medium">{mood.name}</span>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl font-bold">
              <Sparkles className="text-primary" />
              Your AI-Powered Financial Advice
            </CardTitle>
            <CardDescription>
              Welcome to EmotionWise! Let me know about your expenses, and I'll offer some financial insights just for you.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="h-80 overflow-y-auto p-4 border rounded-md bg-background space-y-4">
                {chatHistory.length === 0 ? (
                   <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                    <Bot className="h-12 w-12 mb-4" />
                    <p className="text-center">Ask me anything about your expenses!</p>
                    <p className="text-center text-sm">e.g., "I spent $50 on coffee this week, is that too much?"</p>
                  </div>
                ) : (
                  chatHistory.map((chat, index) => (
                    <div
                      key={index}
                      className={`flex gap-3 ${
                        chat.role === "user" ? "justify-end" : "justify-start"
                      }`}
                    >
                      {chat.role === "model" && (
                        <div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                          <Bot className="h-5 w-5 text-primary-foreground" />
                        </div>
                      )}
                      <div
                        className={`max-w-[80%] rounded-lg px-4 py-2 ${
                          chat.role === "user"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted"
                        }`}
                      >
                        <p>{chat.content}</p>
                      </div>
                      {chat.role === "user" && (
                         <div className="flex-shrink-0 h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                          <User className="h-5 w-5 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                  ))
                )}
                {isChatLoading && (
                  <div className="flex justify-start gap-3">
                    <div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                      <Bot className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <div className="bg-muted rounded-lg px-4 py-2">
                       <Loader2 className="h-5 w-5 animate-spin" />
                    </div>
                  </div>
                )}
              </div>
              <form onSubmit={handleChatSubmit} className="flex gap-2">
                <Input
                  value={expenseQuery}
                  onChange={(e) => setExpenseQuery(e.target.value)}
                  placeholder="Ask about your expenses..."
                  className="flex-grow"
                  disabled={isChatLoading}
                />
                <Button type="submit" disabled={isChatLoading || !expenseQuery.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={isDialogOpwn} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Your Financial Advice</DialogTitle>
            <DialogDescription>
              Based on your mood of{" "}
              <span className="font-bold text-primary">{selectedMood}</span>,
              here's a tip for you.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {isAdviceLoading ? (
              <div className="flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <p>{advice}</p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </main>
  );
}
