import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const audio = formData.get('audio') as File | null

    if (!audio) {
      return NextResponse.json({ error: 'No audio file provided' }, { status: 400 })
    }

    const groqApiKey = process.env.GROQ_API_KEY
    if (!groqApiKey) {
      // Return a graceful mock transcription if no Groq key configured in local dev
      return NextResponse.json({ 
        text: 'Voice input captured (configure GROQ_API_KEY for live Whisper inference).' 
      })
    }

    const groqFormData = new FormData()
    groqFormData.append('file', audio, 'recording.webm')
    groqFormData.append('model', 'whisper-large-v3')
    groqFormData.append('language', 'en')

    const response = await fetch('https://api.groq.com/openai/v1/audio/transcriptions', {
      method: 'POST',
      headers: { 
        Authorization: `Bearer ${groqApiKey}` 
      },
      body: groqFormData,
    })

    if (!response.ok) {
      const errText = await response.text()
      console.error('Groq Whisper STT API error:', errText)
      return NextResponse.json({ error: 'Transcription service error' }, { status: 502 })
    }

    const data = await response.json()
    return NextResponse.json({ text: data.text || '' })
  } catch (error) {
    console.error('Transcribe endpoint error:', error)
    return NextResponse.json({ error: 'Internal transcription error' }, { status: 500 })
  }
}
