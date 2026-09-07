
import {
  addDoc,
  collection,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "@/lib/dashboard/firebase";

const COLLECTION = "messages";

export async function addContactMessage(data) {
  if (!data?.name || !data?.email || !data?.message) {
    throw new Error("Les informations du message sont incomplètes.");
  }

  await addDoc(collection(db, COLLECTION), {
    name: data.name,
    email: data.email,
    message: data.message,

    read: false,

    createdAt: serverTimestamp(),
  });
}

