import { upload } from "@imagekit/next";

export interface UploadedImage {
  fileId: string;
  url: string;
}

async function getAuthParams() {
  const res = await fetch("/api/admin/imagekit-auth");
  if (!res.ok) {
    throw new Error("Could not authenticate upload — please log in again.");
  }
  return (await res.json()) as {
    token: string;
    expire: number;
    signature: string;
    publicKey: string;
  };
}

export async function uploadCarImage(
  file: File,
  carId: string,
  onProgress?: (percent: number) => void,
): Promise<UploadedImage> {
  const { token, expire, signature, publicKey } = await getAuthParams();

  const result = await upload({
    file,
    fileName: file.name,
    token,
    expire,
    signature,
    publicKey,
    folder: `/cars/${carId}`,
    useUniqueFileName: true,
    onProgress: (event) => {
      if (onProgress && event.lengthComputable) {
        onProgress(Math.round((event.loaded / event.total) * 100));
      }
    },
  });

  if (!result.fileId || !result.url) {
    throw new Error("Upload succeeded but response was missing file data.");
  }

  return { fileId: result.fileId, url: result.url };
}

export async function uploadCarImages(
  files: File[],
  carId: string,
  onProgress?: (fileIndex: number, percent: number) => void,
): Promise<UploadedImage[]> {
  return Promise.all(
    files.map((file, index) =>
      uploadCarImage(file, carId, (percent) => onProgress?.(index, percent)),
    ),
  );
}
