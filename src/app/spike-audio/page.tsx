/**
 * PAGE TEMPORAIRE - SPIKE AUDIO (T-010)
 *
 * Cette page sert exclusivement à tester la capture MediaRecorder sur mobile
 * (notamment Chrome Android et Safari iOS), à vérifier les types MIME produits,
 * la taille en Ko et la durée réelle, sans aucun appel externe.
 *
 * Page temporaire destinée à être supprimée une fois le spike validé.
 */

"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";

type RecordingStatus = "idle" | "recording" | "recorded" | "error";

interface RecordingStats {
  recorderMimeType: string;
  blobMimeType: string;
  blobSizeBytes: number;
  blobSizeKo: string;
  durationSeconds: number;
}

const COMMON_AUDIO_MIME_TYPES = [
  "audio/webm;codecs=opus",
  "audio/webm",
  "audio/mp4",
  "audio/aac",
  "audio/ogg;codecs=opus",
  "audio/wav",
];

const emptySubscribe = () => () => {};

export default function SpikeAudioPage() {
  const [status, setStatus] = useState<RecordingStatus>("idle");
  const [stats, setStats] = useState<RecordingStats | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [elapsedTime, setElapsedTime] = useState<number>(0);

  // Safe client-side detection avoiding setState in effect and hydration mismatches
  const isClient = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const startTimeRef = useRef<number>(0);
  const timerIntervalRef = useRef<number | null>(null);

  // Clean up object URLs and recording tracks on unmount
  useEffect(() => {
    return () => {
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
      if (timerIntervalRef.current) {
        window.clearInterval(timerIntervalRef.current);
      }
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, [audioUrl]);

  const stopTracks = useCallback(() => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
  }, []);

  const handleStartRecording = async () => {
    setErrorMessage(null);
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
      setAudioUrl(null);
    }
    setStats(null);
    audioChunksRef.current = [];

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setStatus("error");
      setErrorMessage(
        "L'API MediaDevices / getUserMedia n'est pas disponible dans ce navigateur ou requiert une connexion HTTPS."
      );
      return;
    }

    if (typeof MediaRecorder === "undefined") {
      setStatus("error");
      setErrorMessage("MediaRecorder n'est pas supporté par ce navigateur.");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });
      mediaStreamRef.current = stream;

      // Initialize MediaRecorder without forcing a mimeType so that we can observe
      // the browser's native default format (Chrome: webm/opus, Safari: mp4/aac).
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (event: BlobEvent) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        const endTime = performance.now();
        const durationSec = Math.max(
          0.1,
          Math.round((endTime - startTimeRef.current) / 100) / 10
        );

        const recordedMimeType = recorder.mimeType || "audio/webm";
        const audioBlob = new Blob(audioChunksRef.current, {
          type: recordedMimeType,
        });

        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);

        setStats({
          recorderMimeType: recorder.mimeType || "(non renseigné par le navigateur)",
          blobMimeType: audioBlob.type || "(aucun)",
          blobSizeBytes: audioBlob.size,
          blobSizeKo: (audioBlob.size / 1024).toFixed(2),
          durationSeconds: durationSec,
        });

        stopTracks();
        if (timerIntervalRef.current) {
          window.clearInterval(timerIntervalRef.current);
          timerIntervalRef.current = null;
        }
        setStatus("recorded");
      };

      startTimeRef.current = performance.now();
      setElapsedTime(0);
      timerIntervalRef.current = window.setInterval(() => {
        setElapsedTime((prev) => prev + 1);
      }, 1000);

      recorder.start();
      setStatus("recording");
    } catch (err: unknown) {
      stopTracks();
      setStatus("error");
      if (err instanceof DOMException && err.name === "NotAllowedError") {
        setErrorMessage(
          "Permission micro refusée. Autorise l'accès au micro dans le navigateur pour tester."
        );
      } else if (err instanceof Error) {
        setErrorMessage(`Erreur micro : ${err.message}`);
      } else {
        setErrorMessage("Une erreur inconnue est survenue lors de l'accès au micro.");
      }
    }
  };

  const handleStopRecording = () => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state === "recording"
    ) {
      mediaRecorderRef.current.stop();
    }
  };

  const supportedFormats = isClient && typeof MediaRecorder !== "undefined"
    ? COMMON_AUDIO_MIME_TYPES.map((mime) => ({
        mime,
        supported: MediaRecorder.isTypeSupported(mime),
      }))
    : [];

  return (
    <div className="min-h-screen bg-[#FAF8F3] text-[#1B1B18] px-4 py-8 font-sans">
      <main className="max-w-md mx-auto flex flex-col gap-6">
        {/* En-tête Spike */}
        <header className="rounded-2xl bg-amber-50 border border-amber-200 p-4">
          <span className="inline-block text-xs font-bold uppercase tracking-wider bg-amber-200 text-amber-900 px-2 py-0.5 rounded-full mb-2">
            Page temporaire • T-010 Spike Audio
          </span>
          <h1 className="text-xl font-bold text-[#0B3D2E]">
            Test MediaRecorder Mobile
          </h1>
          <p className="text-sm text-[#5E5E57] mt-1">
            Vérification des types MIME produits nativement (Chrome / Safari), de la
            taille et de la durée avant intégration de Gemini.
          </p>
        </header>

        {/* Message d'erreur */}
        {errorMessage && (
          <div
            role="alert"
            className="rounded-2xl bg-red-50 border border-red-200 p-4 text-sm text-[#B42318]"
          >
            <p className="font-semibold">Problème détecté :</p>
            <p className="mt-1">{errorMessage}</p>
          </div>
        )}

        {/* Zone d'action Enregistrement */}
        <section className="rounded-card bg-surface border border-border p-6 shadow-soft flex flex-col items-center text-center gap-4">
          <h2 className="sr-only">Capture audio</h2>
          <style>{`
            @keyframes mic-breathe {
              0%, 100% {
                transform: scale(1);
              }
              50% {
                transform: scale(1.05);
              }
            }
            @media (prefers-reduced-motion: no-preference) {
              .animate-breathe {
                animation: mic-breathe 300ms ease-in-out infinite;
              }
            }
          `}</style>

          <button
            type="button"
            onClick={
              status === "recording" ? handleStopRecording : handleStartRecording
            }
            aria-label={
              status === "recording"
                ? `Arrêter l'enregistrement (${elapsedTime}s)`
                : status === "recorded"
                ? "Enregistrer à nouveau"
                : "Démarrer l'enregistrement"
            }
            className={`w-28 h-28 rounded-full bg-accent-500 text-brand-900 shadow-mic flex items-center justify-center transition-transform active:scale-95 cursor-pointer motion-reduce:animate-none ${
              status === "recording" ? "animate-breathe" : ""
            }`}
          >
            {status === "recording" ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-10 h-10"
                aria-hidden="true"
              >
                <rect x="6" y="6" width="12" height="12" rx="2" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-10 h-10"
                aria-hidden="true"
              >
                <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
                <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                <line x1="12" x2="12" y1="19" y2="22" />
              </svg>
            )}
          </button>

          <div className="flex flex-col items-center gap-1">
            <span className="text-body font-semibold text-brand-900">
              {status === "recording"
                ? "J'écoute…"
                : status === "recorded"
                ? "Appuie pour recommencer"
                : "Appuie pour parler"}
            </span>
            {status === "recording" && (
              <span className="text-caption font-mono text-text-muted tabular-nums">
                {elapsedTime}s
              </span>
            )}
          </div>
        </section>

        {/* Résultats et réécoute */}
        {stats && audioUrl && (
          <section className="rounded-2xl bg-white border border-[#E6E2D8] p-6 shadow-sm flex flex-col gap-4">
            <h2 className="text-base font-semibold text-[#0B3D2E]">
              Résultats de la capture
            </h2>

            <dl className="grid grid-cols-1 gap-2 text-sm">
              <div className="flex justify-between py-1.5 border-b border-[#E6E2D8]">
                <dt className="text-[#5E5E57]">MIME MediaRecorder :</dt>
                <dd className="font-mono font-medium text-[#1B1B18] text-right break-all">
                  {stats.recorderMimeType}
                </dd>
              </div>

              <div className="flex justify-between py-1.5 border-b border-[#E6E2D8]">
                <dt className="text-[#5E5E57]">MIME Blob produit :</dt>
                <dd className="font-mono font-medium text-[#1B1B18] text-right break-all">
                  {stats.blobMimeType}
                </dd>
              </div>

              <div className="flex justify-between py-1.5 border-b border-[#E6E2D8]">
                <dt className="text-[#5E5E57]">Taille du fichier :</dt>
                <dd className="font-mono font-medium text-[#1B1B18] text-right">
                  {stats.blobSizeKo} Ko ({stats.blobSizeBytes.toLocaleString("fr-FR")} octets)
                </dd>
              </div>

              <div className="flex justify-between py-1.5">
                <dt className="text-[#5E5E57]">Durée estimée :</dt>
                <dd className="font-mono font-medium text-[#1B1B18] text-right">
                  {stats.durationSeconds} s
                </dd>
              </div>
            </dl>

            <div className="pt-2 border-t border-[#E6E2D8] flex flex-col gap-2">
              <label
                htmlFor="spike-audio-playback"
                className="text-xs font-semibold text-[#5E5E57]"
              >
                Réécoute de l&apos;audio :
              </label>
              <audio
                id="spike-audio-playback"
                controls
                src={audioUrl}
                className="w-full min-h-[48px]"
              />
            </div>
          </section>
        )}

        {/* Support des formats selon le navigateur actuel */}
        <section className="rounded-2xl bg-white border border-[#E6E2D8] p-6 shadow-sm flex flex-col gap-3 text-xs">
          <h2 className="text-sm font-semibold text-[#0B3D2E]">
            Formats supportés par ce navigateur
          </h2>
          <p className="text-[#5E5E57]">
            Résultats de <code className="font-mono">MediaRecorder.isTypeSupported()</code> :
          </p>
          {isClient ? (
            <ul className="divide-y divide-[#E6E2D8]">
              {supportedFormats.map(({ mime, supported }) => (
                <li
                  key={mime}
                  className="py-1.5 flex items-center justify-between font-mono"
                >
                  <span>{mime}</span>
                  <span
                    className={`px-2 py-0.5 rounded font-semibold text-[11px] ${
                      supported
                        ? "bg-green-100 text-green-800"
                        : "bg-zinc-100 text-zinc-500"
                    }`}
                  >
                    {supported ? "OUI" : "NON"}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-[#5E5E57] italic">Détection des formats en cours...</p>
          )}
        </section>
      </main>
    </div>
  );
}
