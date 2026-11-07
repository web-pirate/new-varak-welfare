import { AwsClient } from "aws4fetch";

// Cloudflare R2 (S3 API). Private bucket: files are only read back through /api/files, never by a public URL.
const { R2_ACCOUNT_ID: account, R2_ACCESS_KEY_ID: key, R2_SECRET_ACCESS_KEY: secret, R2_BUCKET: bucket } = process.env;

export const r2Configured = Boolean(account && key && secret && bucket);

const client = r2Configured ? new AwsClient({ accessKeyId: key!, secretAccessKey: secret!, service: "s3", region: "auto" }) : null;
const objectUrl = (objectKey: string) => `https://${account}.r2.cloudflarestorage.com/${bucket}/${objectKey}`;

export async function r2Put(objectKey: string, body: Uint8Array, contentType: string): Promise<void> {
  const res = await client!.fetch(objectUrl(objectKey), { method: "PUT", body: body as BodyInit, headers: { "Content-Type": contentType, "Content-Length": String(body.byteLength) } }); // R2 refuses chunked bodies (411)
  if (!res.ok) throw new Error(`R2 put failed: ${res.status}`);
}

/** The raw R2 response (a stream), or null when the object does not exist. */
export async function r2Get(objectKey: string): Promise<Response | null> {
  const res = await client!.fetch(objectUrl(objectKey));
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`R2 get failed: ${res.status}`);
  return res;
}

export async function r2Delete(objectKey: string): Promise<void> {
  const res = await client!.fetch(objectUrl(objectKey), { method: "DELETE" });
  if (!res.ok && res.status !== 404) throw new Error(`R2 delete failed: ${res.status}`);
}
