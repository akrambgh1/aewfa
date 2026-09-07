import {
  ref,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";

import { storage } from "@/lib/firebase";

export async function uploadProjectImages(files) {
  const uploadPromises = files.map(async (file) => {
    const fileName = `${Date.now()}-${file.name}`;

    const storageRef = ref(
      storage,
      `projects/${fileName}`
    );

    await uploadBytes(storageRef, file);

    return getDownloadURL(storageRef);
  });

  return Promise.all(uploadPromises);
}