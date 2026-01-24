'use client';

import { useState } from 'react';
import { FileUp, Loader2, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

interface UploadDocumentProps {
  docType?: string;
  onUploadComplete?: (data: { bucket: string; fileName: string; url: string }) => void;
}

export default function UploadDocument({ docType = 'general', onUploadComplete }: UploadDocumentProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('document', file);
      formData.append('docType', docType);

      const response = await fetch('/api/upload/document', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        setUploadedFile(file.name);
        onUploadComplete?.(result.data);
        toast.success(`Document "${file.name}" uploaded successfully!`);
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
    <div className="flex flex-col space-y-2">
      <label className="cursor-pointer">
        <input
          type="file"
          accept=".pdf,.doc,.docx,.txt"
          onChange={handleUpload}
          disabled={uploading}
          className="hidden"
        />
        <div className={`flex items-center space-x-3 px-4 py-3 rounded-xl border-2 border-dashed transition-all ${
          uploadedFile ? 'bg-green-50 border-green-200' : 'bg-slate-50 border-slate-200 hover:border-blue-400 hover:bg-blue-50/30'
        }`}>
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
            uploadedFile ? 'bg-green-100 text-green-600' : 'bg-white text-slate-400 shadow-sm border border-slate-100'
          }`}>
            {uploading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : uploadedFile ? (
              <CheckCircle2 className="w-5 h-5" />
            ) : (
              <FileUp className="w-5 h-5" />
            )}
          </div>
          <div className="flex-1 min-w-0 text-left">
            <p className={`text-sm font-bold truncate ${uploadedFile ? 'text-green-900' : 'text-slate-900'}`}>
              {uploading ? 'Uploading...' : uploadedFile || 'Upload Learning Material'}
            </p>
            <p className="text-[10px] text-slate-400 font-medium tracking-tight">PDF, DOC up to 10MB</p>
          </div>
        </div>
      </label>
    </div>
  );
}
