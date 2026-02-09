import React from 'react';
import { Camera, TrendingUp, History, User, Wallet, Video } from 'lucide-react';
import { Button } from './Button';
import { UserStats, VideoMetadata } from '../types';

interface DashboardProps {
  stats: UserStats;
  recentVideos: VideoMetadata[];
  onStartRecording: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ stats, recentVideos, onStartRecording }) => {
  return (
    <div className="flex flex-col h-full bg-slate-50 overflow-y-auto">
      {/* Header */}
      <header className="bg-emerald-600 text-white p-6 pb-12 rounded-b-[2.5rem] shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-8 -mt-8 blur-2xl"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/10 rounded-full -ml-4 -mb-4 blur-xl"></div>
        
        <div className="relative z-10 flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
             <div className="bg-white/20 p-2 rounded-lg backdrop-blur-md">
                <Video size={20} className="text-white" />
             </div>
             <h1 className="text-xl font-bold tracking-tight">VideoBank</h1>
          </div>
          <div className="w-10 h-10 rounded-full bg-emerald-500 border-2 border-emerald-400 flex items-center justify-center text-emerald-50">
            <User size={20} />
          </div>
        </div>

        <div className="relative z-10">
          <p className="text-emerald-100 text-sm font-medium mb-1">Total Earnings</p>
          <div className="flex items-baseline gap-1">
            <span className="text-4xl font-bold">${stats.totalEarnings.toFixed(2)}</span>
            <span className="text-emerald-200 text-sm">USD</span>
          </div>
          <div className="mt-4 flex gap-4 text-xs font-medium text-emerald-100">
             <div className="bg-white/10 px-3 py-1.5 rounded-full flex items-center gap-1.5">
                <Video size={14} /> {stats.totalVideos} Videos
             </div>
             <div className="bg-white/10 px-3 py-1.5 rounded-full flex items-center gap-1.5">
                <TrendingUp size={14} /> Top 5% Earner
             </div>
          </div>
        </div>
      </header>

      <main className="flex-1 p-6 -mt-8 relative z-20 space-y-6">
        
        {/* Main Action */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col items-center text-center space-y-4">
          <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 mb-2">
            <Camera size={32} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-800">Record New Job</h2>
            <p className="text-slate-500 text-sm">Capture your expertise and get paid.</p>
          </div>
          <Button onClick={onStartRecording} className="w-full">
            Start Camera
          </Button>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
           <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
              <div className="flex items-center gap-2 text-slate-500 mb-2">
                 <Wallet size={16} />
                 <span className="text-xs font-medium">Pending Payout</span>
              </div>
              <p className="text-xl font-bold text-slate-800">${stats.pendingPayout.toFixed(2)}</p>
           </div>
           <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
              <div className="flex items-center gap-2 text-slate-500 mb-2">
                 <TrendingUp size={16} />
                 <span className="text-xs font-medium">Avg. Rate</span>
              </div>
              <p className="text-xl font-bold text-slate-800">$0.35<span className="text-xs text-slate-400 font-normal">/min</span></p>
           </div>
        </div>

        {/* Recent History */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-slate-800 font-bold flex items-center gap-2">
              <History size={18} className="text-emerald-600" /> Recent Uploads
            </h3>
            <button className="text-xs text-emerald-600 font-medium hover:underline">View All</button>
          </div>
          
          <div className="space-y-3">
            {recentVideos.length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-sm bg-white rounded-xl border border-slate-100 border-dashed">
                No videos yet. Start recording!
              </div>
            ) : (
              recentVideos.map((video) => (
                <div key={video.id} className="bg-white p-3 rounded-xl shadow-sm border border-slate-100 flex gap-3">
                  <div className="w-16 h-16 bg-slate-200 rounded-lg overflow-hidden shrink-0 relative">
                     {/* Placeholder for thumbnail */}
                     <div className="absolute inset-0 flex items-center justify-center text-slate-400">
                        <Video size={20} />
                     </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <h4 className="font-semibold text-slate-800 truncate text-sm">{video.description}</h4>
                      <span className="text-emerald-600 font-bold text-sm">+${video.earnings.toFixed(2)}</span>
                    </div>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {video.tags.slice(0, 2).map((tag, i) => (
                        <span key={i} className="text-[10px] px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded-md">
                          {tag.label}
                        </span>
                      ))}
                      {video.tags.length > 2 && <span className="text-[10px] text-slate-400">+{video.tags.length - 2}</span>}
                    </div>
                    <p className="text-[10px] text-slate-400 mt-2">{new Date(video.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
};
