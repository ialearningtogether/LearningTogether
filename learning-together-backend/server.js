// 1. Importaciones Necesarias
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import axios from 'axios'; // <-- ¡NUEVA LIBRERÍA!

// 2. Configuración del Servidor y Claves
const app = express();
const PORT = 3000; 
const GEMINI_API_KEY = process.env.GEMINI_API_KEY; 
const GEMINI_MODEL = process.env.GEMINI_MODEL; 

// Instrucción del Sistema para AURA (Debe ser idéntica a la que usaste en el frontend)
const SYSTEM_PROMPT = "Eres AURA, un tutor experto en Inteligencia Artificial, Machine Learning y Prompt Engineering. Responde las preguntas del estudiante de forma clara, amigable y concisa. Si te piden un 'quiz', genera tres preguntas de opción múltiple relacionadas con el tema y sus respuestas. Si la pregunta no está relacionada con IA, amablemente redirige la conversación a esos temas.";

// 3. Middlewares
app.use(cors()); 
app.use(express.json()); 

// 4. Ruta de la API de Chat (El Proxy)
app.post('/api/chat', async (req, res) => {
    
    const userPrompt = req.body.prompt;
    
    if (!userPrompt || !GEMINI_API_KEY) {
        // Mejor manejo de error para clave faltante
        return res.status(500).json({ error: 'Falta el prompt o la clave API en el servidor.' });
    }
    
    // 4.1. Construir la URL de la API de Gemini
    const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

    const payload = {
        contents: [{ parts: [{ text: userPrompt }] }],
        systemInstruction: {
            parts: [{ text: SYSTEM_PROMPT }]
        },
    };

    try {
        // 4.2. Llamar a la API de Gemini usando AXIOS
        const response = await axios.post(GEMINI_API_URL, payload, {
            // Axios maneja el Content-Type y JSON automáticamente
        });

        // La respuesta de Axios está en response.data
        const result = response.data; 
        const aiResponseText = result.candidates?.[0]?.content?.parts?.[0]?.text || "Lo siento, la IA no pudo generar una respuesta.";

        // 4.3. Enviar la respuesta de la IA de vuelta al frontend
        res.json({ text: aiResponseText });

    } catch (error) {
        // Manejo de errores de red o de la API de Gemini
        console.error("Error al procesar la solicitud (Axios):", error.message);
        // Usamos el código de estado de Google si está disponible
        const status = error.response ? error.response.status : 500; 
        const errorDetails = error.response ? error.response.data : error.message;

        res.status(status).json({ 
            error: 'Error del servidor de IA (Verifica tu clave Gemini)', 
            details: errorDetails 
        });
    }
});

// 5. Iniciar el Servidor
app.listen(PORT, () => {
    console.log(`Servidor proxy de AURA corriendo en http://localhost:${PORT}`);
});