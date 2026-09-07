import { NextResponse } from "next/server";
import {
  doc,
  getDoc,
  deleteDoc,
} from "firebase/firestore";

import { db } from "@/lib/dashboard/firebase";

const IMAGEKIT_API =
  "https://api.imagekit.io/v1/files";

/*
 * Supprimer un fichier ImageKit
 */
async function deleteImageKitFile(
  fileId: string
) {
  if (!fileId) {
    return;
  }

  const privateKey =
    process.env.IMAGEKIT_PRIVATE_KEY;

  if (!privateKey) {
    throw new Error(
      "IMAGEKIT_PRIVATE_KEY est manquante dans .env.local."
    );
  }

  const credentials =
    privateKey + ":";

  const authorization =
    Buffer.from(
      credentials
    ).toString("base64");

  const response = await fetch(
    IMAGEKIT_API +
      "/" +
      encodeURIComponent(fileId),
    {
      method: "DELETE",
      headers: {
        Authorization:
          "Basic " +
          authorization,
      },
      cache: "no-store",
    }
  );

  if (!response.ok) {
    const text =
      await response.text();

    throw new Error(
      "La suppression ImageKit a échoué : " +
        response.status +
        " " +
        text
    );
  }
}

/*
 * DELETE /api/projects/[id]
 */
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    /*
     * Next.js 16 :
     * params est asynchrone.
     */
    const { id } = await params;

    console.log(
      "Suppression du projet :",
      id
    );

    if (!id) {
      return NextResponse.json(
        {
          error:
            "L'identifiant du projet est requis.",
        },
        {
          status: 400,
        }
      );
    }

    /*
     * Référence Firestore
     */
    const projectRef = doc(
      db,
      "projects",
      id
    );

    /*
     * Récupérer le projet
     */
    const projectSnapshot =
      await getDoc(projectRef);

    if (!projectSnapshot.exists()) {
      return NextResponse.json(
        {
          error:
            "Projet introuvable.",
        },
        {
          status: 404,
        }
      );
    }

    const project =
      projectSnapshot.data();

    /*
     * Récupérer les images
     */
    const images = Array.isArray(
      project.images
    )
      ? project.images
      : [];

    console.log(
      "Nombre de photos :",
      images.length
    );

    /*
     * Supprimer les fichiers ImageKit
     */
    for (const image of images) {
      if (
        image &&
        typeof image === "object" &&
        image.fileId
      ) {
        console.log(
          "Suppression du fichier ImageKit :",
          image.fileId
        );

        await deleteImageKitFile(
          image.fileId
        );
      }
    }

    /*
     * Supprimer le projet Firestore
     */
    await deleteDoc(projectRef);

    console.log(
      "Projet supprimé :",
      id
    );

    return NextResponse.json({
      success: true,
      deletedProjectId: id,
      deletedImages: images.length,
    });
  } catch (error: any) {
    console.error(
      "Impossible de supprimer le projet :",
      error
    );

    return NextResponse.json(
      {
        error:
          error?.message ||
          "Impossible de supprimer le projet.",
      },
      {
        status: 500,
      }
    );
  }
}