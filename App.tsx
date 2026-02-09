import React, { useState } from 'react';
import { Dashboard } from './components/Dashboard';
import { VideoRecorder } from './components/VideoRecorder';
import { ReviewScreen } from './components/ReviewScreen';
import { SuccessScreen } from './components/SuccessScreen';
import { AppView, UserStats, VideoMetadata, Tag } from './types';

export default function App() {
  const [view, setView] = useState<AppView>('DASHBOARD');
  const [currentRecording, setCurrentRecording] = useState<{
    blob: Blob;
    previewUrl: string;
    frameBase64: string;
    duration: number;
  } | null>(null);
  
  const [lastEarnings, setLastEarnings] = useState(0);

  // Mock State
  const [stats, setStats] = useState<UserStats>({
    totalEarnings: 124.50,
    totalVideos: 12,
    pendingPayout: 45.20
  });

  const [recentVideos, setRecentVideos] = useState<VideoMetadata[]>([
    {
      id: 'v1',
      description: 'AC Unit Filter Replacement',
      earnings: 4.50,
      duration: 45,
      tags: [{id: 't1', label: 'HVAC'}, {id: 't2', label: 'Maintenance'}],
      category: 'HVAC',
      createdAt: new Date(Date.now() - 86400000)
    }
  ]);

  const handleStartRecording = () => {
    setView('RECORDER');
  };

  const handleRecordingComplete = (blob: Blob, previewUrl: string, frameBase64: string, duration: number) => {
    setCurrentRecording({ blob, previewUrl, frameBase64, duration });
    setView('REVIEW');
  };

  const handleCancelRecording = () => {
    setCurrentRecording(null);
    setView('DASHBOARD');
  };

  const handleDiscardReview = () => {
    if (currentRecording) {
      URL.revokeObjectURL(currentRecording.previewUrl);
    }
    setCurrentRecording(null);
    setView('DASHBOARD'); // Or back to RECORDER? Dashboard is safer to clear state.
  };

  const handleSubmitVideo = (data: { tags: string[], description: string, earnings: number, duration: number }) => {
    // Simulate Upload
    setTimeout(() => {
      const newVideo: VideoMetadata = {
        id: Date.now().toString(),
        description: data.description,
        earnings: data.earnings,
        duration: data.duration,
        tags: data.tags.map((t, i) => ({ id: `new-${i}`, label: t })),
        category: 'General',
        createdAt: new Date()
      };

      setStats(prev => ({
        totalEarnings: prev.totalEarnings + data.earnings,
        totalVideos: prev.totalVideos + 1,
        pendingPayout: prev.pendingPayout + data.earnings
      }));

      setRecentVideos(prev => [newVideo, ...prev]);
      setLastEarnings(data.earnings);
      
      // Cleanup
      if (currentRecording) {
        URL.revokeObjectURL(currentRecording.previewUrl);
      }
      
      setView('SUCCESS');
    }, 1500); // Fake network delay
  };

  return (
    <div className="w-full h-[100dvh] max-w-md mx-auto bg-white shadow-2xl overflow-hidden relative">
      {view === 'DASHBOARD' && (
        <Dashboard 
          stats={stats} 
          recentVideos={recentVideos} 
          onStartRecording={handleStartRecording} 
        />
      )}

      {view === 'RECORDER' && (
        <VideoRecorder 
          onRecordingComplete={handleRecordingComplete}
          onCancel={handleCancelRecording}
        />
      )}

      {view === 'REVIEW' && currentRecording && (
        <ReviewScreen 
          previewUrl={currentRecording.previewUrl}
          frameBase64={currentRecording.frameBase64}
          duration={currentRecording.duration}
          onDiscard={handleDiscardReview}
          onSubmit={handleSubmitVideo}
        />
      )}

      {view === 'SUCCESS' && (
        <SuccessScreen 
          amount={lastEarnings} 
          onClose={() => {
            setView('DASHBOARD');
            setCurrentRecording(null);
          }} 
        />
      )}
    </div>
  );
}