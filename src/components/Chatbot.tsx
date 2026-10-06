import { useEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'

type Message = { role: 'user' | 'assistant'; content: string }
type ChatbotProps = { isAIResponding: boolean; setIsAIResponding: (value: boolean) => void; openSignal: number }
const starters = ['Who is Amos?', 'Tell me about AERIS', 'What are his skills?', 'What projects has he built?']

export default function Chatbot({ isAIResponding, setIsAIResponding, openSignal }: ChatbotProps) {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([{ role: 'assistant', content: "Hi, I'm Amos AI. Ask me about Augustine's engineering interests, projects, and technical stack." }])
  const [input, setInput] = useState('')
  const [error, setError] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)
  useEffect(() => { if (openSignal > 0) setOpen(true) }, [openSignal])
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages, isAIResponding, open])

  async function send(message = input) {
    const value = message.trim()
    if (!value || isAIResponding) return
    setInput('')
    setError('')
    setMessages(previous => [...previous, { role: 'user', content: value }])
    setIsAIResponding(true)
    try {
      const response = await fetch('/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message: value }) })
      const data: { reply?: string; error?: string } = await response.json()
      if (!response.ok || !data.reply) throw new Error(data.error || 'The assistant could not respond. Please try again.')
      setMessages(previous => [...previous, { role: 'assistant', content: data.reply! }])
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'A network error occurred. Please try again.')
    } finally { setIsAIResponding(false) }
  }
  function submit(event: FormEvent) { event.preventDefault(); void send() }
  function clearChat() { setMessages([{ role: 'assistant', content: 'Chat cleared. What would you like to know about Augustine?' }]); setError('') }

  return <>
    <button className="assistant-launch" onClick={() => setOpen(value => !value)} aria-expanded={open} aria-label={open ? 'Close Amos AI chat' : 'Open Amos AI chat'}><span className="launch-spark">✳</span><span>ASK AMOS AI</span><span className="online-dot" /></button>
    {open && <section className="chat-panel" aria-label="Amos AI assistant">
      <header className="chat-header"><div className="chat-avatar">A<span className="online-dot" /></div><div className="chat-title"><strong>AMOS AI</strong><span>PERSONAL ENGINEERING ASSISTANT</span></div><div className="chat-actions"><button onClick={clearChat} aria-label="Clear chat" title="Clear chat">↻</button><button onClick={() => setOpen(false)} aria-label="Close chat">×</button></div></header>
      <div className="chat-status"><span className={isAIResponding ? 'status-orb thinking' : 'status-orb'} />{isAIResponding ? 'AMOS AI IS THINKING…' : 'ONLINE · READY TO HELP'}</div>
      <div className="chat-messages" aria-live="polite">{messages.map((message, index) => <div className={`message-row ${message.role}`} key={`${index}-${message.role}`}><span className="message-label">{message.role === 'user' ? 'YOU' : 'AMOS AI'}</span><div className="message-bubble">{message.content}</div></div>)}{isAIResponding && <div className="message-row assistant"><span className="message-label">AMOS AI</span><div className="message-bubble typing-dots"><i /><i /><i /></div></div>}<div ref={bottomRef} /></div>
      {messages.length <= 1 && <div className="starter-questions">{starters.map(question => <button key={question} onClick={() => void send(question)} disabled={isAIResponding}>{question}<span>↗</span></button>)}</div>}
      {error && <p className="chat-error" role="alert">{error}</p>}
      <form className="chat-form" onSubmit={submit}><textarea value={input} onChange={event => setInput(event.target.value)} onKeyDown={event => { if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); void send() } }} placeholder="Ask about projects, skills…" rows={1} maxLength={1000} disabled={isAIResponding} aria-label="Your message"/><button type="submit" disabled={isAIResponding || !input.trim()} aria-label="Send message">↑</button><span>ENTER TO SEND · SHIFT + ENTER FOR NEW LINE</span></form>
    </section>}
  </>
}
