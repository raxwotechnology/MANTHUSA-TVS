import { apiFetch, getApiUrl } from './api';

export interface CloudinaryUploadResponse {
  success: boolean;
  url: string;
  secure_url: string;
  public_id: string;
  format?: string;
  resource_type: string;
  bytes: number;
  width?: number;
  height?: number;
  duration?: number;
}

/**
 * Upload a single file (image, video, document) to Cloudinary via backend.
 */
export async function uploadToCloudinary(
  file: File,
  options: {
    folder?: string;
    resourceType?: 'auto' | 'image' | 'video' | 'raw';
  } = {},
): Promise<CloudinaryUploadResponse> {
  const formData = new FormData();
  formData.append('file', file);
  if (options.folder) {
    formData.append('folder', options.folder);
  }
  if (options.resourceType) {
    formData.append('resourceType', options.resourceType);
  }

  const endpoint = options.resourceType === 'video' || file.type.startsWith('video/')
    ? '/upload/video'
    : '/upload';

  const res = await apiFetch(endpoint, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || 'File upload to Cloudinary failed.');
  }

  return res.json();
}

/**
 * Upload multiple files to Cloudinary concurrently via backend.
 */
export async function uploadMultipleToCloudinary(
  files: File[],
  options: {
    folder?: string;
    resourceType?: 'auto' | 'image' | 'video' | 'raw';
  } = {},
): Promise<CloudinaryUploadResponse[]> {
  const formData = new FormData();
  files.forEach((f) => formData.append('files', f));
  if (options.folder) {
    formData.append('folder', options.folder);
  }
  if (options.resourceType) {
    formData.append('resourceType', options.resourceType);
  }

  const res = await apiFetch('/upload/multiple', {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || 'Multiple file upload failed.');
  }

  const data = await res.json();
  return data.files || [];
}

/**
 * Upload a base64 data string to Cloudinary via backend.
 */
export async function uploadBase64ToCloudinary(
  base64Data: string,
  options: {
    folder?: string;
    resourceType?: 'auto' | 'image' | 'video' | 'raw';
  } = {},
): Promise<CloudinaryUploadResponse> {
  const res = await apiFetch('/upload', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      data: base64Data,
      folder: options.folder || 'manthusa-tvs',
      resourceType: options.resourceType || 'auto',
    }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || 'Base64 upload to Cloudinary failed.');
  }

  return res.json();
}
