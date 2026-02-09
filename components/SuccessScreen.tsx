import React, { useEffect } from 'react';
import { Check, ArrowRight } from 'lucide-react';
import { Button } from './Button';

interface SuccessScreenProps {
  amount: number;
  onClose: () => void;
}

export const SuccessScreen: React.FC<SuccessScreenProps> = ({ amount, onClose }) => {
  useEffect(() => {
    // Simple haptic feedback if available
    if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
  }, []);

  return (
    <div className="h-full flex flex-col items-center justify-center p-8 bg-emerald-600 text-white relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
         <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
         <div className="absolute bottom-10 right-10 w-64 h-64 bg-emerald-400/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 flex flex-col items-center text-center space-y-8 animate-in fade-in zoom-in duration-500">
        <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-xl shadow-emerald-900/20">
          <Check size={48} className="text-emerald-600" strokeWidth={3} />
        </div>
        
        <div className="space-y-2">
          <h2 className="text-3xl font-bold">Upload Complete!</h2>
          <p className="text-emerald-100">Your footage has been securely banked.</p>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 w-full max-w-xs border border-white/20">
          <p className="text-emerald-100 text-sm font-medium mb-1 uppercase tracking-widest">You Earned</p>
          <div className="text-5xl font-bold text-white tracking-tight">
            ${amount.toFixed(2)}
          </div>
        </div>

        <Button 
          onClick={onClose} 
          className="w-full max-w-xs bg-white text-emerald-700 hover:bg-emerald-50 border-transparent shadow-lg"
        >
          Back to Dashboard
        </Button>
      </div>
    </div>
  );
};
