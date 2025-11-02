"use client";

import { useState, useEffect } from "react";
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
  Trash2,
  PlusCircle,
  TrendingUp,
  Lightbulb,
} from "lucide-react";
import { getAdviceForMood, getExpenseAdvice } from "./actions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { initialTransactions, type Transaction } from "@/lib/transactions";
import { MoodChart } from "@/components/mood-chart";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Label } from "@/components/ui/label";

const moods = [
  { name: "Happy", icon: <Smile className="h-8 w-8" />, value: "happy" },
  { name: "Sad", icon: <Frown className="h-8 w-8" />, value: "sad" },
  { name: "Neutral", icon: <Meh className="h-8 w-8" />, value: "neutral" },
  { name: "Stressed", icon: <HeartPulse className="h-8 w-8" />, value: "stressed" },
  { name: "Anxious", icon: <BrainCircuit className="h-8 w-8" />, value: "anxious" },
  { name: "Tired", icon: <BatteryCharging className="h-8 w-8" />, value: "tired" },
] as const;

type Mood = (typeof moods)[number]["value"];

const transactionSchema = z.object({
  category: z.string().min(1, "Category is required"),
  amount: z.coerce.number().min(1, "Amount must be greater than 0"),
  mood: z.enum(["happy", "sad", "neutral", "stressed", "anxious", "tired"]),
});

type TransactionFormData = z.infer<typeof transactionSchema>;

export default function Home() {
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null);
  const [advice, setAdvice] = useState<string | null>(null);
  const [isAdviceLoading, setIsAdviceLoading] = useState(false);

  const [chatHistory, setChatHistory] = useState<
    { role: "user" | "model"; content: string }[]
  >([]);
  const [expenseQuery, setExpenseQuery] = useState("");
  const [isChatLoading, setIsChatLoading] = useState(false);

  const [transactions, setTransactions] =
    useState<Transaction[]>(initialTransactions);
  const [isAddTransactionOpen, setAddTransactionOpen] = useState(false);

  const [dailyAdvice, setDailyAdvice] = useState<string | null>(null);
  const [isDailyAdviceLoading, setIsDailyAdviceLoading] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TransactionFormData>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      category: "",
      amount: 0,
      mood: "neutral",
    },
  });

  useEffect(() => {
    const fetchDailyAdvice = async () => {
      setIsDailyAdviceLoading(true);
      try {
        const randomMood = moods[Math.floor(Math.random() * moods.length)].value;
        const result = await getAdviceForMood(randomMood);
        setDailyAdvice(result.advice);
      } catch (error) {
        setDailyAdvice("Could not fetch advice. Please try again later.");
        console.error(error);
      } finally {
        setIsDailyAdviceLoading(false);
      }
    };
    fetchDailyAdvice();
  }, []);

  const handleMoodClick = async (mood: Mood) => {
    if (selectedMood === mood) {
      setSelectedMood(null);
      setAdvice(null);
      return;
    }
    setSelectedMood(mood);
    setAdvice(null);
    setIsAdviceLoading(true);
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

    const newHistory = [
      ...chatHistory,
      { role: "user" as const, content: expenseQuery },
    ];
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

  const handleDeleteTransaction = (id: string) => {
    setTransactions(transactions.filter((t) => t.id !== id));
  };

  const handleAddTransaction = (data: TransactionFormData) => {
    const newTransaction: Transaction = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString("en-US", {
        month: "2-digit",
        day: "2-digit",
        year: "numeric",
      }),
      timeOfDay: new Date()
        .toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
        .includes("AM")
        ? "Morning"
        : "Afternoon",
      mood: data.mood,
      category: data.category,
      amount: data.amount,
      recommendation: "New transaction added.",
    };
    setTransactions([newTransaction, ...transactions]);
    reset();
    setAddTransactionOpen(false);
  };
  
  const moodSpendingData = moods.map(mood => {
    const totalSpending = transactions
      .filter(t => (t.mood.toLowerCase() as Mood) === mood.value)
      .reduce((acc, t) => acc + t.amount, 0);
    return {
      mood: mood.name,
      spending: totalSpending,
      fill: `var(--color-${mood.value})`
    };
  }).filter(item => item.spending > 0);


  return (
    <main className="min-h-screen bg-background text-foreground p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-12">
        <Card className="bg-card/50 border-primary/20">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">
              How are you feeling today?
            </CardTitle>
            <CardDescription>
              Select a mood to get a financial tip.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {moods.map((mood) => (
                <div key={mood.value}>
                  <button
                    onClick={() => handleMoodClick(mood.value)}
                    className={`flex flex-col items-center justify-center gap-2 p-6 rounded-lg w-full bg-background hover:bg-primary/10 transition-colors border border-transparent hover:border-primary/50 ${
                      selectedMood === mood.value ? 'bg-primary/10 border-primary/50' : ''
                    }`}
                  >
                    {mood.icon}
                    <span className="font-medium">{mood.name}</span>
                  </button>
                </div>
              ))}
            </div>
             {selectedMood && (
                <div className="mt-4 p-4 rounded-lg bg-muted border border-border">
                  {isAdviceLoading ? (
                     <div className="flex items-center justify-center">
                      <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    </div>
                  ) : (
                    <p className="text-center">{advice}</p>
                  )}
                </div>
              )}
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
                <Card className="bg-card/50 border-primary/20 h-full">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle className="flex items-center gap-2 text-2xl font-bold">
                                <TrendingUp className="text-primary" />
                                Recent Transactions
                            </CardTitle>
                            <CardDescription>
                                Your recent spending activity.
                            </CardDescription>
                        </div>
                        <Dialog open={isAddTransactionOpen} onOpenChange={setAddTransactionOpen}>
                            <DialogTrigger asChild>
                                <Button size="sm"><PlusCircle className="mr-2 h-4 w-4" /> Add</Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Add New Transaction</DialogTitle>
                                </DialogHeader>
                                <form onSubmit={handleSubmit(handleAddTransaction)} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="category">Category</Label>
                                        <Controller
                                            name="category"
                                            control={control}
                                            render={({ field }) => <Input id="category" {...field} />}
                                        />
                                        {errors.category && <p className="text-destructive text-sm">{errors.category.message}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="amount">Amount (INR)</Label>
                                        <Controller
                                            name="amount"
                                            control={control}
                                            render={({ field }) => <Input id="amount" type="number" {...field} />}
                                        />
                                        {errors.amount && <p className="text-destructive text-sm">{errors.amount.message}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="mood">Mood</Label>
                                        <Controller
                                            name="mood"
                                            control={control}
                                            render={({ field }) => (
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <SelectTrigger id="mood">
                                                        <SelectValue placeholder="Select mood" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {moods.map(mood => (
                                                            <SelectItem key={mood.value} value={mood.value}>{mood.name}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            )}
                                        />
                                        {errors.mood && <p className="text-destructive text-sm">{errors.mood.message}</p>}
                                    </div>
                                    <DialogFooter>
                                        <DialogClose asChild>
                                            <Button type="button" variant="outline">Cancel</Button>
                                        </DialogClose>
                                        <Button type="submit">Add Transaction</Button>
                                    </DialogFooter>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </CardHeader>
                    <CardContent>
                        <ScrollArea className="h-96">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Category</TableHead>
                                        <TableHead>Mood</TableHead>
                                        <TableHead className="text-right">Amount</TableHead>
                                        <TableHead className="text-right">Action</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {transactions.map((transaction) => (
                                        <TableRow key={transaction.id}>
                                            <TableCell>{transaction.date}</TableCell>
                                            <TableCell>{transaction.category}</TableCell>
                                            <TableCell><span className="capitalize">{transaction.mood}</span></TableCell>
                                            <TableCell className="text-right">₹{transaction.amount.toLocaleString()}</TableCell>
                                            <TableCell className="text-right">
                                                <Button variant="ghost" size="icon" onClick={() => handleDeleteTransaction(transaction.id)}>
                                                    <Trash2 className="h-4 w-4 text-destructive" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </ScrollArea>
                    </CardContent>
                </Card>
            </div>
             <div className="grid grid-cols-1 gap-8">
                 <Card className="bg-card/50 border-primary/20">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-2xl font-bold">
                            <Lightbulb className="text-primary" />
                            Financial Tip of the Day
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {isDailyAdviceLoading ? (
                             <div className="flex items-center justify-center">
                                <Loader2 className="h-6 w-6 animate-spin text-primary" />
                            </div>
                        ) : (
                            <p>{dailyAdvice}</p>
                        )}
                    </CardContent>
                </Card>
                <Card className="bg-card/50 border-primary/20">
                  <CardHeader>
                    <CardTitle className="text-2xl font-bold">Mood Spending</CardTitle>
                    <CardDescription>Spending breakdown by mood.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <MoodChart data={moodSpendingData} />
                  </CardContent>
                </Card>
            </div>
        </div>

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
    </main>
  );
}
