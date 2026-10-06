import Groq from 'groq-sdk'
import type { VercelRequest, VercelResponse } from '@vercel/node'

const systemPrompt = `You are Amos AI, the personal AI assistant for Augustine Amos A. Represent his portfolio and answer questions about his engineering interests, projects, skills, and technologies. Use only the information in this prompt. Do not invent awards, companies, jobs, achievements, education details, project results, or experience. When information is unavailable, say it is not currently available in the portfolio. Be concise, friendly, and professional. Augustine is an Electronics and Communication Engineering student interested in robotics, autonomous UAVs, artificial intelligence, computer vision, embedded systems, IoT, ROS 2, and software development. His listed skills include Python, C/C++, JavaScript, TypeScript, YOLO, OpenCV, machine learning, ROS 2, SLAM, MAVLink, Pixhawk, ESP32, Arduino, Raspberry Pi, React, Vite, Next.js, FastAPI, Node.js, PostgreSQL, and Supabase. Projects listed in the portfolio are AERIS, an autonomous UAV concept for indoor navigation, mapping, and survivor detection; an autonomous pothole detection and repair robot; a smart flood monitoring system; NEXSTEP, an AI career guidance platform; an AI soil health advisor; and a smart classroom concept. No employment history, awards, or contact URLs are provided.`

export default async function handler(request: VercelRequest, response: VercelResponse) {
  response.setHeader('Cache-Control', 'no-store')
  if (request.method !== 'POST') return response.status(405).json({ error: 'Method not allowed.' })
  const message: unknown = request.body?.message
  if (typeof message !== 'string' || !message.trim()) return response.status(400).json({ error: 'Please enter a message.' })
  if (message.length > 1000) return response.status(413).json({ error: 'Please keep messages under 1,000 characters.' })
  const apiKey = process.env.GROQ_API_KEY
  if (!apiKey) return response.status(503).json({ error: 'The assistant is not configured yet. Please try again later.' })
  try {
    const groq = new Groq({ apiKey })
    const completion = await groq.chat.completions.create({
      model: 'openai/gpt-oss-120b',
      messages: [{ role: 'system', content: systemPrompt }, { role: 'user', content: message.trim() }],
      max_tokens: 500,
      temperature: 0.5,
    })
    return response.status(200).json({ reply: completion.choices[0]?.message?.content || 'I do not have an answer for that yet.' })
  } catch (error) {
    const status = typeof error === 'object' && error !== null && 'status' in error ? Number(error.status) : 0
    if (status === 429) return response.status(429).json({ error: 'The assistant is busy right now. Please try again in a moment.' })
    return response.status(502).json({ error: 'The assistant could not respond just now. Please try again shortly.' })
  }
}
