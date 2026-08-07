import "server-only";

const IMAGEKIT_API_BASE = "https://api.imagekit.io/v1";

function authHeader() {
  const key = process.env.IMAGEKIT_PRIVATE_KEY!;
  return `Basic ${Buffer.from(`${key}:`).toString("base64")}`;
}

export async function deleteImageKitFile(fileId: string): Promise<void> {
  const res = await fetch(`${IMAGEKIT_API_BASE}/files/${fileId}`, {
    method: "DELETE",
    headers: { Authorization: authHeader() },
  });

  // 404 means it's already gone — treat as success so car deletion isn't blocked.
  if (!res.ok && res.status !== 404) {
    const body = await res.text();
    throw new Error(`Failed to delete ImageKit file ${fileId}: ${body}`);
  }
}

export async function deleteImageKitFiles(fileIds: string[]): Promise<void> {
  await Promise.all(fileIds.map(deleteImageKitFile));
}
