import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name:  process.env.CLOUDINARY_CLOUD_NAME!,
  api_key:     process.env.CLOUDINARY_API_KEY!,
  api_secret:  process.env.CLOUDINARY_API_SECRET!,
});

// Upload image buffer to Cloudinary
export async function uploadToCloudinary(
  buffer:   Buffer,
  fileName: string
): Promise<{ url: string; publicId: string }> {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder:         "logovines/logos",
        public_id:      fileName.replace(/\.[^.]+$/, ""), // remove extension
        overwrite:      false,
        resource_type:  "image",
        transformation: [{ quality: "auto", fetch_format: "auto" }],
      },
      (error, result) => {
        if (error || !result) return reject(error || new Error("Upload failed"));
        resolve({ url: result.secure_url, publicId: result.public_id });
      }
    );
    uploadStream.end(buffer);
  });
}

// Delete image from Cloudinary by publicId
export async function deleteFromCloudinary(publicId: string): Promise<void> {
  try {
    await cloudinary.uploader.destroy(publicId);
    console.log("[CLOUDINARY] Deleted:", publicId);
  } catch (error) {
    console.warn("[CLOUDINARY] Delete failed:", error);
  }
}

// Extract publicId from Cloudinary URL
export function getPublicIdFromUrl(url: string): string {
  // e.g. https://res.cloudinary.com/cloud/image/upload/v123/logovines/logos/filename
  const parts    = url.split("/");
  const filename = parts[parts.length - 1].replace(/\.[^.]+$/, "");
  const folder   = parts[parts.length - 2];
  const parent   = parts[parts.length - 3];
  return `${parent}/${folder}/${filename}`;
}