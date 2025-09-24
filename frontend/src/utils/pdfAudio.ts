// Utility to extract text from a PDF and generate audio using Web Speech API
// Configure pdf.js worker using a CDN URL to avoid bundler resolution issues
import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist';

// Pin the worker to the same pdfjs-dist version as in package.json
GlobalWorkerOptions.workerSrc =
  'https://unpkg.com/pdfjs-dist@4.4.168/build/pdf.worker.mjs' as any;

export async function extractPdfText(pdfUrl: string): Promise<string> {
  const loadingTask = getDocument(pdfUrl);
  const pdf = await loadingTask.promise;
  const texts: string[] = [];
  for (let pageNo = 1; pageNo <= pdf.numPages; pageNo++) {
    const page = await pdf.getPage(pageNo);
    const content = await page.getTextContent();
    const pageText = content.items
      .map((item: any) => ('str' in item ? item.str : (item as any).textContent || ''))
      .join(' ');
    texts.push(pageText);
  }
  await pdf.destroy();
  const text = texts.join('\n\n');
  return text.replace(/\s+/g, ' ').trim();
}

function splitIntoChunks(text: string, size = 1500) {
  const chunks: string[] = [];
  let i = 0;
  while (i < text.length) {
    let end = Math.min(i + size, text.length);
    // try to break at sentence end
    const slice = text.slice(i, end);
    const lastStop = Math.max(slice.lastIndexOf('. '), slice.lastIndexOf('! '), slice.lastIndexOf('? '));
    if (end < text.length && lastStop > size * 0.6) {
      end = i + lastStop + 1;
    }
    chunks.push(text.slice(i, end));
    i = end;
  }
  return chunks;
}

export function stopSpeaking() {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}

// ------------------- Seekable Speech Controller -------------------

export type SpeechState = 'idle' | 'playing' | 'paused' | 'stopped' | 'ended';

export interface SpeechController {
  play(startSeconds?: number): void;
  pause(): void;
  resume(): void;
  stop(): void;
  seekToSeconds(seconds: number): void;
  getState(): {
    state: SpeechState;
    currentTime: number; // seconds
    totalTime: number; // seconds (estimated)
    currentChunk: number;
    totalChunks: number;
  };
  dispose(): void;
}

interface PrepareOptions {
  lang?: string;
  rate?: number; // SpeechSynthesisUtterance.rate (0.1 - 10)
  pitch?: number; // 0 - 2
  wpm?: number; // estimation for duration (words per minute)
  voice?: SpeechSynthesisVoice; // specific voice to use
}

export function prepareSpeech(text: string, opts?: PrepareOptions): SpeechController {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    throw new Error('Speech Synthesis no disponible en este navegador.');
  }
  // Prefer the selected voice language when available, fallback to provided lang, then 'es-ES'
  const lang = (opts?.voice?.lang ?? opts?.lang) || 'es-ES';
  const rate = opts?.rate ?? 1;
  const pitch = opts?.pitch ?? 1;
  const wpm = opts?.wpm ?? 170;

  const chunks = splitIntoChunks(text);
  const totalChunks = chunks.length;

  // Precompute durations by chunk (estimated)
  const wordsPerChunk = chunks.map(c => (c.match(/\b\w+\b/g) || []).length);
  const durations = wordsPerChunk.map(w => (w / wpm) * 60); // seconds
  const offsets: number[] = [];
  durations.reduce((acc, d, i) => (offsets[i] = acc, acc + d), 0);
  const totalTime = durations.reduce((a, b) => a + b, 0);

  let state: SpeechState = 'idle';
  let currentChunk = 0;
  let currentTime = 0; // seconds
  let progressTimer: number | null = null;
  let chunkStartTime = 0; // performance.now() baseline

  const clearTimer = () => {
    if (progressTimer != null) {
      window.clearInterval(progressTimer);
      progressTimer = null;
    }
  };

  const updateTimeFromBoundary = (charIndex: number) => {
    const txt = chunks[currentChunk] || '';
    const frac = txt.length > 0 ? Math.min(1, Math.max(0, charIndex / txt.length)) : 0;
    const within = durations[currentChunk] * frac;
    currentTime = offsets[currentChunk] + within;
  };

  const startTimer = () => {
    clearTimer();
    chunkStartTime = performance.now();
    progressTimer = window.setInterval(() => {
      // Fallback estimation using elapsed time within current chunk
      const elapsedMs = performance.now() - chunkStartTime;
      const within = Math.min(durations[currentChunk], elapsedMs / 1000);
      currentTime = offsets[currentChunk] + within;
    }, 200);
  };

  const speakFromChunk = (idx: number) => {
    if (idx < 0) idx = 0;
    if (idx >= totalChunks) {
      // finished
      state = 'ended';
      currentChunk = totalChunks - 1;
      currentTime = totalTime;
      clearTimer();
      return;
    }
    currentChunk = idx;
    const utter = new SpeechSynthesisUtterance(chunks[idx]);
    utter.lang = lang;
    utter.rate = rate;
    utter.pitch = pitch;
    if (opts?.voice) {
      utter.voice = opts.voice;
    }
    utter.onboundary = (ev: SpeechSynthesisEvent) => {
      // @ts-ignore Chrome supports charIndex
      const ci = (ev as any).charIndex ?? 0;
      updateTimeFromBoundary(ci);
    };
    utter.onend = () => {
      // Move to next chunk if still playing
      if (state === 'playing') {
        speakFromChunk(currentChunk + 1);
      }
    };
    utter.onerror = () => {
      state = 'stopped';
      clearTimer();
    };

    // Speak and start timer
    window.speechSynthesis.speak(utter);
    startTimer();
    state = 'playing';
  };

  const api: SpeechController = {
    play(startSeconds?: number) {
      window.speechSynthesis.cancel();
      if (startSeconds == null || isNaN(startSeconds)) {
        speakFromChunk(0);
        return;
      }
      // Map seconds to chunk
      const idx = Math.max(0, durations.findIndex((_, i) => offsets[i] + durations[i] > startSeconds));
      speakFromChunk(idx);
    },
    pause() {
      if (state === 'playing') {
        window.speechSynthesis.pause();
        state = 'paused';
        clearTimer();
      }
    },
    resume() {
      if (state === 'paused') {
        window.speechSynthesis.resume();
        state = 'playing';
        startTimer();
      }
    },
    stop() {
      window.speechSynthesis.cancel();
      state = 'stopped';
      clearTimer();
      currentTime = 0;
      currentChunk = 0;
    },
    seekToSeconds(seconds: number) {
      if (!isFinite(seconds)) return;
      // cancel and start from computed chunk
      const wasPlaying = state === 'playing';
      window.speechSynthesis.cancel();
      const idx = (() => {
        let acc = 0;
        for (let i = 0; i < totalChunks; i++) {
          const end = acc + durations[i];
          if (seconds < end) return i;
          acc = end;
        }
        return totalChunks - 1;
      })();
      speakFromChunk(idx);
      // Adjust currentTime baseline to desired seconds for immediate UI feedback
      currentTime = Math.min(seconds, totalTime);
      // If previously paused, keep it paused
      if (!wasPlaying && state === 'playing') {
        window.speechSynthesis.pause();
        state = 'paused';
        clearTimer();
      }
    },
    getState() {
      return { state, currentTime, totalTime, currentChunk, totalChunks };
    },
    dispose() {
      window.speechSynthesis.cancel();
      clearTimer();
      state = 'idle';
    },
  };

  return api;
}

export async function prepareSpeechFromPdf(pdfUrl: string, opts?: PrepareOptions) {
  const text = await extractPdfText(pdfUrl);
  if (!text) throw new Error('No se pudo extraer texto del PDF.');
  return prepareSpeech(text, opts);
}
