import { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Upload, 
  FileAudio, 
  X, 
  CheckCircle, 
  AlertCircle,
  Loader2,
  Play,
  Pause,
  Volume2,
  Download,
  Trash2,
  RefreshCw
} from 'lucide-react';
import { useAudioUpload } from '@/hooks/useAudioUpload';

interface AudioFileUploadProps {
  onFileSelect?: (file: File) => void;
  onUploadComplete?: (url: string) => void;
  maxSize?: number; // in MB
  acceptedFormats?: string[];
  className?: string;
}

const AudioFileUpload = ({
  onFileSelect,
  onUploadComplete,
  maxSize = 100,
  acceptedFormats = ['.mp3', '.m4a', '.wav'],
  className = ''
}: AudioFileUploadProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { uploadAudioFile, isUploading, uploadProgress } = useAudioUpload();

  const handleFileSelect = useCallback((file: File) => {
    // Validate file type
    const isValidFormat = acceptedFormats.some(format => 
      file.name.toLowerCase().endsWith(format.replace('.', ''))
    );
    
    if (!isValidFormat) {
      alert(`Please select a valid audio file. Accepted formats: ${acceptedFormats.join(', ')}`);
        return;
    }

    // Validate file size
    if (file.size > maxSize * 1024 * 1024) {
      alert(`File size must be less than ${maxSize}MB`);
      return;
    }

    setSelectedFile(file);
    onFileSelect?.(file);

    // Create audio URL for preview
    const url = URL.createObjectURL(file);
    setAudioUrl(url);
    setCurrentTime(0);
    setIsPlaying(false);
  }, [acceptedFormats, maxSize, onFileSelect]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, [handleFileSelect]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleUpload = async () => {
    if (!selectedFile) return;

    try {
      const result = await uploadAudioFile(selectedFile);
      if (result.success && result.url) {
        onUploadComplete?.(result.url);
      }
    } catch (error) {
      console.error('Upload failed:', error);
    }
  };

  const handlePlayPause = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const removeFile = () => {
    setSelectedFile(null);
    setAudioUrl(null);
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Upload Area */}
      <Card className="bg-gradient-to-br from-gray-800/50 to-gray-700/30 backdrop-blur-sm border border-gray-700/50 shadow-xl hover:shadow-2xl transition-all duration-300">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Upload className="h-5 w-5 text-blue-400" />
            Audio File Upload
          </CardTitle>
          <CardDescription className="text-gray-300">
            Upload your meeting recording (.mp3, .m4a, or .wav format, max {maxSize}MB)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!selectedFile ? (
            <div
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
                isDragOver
                  ? 'border-blue-400 bg-blue-500/10'
                  : 'border-gray-600 hover:border-gray-500 hover:bg-gray-700/20'
              }`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
            >
              <div className="space-y-4">
                <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full flex items-center justify-center border border-blue-500/30">
                  <FileAudio className="h-8 w-8 text-blue-400" />
                </div>
                
                <div>
                  <p className="text-lg font-medium text-white mb-2">
                    Drop your audio file here
                  </p>
                  <p className="text-gray-400 mb-4">or click to browse files</p>
                  
                  <div className="space-y-2 text-sm text-gray-400">
                    <p>Supported formats: {acceptedFormats.join(', ')}</p>
                    <p>Maximum file size: {maxSize}MB</p>
                  </div>
                </div>
                
              <Button
                onClick={() => fileInputRef.current?.click()}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Upload className="h-4 w-4 mr-2" />
                Choose Audio File
              </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* File Info */}
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-sm rounded-lg border border-blue-500/20">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-500/20 rounded-lg">
                    <FileAudio className="h-5 w-5 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-lg font-medium text-white">
                      {selectedFile.name}
                    </p>
                    <p className="text-sm text-gray-300">
                      {formatFileSize(selectedFile.size)}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Badge className="bg-green-500/20 text-green-400 border border-green-400/30">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Selected
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={removeFile}
                    className="text-gray-400 hover:text-red-400 hover:bg-red-500/20"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Audio Player */}
              {audioUrl && (
                <div className="bg-gray-700/30 border border-gray-600/30 rounded-lg p-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handlePlayPause}
                          className="text-gray-300 hover:text-white hover:bg-gray-600/50"
                        >
                          {isPlaying ? (
                            <Pause className="h-4 w-4" />
                          ) : (
                            <Play className="h-4 w-4" />
                          )}
                        </Button>
                        <Volume2 className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-300">Preview</span>
                      </div>
                      <span className="text-sm text-gray-400">
                        {formatTime(currentTime)} / {formatTime(duration)}
                      </span>
                    </div>
                    
                    <div className="space-y-2">
                      <input
                        type="range"
                        min="0"
                        max={duration || 0}
                        value={currentTime}
                        onChange={handleSeek}
                        className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
                      />
                      <div className="flex justify-between text-xs text-gray-400">
                        <span>0:00</span>
                        <span>{formatTime(duration)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <audio
                    ref={audioRef}
                    src={audioUrl}
                    onTimeUpdate={handleTimeUpdate}
                    onLoadedMetadata={handleLoadedMetadata}
                    onEnded={() => setIsPlaying(false)}
                    className="hidden"
                  />
                </div>
              )}

              {/* Upload Progress */}
              {isUploading && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-300">Uploading...</span>
                    <span className="text-gray-400">{uploadProgress}%</span>
                  </div>
                  <Progress value={uploadProgress} className="h-2" />
            </div>
          )}

              {/* Action Buttons */}
              <div className="flex gap-3">
            <Button 
                  onClick={handleUpload}
                  disabled={isUploading}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
            >
                  {isUploading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Uploading...
                </>
              ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      Upload File
                    </>
              )}
            </Button>
                
                <Button
                  variant="outline"
                  onClick={removeFile}
                  disabled={isUploading}
                  className="border-gray-600 text-gray-300 hover:bg-gray-700/50 hover:text-white"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={acceptedFormats.join(',')}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            handleFileSelect(file);
          }
        }}
        className="hidden"
      />
    </div>
  );
};

export default AudioFileUpload; 