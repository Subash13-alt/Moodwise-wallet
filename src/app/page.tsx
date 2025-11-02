"use client";

import { useState, useEffect, useRef } from "react";
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
  CalendarIcon,
  Camera,
  Upload,
  FileText,
  Landmark,
  ShoppingCart,
  Tag,
} from "lucide-react";
import { getAdviceForMood, getExpenseAdvice, getMoodFromImageInput, getMoodFromTextInput, getExpenseSummaryAction } from "./actions";
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
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

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
  date: z.date({ required_error: "Date is required." }),
});

type TransactionFormData = z.infer<typeof transactionSchema>;

type ExpenseSummary = {
    summary: string;
    totalSpent: number;
    transactionCount: number;
    topCategory: string;
}

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
  
  const [textInput, setTextInput] = useState('');
  const [isTextMoodLoading, setIsTextMoodLoading] = useState(false);
  const [isCameraMoodLoading, setIsCameraMoodLoading] = useState(false);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | undefined>(undefined);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const [expenseSummary, setExpenseSummary] = useState<ExpenseSummary | null>(null);
  const [isSummaryLoading, setIsSummaryLoading] = useState(false);


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
      date: new Date(),
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

  const getExpenseSummary = async () => {
    setIsSummaryLoading(true);
    try {
      const result = await getExpenseSummaryAction({ transactions });
      setExpenseSummary(result);
    } catch (error) {
      setExpenseSummary(null);
      console.error(error);
      toast({
        variant: "destructive",
        title: "Summary Failed",
        description: "Could not generate expense summary.",
      });
    } finally {
      setIsSummaryLoading(false);
    }
  };

  useEffect(() => {
    getExpenseSummary();
  }, [transactions]);


  const handleGetCameraPermission = async () => {
    if (hasCameraPermission) {
      processImageFromCamera();
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setHasCameraPermission(true);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      setHasCameraPermission(false);
      toast({
        variant: "destructive",
        title: "Camera Access Denied",
        description: "Please enable camera permissions in your browser settings.",
      });
    }
  };

  const processImageFromCamera = () => {
    if (videoRef.current) {
      setIsCameraMoodLoading(true);
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const context = canvas.getContext("2d");
      if (context) {
        context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const dataUri = canvas.toDataURL("image/jpeg");
        handleMoodFromImage(dataUri);
      } else {
        setIsCameraMoodLoading(false);
      }
    }
  };

  const handleMoodFromImage = async (photoDataUri: string) => {
    try {
      const result = await getMoodFromImageInput(photoDataUri);
      handleMoodClick(result.mood as Mood, true);
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Mood Detection Failed",
        description: "Could not detect mood from the image.",
      });
    } finally {
      setIsCameraMoodLoading(false);
      // Turn off the camera
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
        videoRef.current.srcObject = null;
        setHasCameraPermission(undefined);
      }
    }
  };

  const handleTextMoodSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!textInput.trim()) return;
    setIsTextMoodLoading(true);
    try {
      const result = await getMoodFromTextInput(textInput);
      handleMoodClick(result.mood as Mood, true);
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Mood Detection Failed",
        description: "Could not detect mood from your text.",
      });
    } finally {
      setIsTextMoodLoading(false);
    }
  };

  const handleMoodClick = async (mood: Mood, force = false) => {
    if (selectedMood === mood && !force) {
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
      date: format(data.date, "MM/dd/yyyy"),
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
  
    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      try {
        const lines = text.split('\n').filter(line => line.trim() !== '');
        const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
        const requiredHeaders = ['date', 'category', 'amount', 'mood'];
        if (!requiredHeaders.every(h => headers.includes(h))) {
          throw new Error('CSV must include date, category, amount, and mood headers.');
        }

        const newTransactions: Transaction[] = lines.slice(1).map((line, index) => {
          const values = line.split(',');
          const transactionData: any = {};
          headers.forEach((header, i) => {
            transactionData[header] = values[i].trim();
          });
          
          const moodValue = transactionData.mood.toLowerCase();
          if (!moods.some(m => m.value === moodValue)) {
            throw new Error(`Invalid mood "${transactionData.mood}" on row ${index + 2}.`);
          }

          return {
            id: `csv-${Date.now()}-${index}`,
            date: format(new Date(transactionData.date), "MM/dd/yyyy"),
            category: transactionData.category,
            amount: parseFloat(transactionData.amount),
            mood: moodValue,
            timeOfDay: new Date(transactionData.date).getHours() < 12 ? "Morning" : "Afternoon",
            recommendation: "Imported from CSV.",
          };
        });

        setTransactions(prev => [...newTransactions, ...prev]);
        toast({
          title: "Import Successful",
          description: `${newTransactions.length} transactions have been imported.`,
        });
      } catch (error: any) {
        toast({
          variant: "destructive",
          title: "CSV Import Failed",
          description: error.message || "Please check the file format and try again.",
        });
      }
    };
    reader.readAsText(file);
    // Reset file input
    if(fileInputRef.current) {
        fileInputRef.current.value = "";
    }
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
              Select a mood to get a financial tip, or let us detect it for you.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {moods.map((mood) => (
                <div key={mood.value}>
                  <button
                    onClick={() => handleMoodClick(mood.value)}
                    className={cn(
                      'flex flex-col items-center justify-center gap-2 p-6 rounded-lg w-full bg-background hover:bg-primary/10 transition-colors border border-transparent hover:border-primary/50',
                      selectedMood === mood.value ? 'bg-primary/10 border-primary/50' : ''
                    )}
                  >
                    {mood.icon}
                    <span className="font-medium">{mood.name}</span>
                  </button>
                </div>
              ))}
            </div>
            
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <form onSubmit={handleTextMoodSubmit} className="space-y-2">
                <Textarea 
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  placeholder="How was your day..."
                  disabled={isTextMoodLoading}
                />
                <Button type="submit" disabled={isTextMoodLoading || !textInput.trim()} className="w-full">
                  {isTextMoodLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Get Mood From Text
                </Button>
              </form>

              <div className="space-y-2">
                {hasCameraPermission === undefined && (
                  <Button onClick={handleGetCameraPermission} disabled={isCameraMoodLoading} className="w-full">
                    {isCameraMoodLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Camera className="mr-2 h-4 w-4" />}
                    Enable Camera to Detect Mood
                  </Button>
                )}

                {hasCameraPermission === true && (
                  <>
                    <video ref={videoRef} className="w-full aspect-video rounded-md bg-muted" autoPlay muted />
                    <Button onClick={processImageFromCamera} disabled={isCameraMoodLoading} className="w-full">
                        {isCameraMoodLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Detect Mood From Camera
                    </Button>
                  </>
                )}

                {hasCameraPermission === false && (
                    <Alert variant="destructive">
                        <AlertTitle>Camera Access Required</AlertTitle>
                        <AlertDescription>
                          Please allow camera access to use this feature. You may need to reset permissions in your browser settings.
                        </AlertDescription>
                    </Alert>
                )}
              </div>
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
                        <div className="flex gap-2">
                            <Input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileUpload}
                                accept=".csv"
                                className="hidden"
                            />
                            <Button size="sm" variant="outline" onClick={() => fileInputRef.current?.click()}>
                                <Upload className="mr-2 h-4 w-4" /> Import CSV
                            </Button>
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
                                            <Label htmlFor="amount">Amount (₹)</Label>
                                            <Controller
                                                name="amount"
                                                control={control}
                                                render={({ field }) => <Input id="amount" type="number" {...field} />}
                                            />
                                            {errors.amount && <p className="text-destructive text-sm">{errors.amount.message}</p>}
                                        </div>
                                        <div className="space-y-2">
                                        <Label htmlFor="date">Date</Label>
                                        <Controller
                                            name="date"
                                            control={control}
                                            render={({ field }) => (
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                <Button
                                                    variant={"outline"}
                                                    className={cn(
                                                    "w-full justify-start text-left font-normal",
                                                    !field.value && "text-muted-foreground"
                                                    )}
                                                >
                                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                                    {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                                </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0">
                                                <Calendar
                                                    mode="single"
                                                    selected={field.value}
                                                    onSelect={field.onChange}
                                                    initialFocus
                                                />
                                                </PopoverContent>
                                            </Popover>
                                            )}
                                        />
                                        {errors.date && <p className="text-destructive text-sm">{errors.date.message}</p>}
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
                        </div>
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
                        <CardTitle className="flex items-center gap-2 text-2xl font-bold">
                        <FileText className="text-primary" />
                        Spending Summary
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {isSummaryLoading ? (
                            <div className="flex items-center justify-center">
                                <Loader2 className="h-6 w-6 animate-spin text-primary" />
                            </div>
                        ) : expenseSummary ? (
                            <div className="space-y-4">
                                <div className="grid grid-cols-3 gap-4 text-center">
                                    <div>
                                        <Card className="bg-muted/50 p-4">
                                            <CardHeader className="p-0 items-center">
                                                <Landmark className="h-6 w-6 text-primary mb-2"/>
                                                <CardDescription>Total Spent</CardDescription>
                                            </CardHeader>
                                            <CardContent className="p-0">
                                                <p className="text-2xl font-bold">₹{expenseSummary.totalSpent.toLocaleString()}</p>
                                            </CardContent>
                                        </Card>
                                    </div>
                                    <div>
                                         <Card className="bg-muted/50 p-4">
                                            <CardHeader className="p-0 items-center">
                                                <ShoppingCart className="h-6 w-6 text-primary mb-2"/>
                                                <CardDescription>Transactions</CardDescription>
                                            </CardHeader>
                                            <CardContent className="p-0">
                                                <p className="text-2xl font-bold">{expenseSummary.transactionCount}</p>
                                            </CardContent>
                                        </Card>
                                    </div>
                                    <div>
                                         <Card className="bg-muted/50 p-4">
                                            <CardHeader className="p-0 items-center">
                                                <Tag className="h-6 w-6 text-primary mb-2"/>
                                                <CardDescription>Top Category</CardDescription>
                                            </CardHeader>
                                            <CardContent className="p-0">
                                                <p className="text-xl font-bold">{expenseSummary.topCategory}</p>
                                            </CardContent>
                                        </Card>
                                    </div>
                                </div>
                                <p className="text-sm text-muted-foreground">{expenseSummary.summary}</p>
                            </div>
                        ) : (
                            <p className="text-sm">No summary available.</p>
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
                    <p className="text-center text-sm">e.g., "I spent ₹4000 on coffee this week, is that too much?"</p>
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