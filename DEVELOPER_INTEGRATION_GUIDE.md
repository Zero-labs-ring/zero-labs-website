# 📘 Zero Labs Unified API — Developer Integration Guide

Welcome to the **Zero Labs Developer Documentation**. This guide provides complete, production-ready code examples and API reference for integrating with:
1. **Model Selector API** (`/api/v1/models`)
2. **OpenAI-Compatible Chat Completions & Streaming API** (`/v1/chat/completions`)
3. **Embeddings API** (`/v1/embeddings`)

---

## 🔑 Base URLs & Authentication

| Service | URL / Value | Authentication |
| :--- | :--- | :--- |
| **API Base URL** | `https://api.zerolabs.live` | — |
| **OpenAI Compatible Base URL** | `https://api.zerolabs.live/v1` | `Bearer $ZERO_API_KEY` |
| **API Key Header** | `Authorization: Bearer $ZERO_API_KEY` | Obtain from Dashboard |

---

## 🧠 Part 1: Models & Model Selection API

### 1.1 List All Available Models
Retrieve the list of available models and their capabilities.

- **Endpoint**: `GET /api/v1/models` (or `GET /v1/models`)
- **Headers**: `Authorization: Bearer $ZERO_API_KEY`

#### cURL Request:
```bash
curl https://api.zerolabs.live/v1/models \
  -H "Authorization: Bearer $ZERO_API_KEY"
```

#### JSON Response:
```json
{
  "object": "list",
  "data": [
    {
      "id": "titan-pro",
      "object": "model",
      "owned_by": "zerolabs"
    },
    {
      "id": "titan-ultra",
      "object": "model",
      "owned_by": "zerolabs"
    }
  ]
}
```

---

## 💬 Part 2: OpenAI-Compatible LLM Chat API

The `/v1/chat/completions` endpoint is a drop-in replacement for the OpenAI API.

- **Base URL**: `https://api.zerolabs.live/v1`
- **Endpoint**: `POST /v1/chat/completions` (or `/api/v1/chat/completions`)
- **Header**: `Authorization: Bearer $ZERO_API_KEY`

---

### 2.1 Python Integration using Official `openai` Library

Install the official OpenAI package:
```bash
pip install openai
```

Run this code:
```python
from openai import OpenAI
import os

# 1. Point client to Zero Labs gateway
client = OpenAI(
    base_url="https://api.zerolabs.live/v1",
    api_key=os.environ.get("ZERO_API_KEY")
)

# -------------------------------------------------------------
# Scenario A: Ultra-Fast Streaming Chat with Titan Pro
# -------------------------------------------------------------
print("=== TITAN PRO STREAMING ===")
stream = client.chat.completions.create(
    model="titan-pro",
    messages=[
        {"role": "user", "content": "Explain microservices vs monolith architecture in 3 bullet points."}
    ],
    temperature=0.7,
    max_tokens=512,
    stream=True
)

for chunk in stream:
    text = chunk.choices[0].delta.content or ""
    print(text, end="", flush=True)

print("\n\n" + "="*50 + "\n")

# -------------------------------------------------------------
# Scenario B: Deep Analytical Reasoning with Titan Ultra
# -------------------------------------------------------------
print("=== TITAN ULTRA STREAMING ===")
stream_ultra = client.chat.completions.create(
    model="titan-ultra",
    messages=[
        {"role": "user", "content": "Solve: If a car travels at 60 mph for 2.5 hours, then 40 mph for 1.5 hours, what is its average speed?"}
    ],
    temperature=0.5,
    max_tokens=1024,
    stream=True
)

for chunk in stream_ultra:
    text = chunk.choices[0].delta.content or ""
    print(text, end="", flush=True)
```

---

### 2.2 JavaScript / TypeScript Integration using Official `openai` npm

Install the package:
```bash
npm install openai
```

```typescript
import OpenAI from 'openai';

const client = new OpenAI({
  baseURL: 'https://api.zerolabs.live/v1',
  apiKey: process.env.ZERO_API_KEY,
});

async function run() {
  const stream = await client.chat.completions.create({
    model: 'titan-pro', // or 'titan-ultra'
    messages: [
      { role: 'user', content: 'Write a TypeScript function to debounce an async API call.' }
    ],
    temperature=0.7,
    max_tokens=512,
    stream: true,
  });

  for await (const chunk of stream) {
    process.stdout.write(chunk.choices[0]?.delta?.content || '');
  }
}

run().catch(console.error);
```

---

### 2.3 Raw cURL Request (Streaming SSE)
```bash
curl -N -X POST https://api.zerolabs.live/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ZERO_API_KEY" \
  -d '{
    "model": "titan-pro",
    "messages": [
      {"role": "user", "content": "What is the speed of light in miles per hour?"}
    ],
    "temperature": 0.7,
    "max_tokens": 256,
    "stream": true
  }'
```

---

## ⚙️ Part 3: Error Codes & Handling

| Status Code | Meaning | Resolution |
| :--- | :--- | :--- |
| **`200 OK`** | Success | Response returned / streaming active |
| **`401 Unauthorized`** | Invalid API Key | Ensure `Authorization: Bearer $ZERO_API_KEY` header is passed |
| **`503 Service Unavailable`** | Service Temporarily Unavailable | The AI inference cluster is updating or initializing. Retry in 5–10 seconds |
