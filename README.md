# TransCreate — Cultural AI Adapter for Indie Filmmakers

> **Your script. Every culture. Zero compromise.**
> 
> *Built for the IBM July Challenge 2026 — Creative Industries*

## The Problem
Indie filmmakers and video creators want to release their work globally, but professional dubbing and cultural translation cost thousands of dollars. Simple literal translation (like Google Translate or basic AI translation) ruins the humor, cultural idioms, and emotional beats of a script. A joke in Hindi might make zero sense when translated word-for-word to English.

## The Solution
**TransCreate** is a professional-grade web studio that performs "Transcreation" (creative translation). Instead of word-for-word translation, it uses large language models to translate the *emotional intent* of the dialogue, adapting jokes, slang, and metaphors to be culturally relevant to the target demographic. 

It outputs a localized script complete with pronunciation guides, emotion tags, and cultural context notes for voice actors.

### Features
- 🎬 **Dual-Pane Studio Editor:** A clean, zero-distraction dark mode interface for reviewing lines side-by-side.
- 🧠 **Context-Aware Transcreation:** LangChain is used to pass rolling context to the AI, ensuring that a joke that spans multiple lines isn't lost.
- 🎭 **Cultural Emotion Tagging:** The AI tags every transcreated line with an emotion (e.g., `dry irony`, `warm familiarity`) and provides a rationale for the cultural adaptation.
- 🎧 **TTS Pronunciation Preview:** Built-in Web Speech API integration to hear how the line sounds.
- 💾 **Seamless Export:** Export the finished adaptations directly to industry-standard `.SRT` format.

## Technology Stack
- **Frontend:** React + Vite + TypeScript
- **Styling:** Vanilla CSS + Design Tokens (Professional Dark/Cinema Red theme)
- **AI Orchestration:** LangChain (`@langchain/core`)
- **LLM Provider:** Hugging Face Serverless Inference API

### Note on IBM Granite Integration
The LangChain prompts and architecture are specifically designed and tuned for the `ibm-granite/granite-3.1-8b-instruct` model to ensure the highest quality cultural adaptation.

## How to Run

1. Clone the repository and install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file in the root directory and add your Hugging Face token:
   ```env
   VITE_HF_API_KEY=hf_your_token_here
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open `http://localhost:5173`, click **Open Studio**, and upload an SRT file (or use the provided `samples/hindi-demo.srt`).

## Sample Outputs

**Hindi Original:** "Bhai, yeh toh bahut bada jugaad hai!"
**Literal Translation:** "Brother, this is a very big hack!"
**TransCreate (English US):** "Dude, this is some major hack!" *(Emotion: excited | Rationale: 'Jugaad' implies a clever, improvised solution. 'Major hack' captures that slang energy perfectly for an American audience.)*

---
*Created by Deep Saha*
