import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Camera, StopCircle, RotateCcw, ArrowRight, Video } from 'lucide-react';
import { Button } from './Button';

interface VideoRecorderProps {
  onRecordingComplete: (blob: Blob, previewUrl: string, frameBase64: string, duration: number) => void;
  onCancel: () => void;
}

export const VideoRecorder: React.FC<VideoRecorderProps> = ({ onRecordingComplete, onCancel }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const startTimeRef = useRef<number>(0);
  const selectedMimeTypeRef = useRef<string>('');
  
  const [isRecording, setIsRecording] = useState(false);
  const [duration, setDuration] = useState(0);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [timerInterval, setTimerInterval] = useState<number | null>(null);

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
      if (timerInterval) window.clearInterval(timerInterval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startCamera = async () => {
    try {
      // Don't enforce aspect ratio on mobile to allow native sensor usage (prevents crop/errors)
      const constraints: MediaStreamConstraints = { 
        video: { 
          facingMode: 'environment'
        }, 
        audio: true 
      };

      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      setError("Could not access camera. Please allow permissions.");
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
  };

  const startRecording = () => {
    if (!stream) return;
    
    chunksRef.current = [];
    
    // Improved MIME type detection for Mobile Safari/Chrome
    const mimeTypes = [
      'video/mp4; codecs="avc1.42E01E, mp4a.40.2"',
      'video/mp4',
      'video/webm;codecs=vp9,opus',
      'video/webm;codecs=vp8,opus',
      'video/webm'
    ];

    let mimeType = mimeTypes.find(type => MediaRecorder.isTypeSupported(type)) || '';
    
    if (!mimeType) {
      console.warn("No preferred mimeType supported, letting browser decide");
    }

    selectedMimeTypeRef.current = mimeType;

    try {
      const options = mimeType ? { mimeType } : undefined;
      const recorder = new MediaRecorder(stream, options);
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.start();
      setIsRecording(true);
      startTimeRef.current = Date.now();
      
      const interval = window.setInterval(() => {
        setDuration(Math.floor((Date.now() - startTimeRef.current) / 1000));
      }, 1000);
      setTimerInterval(interval);
    } catch (err) {
      console.error("Failed to start MediaRecorder:", err);
      setError("Failed to start recording. Please try a different browser.");
    }
  };

  const stopRecording = () => {
    if (!mediaRecorderRef.current) return;

    mediaRecorderRef.current.onstop = () => {
      // Use the actual MIME type for blob creation to avoid playback errors
      const blob = new Blob(chunksRef.current, { type: selectedMimeTypeRef.current || 'video/webm' });
      const url = URL.createObjectURL(blob);
      
      // Capture a frame for AI analysis
      const canvas = document.createElement('canvas');
      if (videoRef.current) {
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        canvas.getContext('2d')?.drawImage(videoRef.current, 0, 0);
        const frameBase64 = canvas.toDataURL('image/jpeg', 0.8);
        
        onRecordingComplete(blob, url, frameBase64, duration);
      }
    };

    mediaRecorderRef.current.stop();
    setIsRecording(false);
    if (timerInterval) window.clearInterval(timerInterval);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 text-center space-y-4">
        <div className="bg-red-100 p-4 rounded-full text-red-600">
          <Video size={48} />
        </div>
        <h3 className="text-xl font-bold text-slate-800">Camera Error</h3>
        <p className="text-slate-600">{error}</p>
        <Button onClick={onCancel} variant="secondary">Go Back</Button>
      </div>
    );
  }

  return (
    <div className="relative h-full bg-black flex flex-col">
      {/* Camera Feed */}
      <div className="flex-1 relative overflow-hidden rounded-b-3xl">
        <video 
          ref={videoRef} 
          autoPlay 
          playsInline 
          muted 
          className="w-full h-full object-cover transform" 
        />
        
        {/* Overlay UI */}
        <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-start bg-gradient-to-b from-black/50 to-transparent z-10">
          <button onClick={onCancel} className="text-white bg-white/20 p-2 rounded-full backdrop-blur-sm">
            <RotateCcw size={20} />
          </button>
          <div className="bg-red-500/90 text-white px-3 py-1 rounded-full text-sm font-mono font-bold flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full bg-white ${isRecording ? 'animate-pulse' : ''}`} />
            {formatTime(duration)}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="h-32 bg-slate-900 flex items-center justify-center relative shrink-0">
        {!isRecording ? (
          <button 
            onClick={startRecording}
            className="w-20 h-20 rounded-full border-4 border-white flex items-center justify-center bg-red-500 hover:bg-red-600 transition-all transform hover:scale-105"
          >
            <div className="w-8 h-8 rounded bg-white/20 opacity-0 hover:opacity-100 transition-opacity" />
          </button>
        ) : (
           <button 
            onClick={stopRecording}
            className="relative w-20 h-20 rounded-full border-4 border-white flex items-center justify-center bg-transparent ring-animate"
          >
             <div className="w-8 h-8 rounded-lg bg-red-500" />
          </button>
        )}
        
        <div className="absolute right-8 top-1/2 -translate-y-1/2 text-white/50 text-sm font-medium">
          {isRecording ? 'Recording...' : 'Tap to Record'}
        </div>
      </div>
    </div>
  );
};