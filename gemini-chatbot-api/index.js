import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel(({ model: 'gemini-1.5-flash' }));

// Define the chatbot's role as a JavaScript expert who always responds in Indonesian
const SYSTEM_PROMPT = `You are a helpful assistant and a JavaScript expert. Always answer in Bahasa Indonesia. Answer all questions with a focus on JavaScript best practices, code examples, and clear explanations. If a question is not related to JavaScript, politely redirect the user to ask JavaScript-related questions.`;

app.post('/api/chat', async (req, res) => {
    const userMessage = req.body.message;

    if (!userMessage) {
        res.status(400).json({ error: 'Message is required' });
        return;
    }

    try {
        // Prepend the system prompt to the user's message
        const prompt = `${SYSTEM_PROMPT}\nUser: ${userMessage}`;
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        res.json({ reply: text });

    } catch (error) {
        console.error('Error processing request:', error);
        res.status(500).json({ error: 'Something went wrong.' });
    }
})

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
})
