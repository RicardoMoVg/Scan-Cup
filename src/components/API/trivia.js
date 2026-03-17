// api/trivia.js
export default async function handler(req, res) {
    const { player } = req.body;
    const API_KEY = process.env.GEMINI_API_KEY; // Aquí va tu clave segura

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            contents: [{
                parts: [{ text: `Genera una trivia de 5 preguntas para ${player}. Responde solo con un JSON: {"trivia": [{"q": "pregunta", "o": ["opcion1", "opcion2"], "a": "correcta"}]}` }]
            }]
        })
    });

    const data = await response.json();
    res.status(200).json(data);
}