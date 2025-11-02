# **App Name**: MoodWise Wallet

## Core Features:

- Mood Detection via Image: Detect user's mood (happy, sad, neutral) from a camera image using Gemini Vision API.
- Mood Detection via Text: Detect user's mood from typed text using sentiment analysis. The LLM will act as a tool in order to perform text sentiment analysis and make judgements on whether to suggest spending advice.
- Personalized Financial Advice: Provide tailored spending/saving advice based on detected mood (happy: save, sad: controlled spending, neutral: balanced advice) using the Gemini AI API.
- User Dashboard: Display the interface to allow the user to input their mood and view associated personalized financial advice and insights.
- Data Storage: Store user moods, spending patterns, and financial advice interactions in Firebase Firestore with 'Moodwise wallet' project. Saving the moods will allow trending of historic mood patterns.
- Financial Data Analysis: Use Firebase functions and Pandas logic to analyze saving/spending habits and identify trends.
- Mood-Spending Trends Chart: Display a simple UI chart showing daily mood-spending trends, giving insights into the user's behavior.

## Style Guidelines:

- Primary color: Deep blue (#3F51B5) to evoke trust and stability, aligning with financial themes.
- Background color: Very light blue (#E8EAF6), a desaturated variant of the primary, creating a calm and professional backdrop.
- Accent color: Muted teal (#4CAF50), an analogous color that adds a touch of optimism and growth, commonly associated with finance.
- Body and headline font: 'PT Sans', a humanist sans-serif font for a balance of modernity and readability, suitable for both headlines and body text.
- Code font: 'Source Code Pro' for displaying code snippets.
- Use clean, minimalist icons related to finance, mood, and analytics.
- Subtle, smooth animations when displaying advice and updating charts to create a dynamic but non-intrusive user experience.