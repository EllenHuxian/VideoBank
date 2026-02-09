import React, { useState, useEffect } from 'react';
import { Tag, Sparkles, X, Check, DollarSign, UploadCloud } from 'lucide-react';
import { Button } from './Button';
import { generateTagsAndDescription } from '../services/geminiService';
import { Tag as TagType } from '../types';

interface ReviewScreenProps {
  previewUrl: string;
  frameBase64: string;
  duration: number;
  onDiscard: () => void;
  onSubmit: (videoData: any) => void;
}

export const ReviewScreen: React.FC<ReviewScreenProps> = ({ 
  previewUrl, 
  frameBase64, 
  duration,
  onDiscard, 
  onSubmit 
}) => {
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [description, setDescription] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [estimatedEarnings, setEstimatedEarnings] = useState(0);

  // Calculate earnings based on duration (Simulated)
  useEffect(() => {
    // Base rate $0.10/sec for expert footage
    const earnings = parseFloat((duration * 0.15).toFixed(2));
    setEstimatedEarnings(earnings < 0.50 ? 0.50 : earnings); // Minimum payout $0.50
  }, [duration]);

  const handleAIAnalysis = async () => {
    setIsGenerating(true);
    try {
      const result = await generateTagsAndDescription(frameBase64);
      setTags(prev => Array.from(new Set([...prev, ...result.tags])));
      if (!description) setDescription(result.description);
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleSubmit = () => {
    onSubmit({
      tags,
      description,
      earnings: estimatedEarnings,
      duration
    });
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 overflow-y-auto">
      {/* Video Preview */}
      <div className="relative w-full aspect-video bg-black shrink-0">
        <video 
          src={previewUrl} 
          controls 
          className="w-full h-full object-contain"
        />
        <button 
          onClick={onDiscard}
          className="absolute top-4 left-4 p-2 bg-black/50 text-white rounded-full hover:bg-black/70"
        >
          <X size={20} />
        </button>
      </div>

      <div className="flex-1 p-6 space-y-6">
        {/* Earnings Card */}
        <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-sm text-emerald-600 font-semibold uppercase tracking-wider">Estimated Payout</p>
            <h2 className="text-3xl font-bold text-emerald-700">${estimatedEarnings.toFixed(2)}</h2>
          </div>
          <div className="bg-emerald-100 p-3 rounded-full text-emerald-600">
            <DollarSign size={24} />
          </div>
        </div>

        {/* AI Action */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <h3 className="text-slate-800 font-semibold text-lg">Details & Tags</h3>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={handleAIAnalysis}
              isLoading={isGenerating}
              icon={<Sparkles size={16} className="text-purple-500" />}
              className="border-purple-200 hover:bg-purple-50 text-purple-700"
            >
              AI Auto-Fill
            </Button>
          </div>
          
          <div className="space-y-3">
             {/* Description Input */}
             <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Description of work</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g. Replacing a capacitor on a HVAC unit..."
                className="w-full p-3 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none resize-none"
                rows={3}
              />
             </div>

            {/* Tag Input */}
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Tags (Press Enter)</label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Add a tag..."
                  className="flex-1 p-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 focus:ring-2 focus:ring-emerald-500 outline-none"
                />
                <button 
                  onClick={handleAddTag}
                  className="p-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200"
                >
                  <Tag size={18} />
                </button>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {tags.map((tag, idx) => (
                  <span key={idx} className="inline-flex items-center gap-1 px-3 py-1 bg-white border border-slate-200 rounded-full text-sm text-slate-700 shadow-sm">
                    {tag}
                    <button onClick={() => removeTag(tag)} className="text-slate-400 hover:text-red-500">
                      <X size={14} />
                    </button>
                  </span>
                ))}
                {tags.length === 0 && (
                  <span className="text-xs text-slate-400 italic">No tags added yet. Try AI Auto-Fill!</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="p-4 bg-white border-t border-slate-100 sticky bottom-0 z-10 safe-area-bottom">
        <Button 
          variant="primary" 
          size="lg" 
          className="w-full shadow-lg shadow-emerald-200"
          onClick={handleSubmit}
          disabled={tags.length === 0 || !description}
        >
          <span className="flex items-center gap-2">
            Upload & Earn ${estimatedEarnings.toFixed(2)} <UploadCloud size={20} />
          </span>
        </Button>
      </div>
    </div>
  );
};
