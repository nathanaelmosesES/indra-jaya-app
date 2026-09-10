import { supabase } from './supabase'

/**
 * Helpers for Supabase Storage (object storage).
 *
 * `bucket` is the name of a bucket you created in the Supabase dashboard
 * (Storage → New bucket). `path` is the object key within the bucket,
 * e.g. `avatars/user-123.png`.
 */

/** Upload a file. Pass `upsert: true` to overwrite an existing object. */
export async function uploadFile(
  bucket: string,
  path: string,
  file: File | Blob,
  options?: { upsert?: boolean; contentType?: string },
): Promise<{ path: string }> {
  const { data, error } = await supabase.storage.from(bucket).upload(path, file, {
    upsert: options?.upsert ?? false,
    contentType: options?.contentType,
  })
  if (error) throw error
  return data
}

/** Get a public URL (only works for buckets marked "public"). */
export function getPublicUrl(bucket: string, path: string): string {
  const { data } = supabase.storage.from(bucket).getPublicUrl(path)
  return data.publicUrl
}

/**
 * Create a temporary signed URL for a private bucket.
 * `expiresIn` is in seconds (default 1 hour).
 */
export async function getSignedUrl(
  bucket: string,
  path: string,
  expiresIn = 3600,
): Promise<string> {
  const { data, error } = await supabase.storage
    .from(bucket)
    .createSignedUrl(path, expiresIn)
  if (error) throw error
  return data.signedUrl
}

/** Download an object as a Blob. */
export async function downloadFile(bucket: string, path: string): Promise<Blob> {
  const { data, error } = await supabase.storage.from(bucket).download(path)
  if (error) throw error
  return data
}

/** List objects under a folder prefix within a bucket. */
export async function listFiles(bucket: string, prefix = '') {
  const { data, error } = await supabase.storage.from(bucket).list(prefix)
  if (error) throw error
  return data
}

/** Delete one or more objects from a bucket. */
export async function removeFiles(bucket: string, paths: string[]): Promise<void> {
  const { error } = await supabase.storage.from(bucket).remove(paths)
  if (error) throw error
}
