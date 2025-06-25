import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { 
  Upload, 
  Music, 
  FileAudio, 
  X, 
  CheckCircle, 
  AlertCircle,
  Loader2
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface AudioFileUploadProps {
  onFileSelect: (file: File, fileName: string) => void;
  onFileRemove: () => void;
  selectedFile: File | null;
  isUploading?: boolean;
  uploadProgress?: number;
  error?: string | null;
  className?: string;
}

const AudioFileUpload = ({
  onFileSelect,
  onFileRemove,
  selectedFile,
  isUploading = false,
  uploadProgress = 0,
  error = null,
  className = ""
}: AudioFileUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);

  // Supported audio file types
  const allowedTypes = ["audio/mpeg", "audio/x-m4a", "audio/wav"];
  const allowedExtensions = [".mp3", ".m4a", ".wav"];
  const maxFileSize = 100 * 1024 * 1024; // 100MB

  const handleFileSelect = (file: File) => {
    // Validate file type
    if (!allowedTypes.includes(file.type)) {
      const fileExtension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
      if (!allowedExtensions.includes(fileExtension)) {
        alert("Only .mp3, .m4a, and .wav files are supported");
        return;
      }
    }

    // Validate file size
    if (file.size > maxFileSize) {
      alert("File size must be less than 100MB");
      return;
    }

    // Use file name as audio_name
    const fileName = file.name;
    onFileSelect(file, fileName);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      handleFileSelect(file);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      handleFileSelect(file);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getFileIcon = (fileName: string) => {
    const extension = fileName.substring(fileName.lastIndexOf('.')).toLowerCase();
    switch (extension) {
      case '.mp3':
        return <Music className="h-8 w-8 text-blue-600" />;
      case '.m4a':
        return <FileAudio className="h-8 w-8 text-green-600" />;
      case '.wav':
        return <FileAudio className="h-8 w-8 text-purple-600" />;
      default:
        return <FileAudio className="h-8 w-8 text-gray-600" />;
    }
  };
  
  const handleTranscribe = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append('audio', selectedFile);

    try {
      // const response = await fetch('https://jsxupnogyvfynjgkwdyj.supabase.co/functions/v1/transcribe-audio', {
      //   method: 'POST',
      //   body: formData,
      // });

      const { data, error } = await supabase.functions.invoke('transcribe-audio', {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // const data = await response.json();
      if (data.ok) {
        console.log('Transcription:', data.text);
        // You can display the transcription to the user here
      } else {
        console.error('Transcription error:', data);
        // Handle error display here
      }
    } catch (error) {
      console.error('Network or server error:', error);
      // Handle error display here
    }
  };

  return (
    <div className={className}>
      <Card className={`border-2 border-dashed transition-colors ${
        dragActive 
          ? "border-blue-400 bg-blue-50" 
          : selectedFile 
            ? "border-green-400 bg-green-50" 
            : "border-gray-300 hover:border-gray-400"
      }`}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Audio File Upload
          </CardTitle>
          <CardDescription>
            Upload your meeting recording (.mp3, .m4a, or .wav format, max 100MB)
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Error Alert */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Selected File Display */}
          {selectedFile && (
            <div className="flex items-center justify-between p-4 bg-white rounded-lg border">
              <div className="flex items-center gap-3">
                {getFileIcon(selectedFile.name)}
                <div>
                  <p className="font-medium text-sm text-black">{selectedFile.name}</p>
                  <p className="text-xs text-gray-500">
                    {formatFileSize(selectedFile.size)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {isUploading ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                    <span className="text-sm text-blue-600">Uploading...</span>
                  </div>
                ) : (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onFileRemove}
                  disabled={isUploading}
                  className="h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Upload Progress */}
          {isUploading && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Uploading...</span>
                <span>{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} className="h-2" />
            </div>
          )}

          {/* Upload Area */}
          {!selectedFile && (
            <div
              className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragActive 
                  ? "border-blue-400 bg-blue-50" 
                  : "border-gray-300 hover:border-gray-400"
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".mp3,.m4a,.wav,audio/mpeg,audio/x-m4a,audio/wav"
                onChange={handleInputChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                disabled={isUploading}
              />
              
              <div className="space-y-4">
                <div className="flex justify-center">
                  <div className="p-4 bg-gray-100 rounded-full">
                    <Upload className="h-8 w-8 text-gray-600" />
                  </div>
                </div>
                
                <div>
                  <p className="text-lg font-medium text-gray-900">
                    Drop your audio file here
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    or click to browse files
                  </p>
                </div>
                
                <div className="text-xs text-gray-400 space-y-1">
                  <p>Supported formats: .mp3, .m4a, .wav</p>
                  <p>Maximum file size: 100MB</p>
                </div>
              </div>
            </div>
          )}

          {/* Manual Upload Button */}
          {!selectedFile && (
            <div className="flex justify-center">
              <Button
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="w-full max-w-xs"
              >
                <Upload className="h-4 w-4 mr-2" />
                Choose Audio File
              </Button>
            </div>
          )}

          {selectedFile && !isUploading && (
            <Button onClick={handleTranscribe}className="bg-black text-white hover:bg-gray-900">
              Transcribe Audio
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AudioFileUpload; 