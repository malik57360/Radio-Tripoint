"""Transcription horodatée (Whisper turbo + Silero VAD, sherpa-onnx).
  python3 transcrire.py <video> [langue]"""
import os
import subprocess
import sys

import numpy as np
import sherpa_onnx

# Modèles : voir le README (Whisper turbo et Silero VAD, releases de k2-fsa/sherpa-onnx).
ASR = os.environ.get("ASR", "asr")
TAUX = 16000
langue = sys.argv[2] if len(sys.argv) > 2 else "fr"

brut = subprocess.run(["ffmpeg", "-v", "error", "-i", sys.argv[1], "-ac", "1", "-ar", str(TAUX), "-f", "f32le", "-"], capture_output=True, check=True).stdout
son = np.frombuffer(brut, dtype=np.float32)

rec = sherpa_onnx.OfflineRecognizer.from_whisper(
    encoder=f"{ASR}/sherpa-onnx-whisper-turbo/turbo-encoder.int8.onnx",
    decoder=f"{ASR}/sherpa-onnx-whisper-turbo/turbo-decoder.int8.onnx",
    tokens=f"{ASR}/sherpa-onnx-whisper-turbo/turbo-tokens.txt",
    language=langue,
    task="transcribe",
    num_threads=4,
)
cfg = sherpa_onnx.VadModelConfig()
cfg.silero_vad.model = f"{ASR}/silero_vad.onnx"
cfg.silero_vad.min_silence_duration = 0.35
cfg.silero_vad.max_speech_duration = 20
cfg.sample_rate = TAUX
vad = sherpa_onnx.VoiceActivityDetector(cfg, buffer_size_in_seconds=600)

segments = []
fen = cfg.silero_vad.window_size
for i in range(0, len(son) - fen + 1, fen):
    vad.accept_waveform(son[i : i + fen])
    while not vad.empty():
        segments.append((vad.front.start, np.array(vad.front.samples)))
        vad.pop()
vad.flush()
while not vad.empty():
    segments.append((vad.front.start, np.array(vad.front.samples)))
    vad.pop()

for debut, ech in segments:
    st = rec.create_stream()
    st.accept_waveform(TAUX, ech)
    rec.decode_stream(st)
    print(f"{debut / TAUX:7.2f} → {(debut + len(ech)) / TAUX:7.2f}  {st.result.text.strip()}")
