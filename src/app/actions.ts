"use server";

import { detectMoodFromText } from "@/ai/flows/detect-mood-from-text";
import { detectMoodFromImage } from "@/ai/flows/detect-mood-from-image";
import { getPersonalizedFinancialAdvice } from "@/ai/flows/personalized-financial-advice";
import { getPersonalizedExpenseAdvice } from "@/ai/flows/expense-advisor";
import { z } from "zod";

const MoodEnum = z.enum([
  "happy",
  "sad",
  "neutral",
  "stressed",
  "anxious",
  "tired",
]);
export type Mood = z.infer<typeof MoodEnum>;

export async function getMoodFromTextInput(text: string) {
  if (!text) {
    throw new Error("Text input cannot be empty.");
  }
  const result = await detectMoodFromText({ text });
  if (!MoodEnum.safeParse(result.mood).success) {
    throw new Error("Invalid mood detected.");
  }
  return result;
}

export async function getMoodFromImageInput(photoDataUri: string) {
  if (!photoDataUri) {
    throw new Error("Image data cannot be empty.");
  }
  const result = await detectMoodFromImage({ photoDataUri });
  if (!MoodEnum.safeParse(result.mood).success) {
    throw new Error("Invalid mood detected.");
  }
  return result;
}

export async function getAdviceForMood(mood: Mood) {
  const result = await getPersonalizedFinancialAdvice({ mood });
  if (!result.advice) {
    throw new Error("Failed to generate advice.");
  }
  return result;
}

export async function getExpenseAdvice(
  history: { role: "user" | "model"; content: string }[]
) {
  const result = await getPersonalizedExpenseAdvice({ history });
  if (!result.advice) {
    throw new Error("Failed to generate advice.");
  }
  return result;
}
