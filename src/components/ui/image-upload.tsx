
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Upload, X } from 'lucide-react';

interface ImageUploadProps {
  bucket: string;
  onImageUploaded: (url: string) => void;
  currentImage?: string;
  label: string;
}

export const ImageUpload = ({ bucket, onImageUploaded, currentImage, label }: ImageUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(currentImage || '');

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(fileName);

      setPreview(publicUrl);
      onImageUploaded(publicUrl);

      toast({
        title: 'Image uploaded successfully',
        description: 'Your image has been uploaded.',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to upload image',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setPreview('');
    onImageUploaded('');
  };

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      
      {preview ? (
        <div className="relative">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-48 object-cover rounded-lg border"
          />
          <Button
            type="button"
            variant="destructive"
            size="sm"
            className="absolute top-2 right-2"
            onClick={handleRemoveImage}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <Upload className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-2 text-sm text-gray-600">Click to upload an image</p>
        </div>
      )}

      <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        disabled={uploading}
        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
      />
      
      {uploading && (
        <p className="text-sm text-gray-600">Uploading...</p>
      )}
    </div>
  );
};
