'use client';

import { useState } from 'react';
import { Camera, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import Image from 'next/image';

interface UploadProfileImageProps {
  currentImage?: string;
  onUploadComplete?: (data: { bucket: string; fileName: string; url: string }) => void;
}

export default function UploadProfileImage({ currentImage, onUploadComplete }: UploadProfileImageProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentImage || null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show preview
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch('/api/upload/profile-image', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        onUploadComplete?.(result.data);
        toast.success('Profile image updated successfully!');
      } else {
        toast.error('Upload failed: ' + (result.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative group">
        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-xl bg-slate-100 flex items-center justify-center">
          {preview ? (
            <Image
              src={preview}
              alt="Avatar Preview"
              fill
              className="object-cover"
            />
          ) : (
            <Camera className="w-10 h-10 text-slate-300" />
          )}
        </div>
        
        <label className="absolute inset-0 flex items-center justify-center bg-black/40 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
          <input
            type="file"
            accept="image/*"
            onChange={handleUpload}
            disabled={uploading}
            className="hidden"
          />
          {uploading ? (
            <Loader2 className="w-8 h-8 animate-spin" />
          ) : (
            <Camera className="w-8 h-8" />
          )}
        </label>
      </div>
      <p className="text-xs text-slate-500 font-medium tracking-tight">Click to change avatar</p>
    </div>
  );
}
