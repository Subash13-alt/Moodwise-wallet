export type Transaction = {
  id: string;
  date: string;
  timeOfDay: string;
  mood: string;
  category: string;
  amount: number;
  recommendation: string;
};

export const initialTransactions: Transaction[] = [
  {
    id: "1",
    date: "10/29/2025",
    timeOfDay: "Morning",
    mood: "happy",
    category: "Coffee",
    amount: 120,
    recommendation: "Relax spending. Enjoy the day, but track your expenses.",
  },
  {
    id: "2",
    date: "10/29/2025",
    timeOfDay: "Afternoon",
    mood: "stressed",
    category: "Online Shopping",
    amount: 4500,
    recommendation: "Pause and reflect. Is this purchase necessary?",
  },
  {
    id: "3",
    date: "10/29/2025",
    timeOfDay: "Evening",
    mood: "sad",
    category: "Takeout Food",
    amount: 600,
    recommendation: "Practice mindful spending. Consider a home-cooked meal.",
  },
  {
    id: "4",
    date: "10/29/2025",
    timeOfDay: "Evening",
    mood: "neutral",
    category: "Groceries",
    amount: 2000,
    recommendation: "Good job on your budget! Keep it up.",
  },
  {
    id: "5",
    date: "10/30/2025",
    timeOfDay: "Morning",
    mood: "neutral",
    category: "Coffee",
    amount: 100,
    recommendation: "Keep following your budget today.",
  },
  {
    id: "6",
    date: "10/30/2025",
    timeOfDay: "Afternoon",
    mood: "anxious",
    category: "Online Shopping",
    amount: 7000,
    recommendation:
      "High-alert: Emotional spending detected. Redirect funds to savings.",
  },
  {
    id: "7",
    date: "10/30/2025",
    timeOfDay: "Evening",
    mood: "neutral",
    category: "Entertainment",
    amount: 400,
    recommendation:
      "Consider low-cost alternatives, like free streaming services.",
  },
  {
    id: "8",
    date: "10/31/2025",
    timeOfDay: "Morning",
    mood: "happy",
    category: "Breakfast",
    amount: 250,
    recommendation: "Celebrate within your budget.",
  },
  {
    id: "9",
    date: "10/31/2025",
    timeOfDay: "Afternoon",
    mood: "stressed",
    category: "Impulse Buy",
    amount: 1800,
    recommendation: "Stop and reassess. Is there a less expensive way to cope?",
  },
  {
    id: "10",
    date: "10/31/2025",
    timeOfDay: "Evening",
    mood: "happy",
    category: "Dinner Out",
    amount: 2500,
    recommendation:
      "Enjoy your special occasion. Make a plan to balance the budget tomorrow.",
  },
  {
    id: "11",
    date: "11/01/2025",
    timeOfDay: "Morning",
    mood: "tired",
    category: "Coffee",
    amount: 120,
    recommendation:
      "Mind your budget today. Maybe switch to making coffee at home.",
  },
  {
    id: "12",
    date: "11/01/2025",
    timeOfDay: "Afternoon",
    mood: "sad",
    category: "Snacks",
    amount: 150,
    recommendation:
      "Avoid idle spending. Explore free activities to occupy your time.",
  },
  {
    id: "13",
    date: "11/01/2025",
    timeOfDay: "Evening",
    mood: "neutral",
    category: "Savings",
    amount: 2000,
    recommendation: "Excellent! Your calm mood is boosting your financial health.",
  },
];
