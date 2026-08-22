import urllib.request
import json
import time

WEBSITE_URL = "https://zero-labs-website.vercel.app"

def test_stream_chat(base_url, prompt="Hello! Please write a short 1-sentence response."):
    print(f"\n==================================================")
    print(f"Testing Chat Streaming via: {base_url}/api/chat")
    print(f"Prompt: \"{prompt}\"")
    print(f"==================================================")
    
    url = f"{base_url}/api/chat"
    headers = {
        "Content-Type": "application/json"
    }
    payload = {
        "messages": [{"role": "user", "content": prompt}],
        "model": "titan-pro",
        "webSearch": False
    }
    
    req = urllib.request.Request(url, data=json.dumps(payload).encode('utf-8'), headers=headers, method='POST')
    
    t0 = time.time()
    accumulated_tokens = []
    model_name = None
    error_msg = None
    
    try:
        with urllib.request.urlopen(req, timeout=45) as resp:
            print(f"HTTP Status: {resp.status} OK (Stream opened in {time.time() - t0:.2f}s)")
            for line in resp:
                line = line.decode('utf-8').strip()
                if not line.startswith('data:'):
                    continue
                raw_data = line[5:].trim() if hasattr(line[5:], 'trim') else line[5:].strip()
                if raw_data == '[DONE]':
                    break
                try:
                    event = json.loads(raw_data)
                    if event.get('type') == 'model_info':
                        model_name = event.get('model')
                    elif event.get('type') == 'token':
                        tok = event.get('token', '')
                        accumulated_tokens.append(tok)
                        print(tok, end='', flush=True)
                    elif event.get('type') == 'error':
                        error_msg = event.get('error')
                except Exception:
                    pass
        
        full_text = "".join(accumulated_tokens).strip()
        elapsed = time.time() - t0
        print(f"\n\n--- Test Results ---")
        print(f"Time Taken: {elapsed:.2f}s")
        print(f"Model: {model_name or 'N/A'}")
        print(f"Tokens Generated: {len(accumulated_tokens)}")
        if full_text:
            print(f"Full Response:\n{full_text}")
            return True
        elif error_msg:
            print(f"Status Message Received:\n{error_msg.encode('ascii', 'ignore').decode('ascii')}")
            return False
        else:
            print("No tokens or error received.")
            return False
            
    except urllib.error.HTTPError as e:
        print(f"HTTP Error {e.code}: {e.read().decode('utf-8')}")
        return False
    except Exception as e:
        print(f"Connection Error: {e}")
        return False

if __name__ == "__main__":
    test_stream_chat(WEBSITE_URL)
