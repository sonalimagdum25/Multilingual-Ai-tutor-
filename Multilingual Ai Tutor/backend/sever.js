import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.post('/chat', async (req, res) => {
    try {
        const { message, language } = req.body;

        const prompt = `
        Answer in ${language} language.
        Explain in simple words for rural students.
        Question: ${message}
        `;

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.AIzaSyCkQ1jfaEAlKAdT7aNi4_qJsbheB7QEEX8}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    contents: [
                        {
                            parts: [{ text: prompt }]
                        }
                    ]
                })
            }
        );

        const data = await response.json();

        const reply = data.candidates[0].content.parts[0].text;

        res.json({ reply });

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Something went wrong' });
    }
});

app.listen(5000, () => {
    console.log('Server running on port 5000');
});