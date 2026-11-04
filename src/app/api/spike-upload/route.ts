/**
 * ROUTE TEMPORAIRE - SPIKE UPLOAD (T-011)
 *
 * Cette route sert exclusivement à tester la réception d'un fichier audio
 * en multipart/form-data, à mesurer sa taille, son type MIME et le temps de traitement
 * sur l'infrastructure Vercel sans appel Gemini ni écriture en base.
 *
 * Fichier temporaire destiné à être supprimé une fois le spike validé.
 */

import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const startTime = performance.now();

  try {
    const formData = await request.formData();
    const audioEntry = formData.get("audio");

    if (!audioEntry || !(audioEntry instanceof Blob)) {
      return NextResponse.json(
        { error: "Aucun fichier audio valide trouvé dans le champ 'audio'." },
        { status: 400 }
      );
    }

    // Lire les octets pour mesurer le temps réel de lecture et la taille exacte reçue
    const arrayBuffer = await audioEntry.arrayBuffer();
    const processingTimeMs = Math.round(performance.now() - startTime);

    return NextResponse.json({
      success: true,
      sizeBytes: arrayBuffer.byteLength,
      mimeType: audioEntry.type || "application/octet-stream",
      processingTimeMs,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Erreur serveur inattendue";
    return NextResponse.json(
      { error: `Erreur lors de la réception : ${message}` },
      { status: 500 }
    );
  }
}

