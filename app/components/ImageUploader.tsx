import { useState, useRef } from "react";
import { useFetcher } from "@remix-run/react";

// Define the response type from the upload API
interface UploadResponse {
  imageUrl?: string;
  error?: string;
}

interface ImageUploaderProps {
  onImageUploaded: (imageUrl: string) => void;
  inputId?: string;
}

export default function ImageUploader({ onImageUploaded, inputId }: ImageUploaderProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const fetcher = useFetcher<UploadResponse>();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPreview(URL.createObjectURL(file));
    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("image", selectedFile);

    fetcher.submit(formData, {
      method: "post",
      action: "/api/upload",
      encType: "multipart/form-data",
    });
  };

  // Handle the response from the upload
  if (fetcher.data?.imageUrl && isUploading) {
    setIsUploading(false);
    onImageUploaded(fetcher.data.imageUrl);
  }

  // Handle errors
  if (fetcher.state === "idle" && isUploading && fetcher.data?.error) {
    setIsUploading(false);
  }

  return (
    <div className="flex flex-col gap-1">
      <label
        htmlFor="image"
        className="block text-sm font-medium mb-2 text-slate-400"
      >
        Image
      </label>
      <div className="relative h-72 overflow-hidden bg-gray-800 rounded-xl">
        {preview ? (
          <img
            src={preview}
            alt="Preview"
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-400">No image selected</p>
          </div>
        )}
      </div>

      <div className="flex gap-4 mt-4 justify-end">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          ref={fileInputRef}
          id={inputId}
          className="hidden"
        />

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="bg-gray-700 text-white px-4 py-2 rounded-md transition hover:bg-gray-800"
        >
          Select Image
        </button>

        <button
          type="button"
          onClick={handleUpload}
          disabled={!preview || isUploading}
          className={`px-4 py-2 rounded-md ${
            !preview || isUploading
              ? "bg-gray-600 text-gray-400 transition hover:bg-gray-600 disabled:hover:bg-gray-600 disabled:cursor-not-allowed"
              : "bg-cyan-600 text-white"
          }`}
        >
          {isUploading ? "Uploading..." : "Upload"}
        </button>
      </div>

      {fetcher.data?.error && (
        <p className="text-red-500">{fetcher.data.error}</p>
      )}
    </div>
  );
}