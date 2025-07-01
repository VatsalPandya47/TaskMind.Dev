import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { getSupabase } from '@/lib/supabaseClient';

interface UploadResult {
  success: boolean;
  filePath?: string;
  fileName?: string;
  fileSize?: number;
  error?: string;
}

export const useAudioUpload = () => {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const uploadAudioFile = async (file: File): Promise<UploadResult> => {
    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Validate file type
      const allowedTypes = ["audio/mpeg", "audio/x-m4a", "audio/wav"];
      const allowedExtensions = [".mp3", ".m4a", ".wav"];
      
      if (!allowedTypes.includes(file.type)) {
        const fileExtension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
        if (!allowedExtensions.includes(fileExtension)) {
          throw new Error("Only .mp3, .m4a, and .wav files are supported");
        }
      }

      // Validate file size (100MB limit)
      const maxFileSize = 100 * 1024 * 1024;
      if (file.size > maxFileSize) {
        throw new Error("File size must be less than 100MB");
      }

      // Get current user
      const supabase = getSupabase();
      if (!supabase) {
        throw new Error("Supabase client not available");
      }

      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        throw new Error("Authentication required");
      }

      // Create unique filename
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const fileExtension = file.name.substring(file.name.lastIndexOf('.'));
      const fileName = `${user.id}/${timestamp}${fileExtension}`;

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from('audio-files')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error('Upload error:', error);
        throw new Error(`Upload failed: ${error.message}`);
      }

      setIsUploading(false);
      setUploadProgress(100);

      toast({
        title: "Upload Successful",
        description: "Audio file uploaded successfully",
      });

      return {
        success: true,
        filePath: data.path,
        fileName: file.name,
        fileSize: file.size
      };

    } catch (error: any) {
      setIsUploading(false);
      setUploadProgress(0);
      
      console.error('Audio upload error:', error);
      
      toast({
        title: "Upload Failed",
        description: error.message || "Failed to upload audio file",
        variant: "destructive",
      });

      return {
        success: false,
        error: error.message || "Upload failed"
      };
    }
  };

  const deleteAudioFile = async (fileName: string): Promise<boolean> => {
    try {
      const supabase = getSupabase();
      if (!supabase) {
        throw new Error("Supabase client not available");
      }

      const { error } = await supabase.storage
        .from('audio-files')
        .remove([fileName]);

      if (error) {
        console.error('Delete error:', error);
        throw new Error(`Delete failed: ${error.message}`);
      }

      toast({
        title: "File Deleted",
        description: "Audio file deleted successfully",
      });

      return true;
    } catch (error: any) {
      console.error('Audio delete error:', error);
      
      toast({
        title: "Delete Failed",
        description: error.message || "Failed to delete audio file",
        variant: "destructive",
      });

      return false;
    }
  };

  return {
    uploadAudioFile,
    deleteAudioFile,
    isUploading,
    uploadProgress,
  };
}; 