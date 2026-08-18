'use client'

import { useState, useRef, useCallback } from 'react'

export function useSpeechInput(
  onFinalTranscript: (text: string) => void,
  onInterimTranscript?: (text: string) => void
) {
  const [isListening, setIsListening] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const recognitionRef = useRef<any>(null)
  const recorderRef = useRef<MediaRecorder | null>(null)

  const startMediaRecorderFallback = useCallback(async () => {
    try {
      setIsListening(true)
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const recorder = new MediaRecorder(stream, { mimeType: 'audio/webm' })
      const chunks: Blob[] = []

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data)
      }

      recorder.onstop = async () => {
        const blob = new Blob(chunks, { type: 'audio/webm' })
        const formData = new FormData()
        formData.append('audio', blob, 'recording.webm')

        try {
          const res = await fetch('/api/transcribe', { method: 'POST', body: formData })
          if (!res.ok) throw new Error('Transcription error')
          const data = await res.json()
          if (data.text) {
            onFinalTranscript(data.text)
          }
        } catch {
          setError('Transcription failed. Please type instead.')
        } finally {
          setIsListening(false)
          stream.getTracks().forEach((track) => track.stop())
        }
      }

      recorder.start()
      recorderRef.current = recorder

      // Auto-stop after 30 seconds
      setTimeout(() => {
        if (recorder.state === 'recording') {
          recorder.stop()
        }
      }, 30000)
    } catch {
      setError('Microphone permission denied')
      setIsListening(false)
    }
  }, [onFinalTranscript])

  const startListening = useCallback(async () => {
    setError(null)

    // Layer 1: Check microphone permission
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      stream.getTracks().forEach((t) => t.stop())
    } catch {
      setError('Microphone permission denied. Please allow microphone access.')
      return
    }

    // Layer 2: Try Web Speech API
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition

    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition()
        recognition.continuous = false
        recognition.interimResults = true
        recognition.lang = 'en-IN'
        recognition.maxAlternatives = 1

        recognition.onstart = () => setIsListening(true)
        recognition.onend = () => setIsListening(false)

        recognition.onerror = (e: any) => {
          console.warn('Web Speech API error, switching to Layer 3 fallback:', e.error)
          if (e.error === 'not-allowed' || e.error === 'service-not-allowed') {
            setError('Please allow microphone access in browser settings.')
            setIsListening(false)
          } else {
            startMediaRecorderFallback()
          }
        }

        recognition.onresult = (event: any) => {
          let interimText = ''
          let finalText = ''

          for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              finalText += event.results[i][0].transcript
            } else {
              interimText += event.results[i][0].transcript
            }
          }

          if (interimText && onInterimTranscript) {
            onInterimTranscript(interimText)
          }
          if (finalText) {
            onFinalTranscript(finalText)
          }
        }

        recognitionRef.current = recognition
        recognition.start()
      } catch {
        startMediaRecorderFallback()
      }
    } else {
      // Layer 3 fallback directly
      startMediaRecorderFallback()
    }
  }, [onFinalTranscript, onInterimTranscript, startMediaRecorderFallback])

  const stopListening = useCallback(() => {
    try {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
      if (recorderRef.current && recorderRef.current.state === 'recording') {
        recorderRef.current.stop()
      }
    } catch {}
    setIsListening(false)
  }, [])

  return { isListening, error, startListening, stopListening }
}
