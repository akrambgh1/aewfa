import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "./firebase";

const COLLECTION = "projects";

/*
 * =====================================================
 * PROJECTS
 * =====================================================
 */

/*
 * Écouter les projets
 */

export function subscribeToProjects(
  onChange,
  onError
) {
  const q = query(
    collection(db, COLLECTION),
    orderBy("createdAt", "desc")
  );

  return onSnapshot(
    q,
    (snapshot) => {
      const projects =
        snapshot.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }));

      onChange(projects);
    },
    (err) => {
      console.error(
        "Erreur de synchronisation Firestore :",
        err
      );

      onError?.(err);
    }
  );
}

/*
 * Ajouter un projet
 */

export async function addProject(data) {
  await addDoc(
    collection(db, COLLECTION),
    {
      ...data,

      createdAt:
        serverTimestamp(),

      updatedAt:
        new Date()
          .toISOString()
          .slice(0, 10),
    }
  );
}

/*
 * Modifier un projet
 */

export async function updateProject(
  id,
  data
) {
  if (!id) {
    throw new Error(
      "Identifiant du projet manquant."
    );
  }

  await updateDoc(
    doc(db, COLLECTION, id),
    {
      ...data,

      updatedAt:
        new Date()
          .toISOString()
          .slice(0, 10),
    }
  );
}

/*
 * Modifier uniquement le statut
 */

export async function updateProjectStatus(
  id,
  status
) {
  await updateDoc(
    doc(db, COLLECTION, id),
    {
      status,

      updatedAt:
        new Date()
          .toISOString()
          .slice(0, 10),
    }
  );
}

/*
 * Suppression directe Firestore.
 *
 * La suppression du dashboard utilise
 * normalement /api/projects/[id] afin
 * de supprimer également les fichiers ImageKit.
 */

export async function deleteProject(id) {
  await deleteDoc(
    doc(db, COLLECTION, id)
  );
}

/*
 * =====================================================
 * MESSAGES
 * =====================================================
 */

/*
 * Subscribe to contact messages
 */

export function subscribeToMessages(
  onChange,
  onError
) {
  const q = query(
    collection(db, "messages"),
    orderBy("createdAt", "desc")
  );

  return onSnapshot(
    q,
    (snapshot) => {
      const messages =
        snapshot.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }));

      onChange(messages);
    },
    (err) => {
      console.error(
        "Messages subscription error:",
        err
      );

      onError?.(err);
    }
  );
}

/*
 * Mark message as read
 */

export async function markMessageAsRead(id) {
  await updateDoc(
    doc(db, "messages", id),
    {
      read: true,
    }
  );
}

/*
 * Delete message
 */

export async function deleteMessage(id) {
  await deleteDoc(
    doc(db, "messages", id)
  );
}

 export async function addReplyToMessage(messageId, reply) {
  const messageRef = doc(db, "messages", messageId);
  return await updateDoc(messageRef, {
    replies: arrayUnion({
      text: reply.text,
      sentAt: Timestamp.fromDate(reply.sentAt),
    }),
  });
}