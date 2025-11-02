"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  Camera,
  Frown,
  Loader2,
  Meh,
  Smile,
  Upload,
  Wallet,
  X,
} from "lucide-react";
import type { Mood } from "./actions";
import {
  getMoodFromTextInput,
  getMoodFromImageInput,
  getAdviceForMood,
} from "./actions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { MoodChart } from "@/components/mood-chart";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Image from "next/image";

const moodIcons: Record<Mood, React.ReactNode> = {
  happy: <Smile className="h-16 w-16 text-green-500" />,
  sad: <Frown className="h-16 w-16 text-blue-500" />,
  neutral: <Meh className="h-16 w-16 text-gray-500" />,
};

const moodChartData = [
  { date: "Mon", spending: 120, mood: "happy" as Mood },
  { date: "Tue", spending: 200, mood: "sad" as Mood },
  { date: "Wed", spending: 150, mood: "neutral" as Mood },
  { date: "Thu", spending: 80, mood: "happy" as Mood },
  { date: "Fri", spending: 250, mood: "sad" as Mood },
  { date: "Sat", spending: 70, mood: "happy" as Mood },
  { date: "Sun", spending: 180, mood: "neutral" as Mood },
];

export default function Home() {
  const [mood, setMood] = useState<Mood | null>(null);
  const [advice, setAdvice] = useState<string | null>(null);
  const [isLoadingMood, setIsLoadingMood] = useState(false);
  const [isLoadingAdvice, setIsLoadingAdvice] = useState(false);
  const [textInput, setTextInput] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleImageFile = useCallback(
    (file: File) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      const dataUriReader = new FileReader();
      dataUriReader.onload = async () => {
        const dataUri = dataUriReader.result as string;
        setIsLoadingMood(true);
        setMood(null);
        setAdvice(null);
        try {
          const result = await getMoodFromImageInput(dataUri);
          setMood(result.mood);
        } catch (error) {
          toast({
            variant: "destructive",
            title: "Error",
            description: "Could not detect mood from image. Please try another.",
          });
          setImagePreview(null);
        } finally {
          setIsLoadingMood(false);
        }
      };
      dataUriReader.readAsDataURL(file);
    },
    [toast]
  );

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageFile(file);
    }
  };

  const handleTextSubmit = async () => {
    if (!textInput.trim()) return;
    setIsLoadingMood(true);
    setMood(null);
    setAdvice(null);
    setImagePreview(null);
    try {
      const result = await getMoodFromTextInput(textInput);
      setMood(result.mood);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not detect mood from text.",
      });
    } finally {
      setIsLoadingMood(false);
    }
  };

  useEffect(() => {
    if (!mood) return;

    const fetchAdvice = async () => {
      setIsLoadingAdvice(true);
      try {
        const result = await getAdviceForMood(mood);
        setAdvice(result.advice);
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Could not fetch financial advice.",
        });
      } finally {
        setIsLoadingAdvice(false);
      }
    };

    fetchAdvice();
  }, [mood, toast]);

  return (
    <main className="min-h-screen bg-background p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 flex items-center gap-3">
          <Wallet className="h-8 w-8 text-primary" />
          <h1 className="font-headline text-3xl font-bold text-primary">
            MoodWise Wallet
          </h1>
        </header>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="font-headline">
                How are you feeling today?
              </CardTitle>
              <CardDescription>
                Detect your mood from text or an image.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="text" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="text">From Text</TabsTrigger>
                  <TabsTrigger value="image">From Image</TabsTrigger>
                </TabsList>
                <TabsContent value="text" className="mt-4">
                  <div className="space-y-4">
                    <Textarea
                      placeholder="I'm feeling great about my recent investment..."
                      value={textInput}
                      onChange={(e) => setTextInput(e.target.value)}
                      className="h-32"
                      disabled={isLoadingMood}
                    />
                    <Button
                      onClick={handleTextSubmit}
                      disabled={isLoadingMood || !textInput.trim()}
                      className="w-full"
                    >
                      {isLoadingMood && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Detect Mood
                    </Button>
                  </div>
                </TabsContent>
                <TabsContent value="image" className="mt-4">
                  <div className="space-y-4">
                    <input
                      type="file"
                      ref={fileInputRef}
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                      disabled={isLoadingMood}
                    />
                    {imagePreview ? (
                      <div className="relative">
                        <Image
                          src={imagePreview}
                          alt="Image preview"
                          width={400}
                          height={300}
                          className="w-full rounded-md object-cover"
                        />
                        <Button
                          variant="destructive"
                          size="icon"
                          className="absolute right-2 top-2 h-7 w-7"
                          onClick={() => {
                            setImagePreview(null);
                            if (fileInputRef.current) {
                              fileInputRef.current.value = "";
                            }
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <div
                        className="flex h-48 w-full cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <Upload className="mb-2 h-8 w-8" />
                        <span>Click to upload image</span>
                      </div>
                    )}
                    <Button
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full"
                      disabled={isLoadingMood}
                    >
                      <Camera className="mr-2 h-4 w-4" />
                      Choose Image
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <div className="space-y-8 lg:col-span-3">
            <Card className="min-h-[200px]">
              <CardHeader>
                <CardTitle className="font-headline">
                  Your AI Financial Advisor
                </CardTitle>
                <CardDescription>
                  Personalized advice based on your current mood.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex min-h-[120px] items-center justify-center">
                {isLoadingMood || isLoadingAdvice ? (
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <Loader2 className="h-10 w-10 animate-spin text-primary" />
                    <span>
                      {isLoadingMood
                        ? "Analyzing your mood..."
                        : "Generating your advice..."}
                    </span>
                  </div>
                ) : mood && advice ? (
                  <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
                    <div>{moodIcons[mood]}</div>
                    <div className="space-y-1">
                      <p className="text-lg font-semibold capitalize">
                        You seem {mood}.
                      </p>
                      <p className="text-muted-foreground">{advice}</p>
                    </div>
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground">
                    Your financial advice will appear here once your mood is
                    detected.
                  </p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-headline">
                  Mood & Spending Trends
                </CardTitle>
                <CardDescription>
                  Your financial patterns over the last week.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <MoodChart data={moodChartData} />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}
