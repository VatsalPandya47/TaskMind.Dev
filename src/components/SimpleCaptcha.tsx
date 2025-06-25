import React from "react";
import { Shield, Check } from "lucide-react";

interface SimpleCaptchaProps {
  checked: boolean;
  setChecked: (value: boolean) => void;
  error?: string;
}

const SimpleCaptcha: React.FC<SimpleCaptchaProps> = ({ checked, setChecked, error }) => (
  <div className="flex flex-col items-center gap-3 my-6">
    <label className="flex items-center space-x-3 cursor-pointer select-none group">
      <div className="relative">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => setChecked(e.target.checked)}
          className="sr-only"
        />
        <div className={`
          w-6 h-6 border-2 rounded-lg flex items-center justify-center transition-all duration-200
          ${checked 
            ? 'bg-gradient-to-r from-blue-600 to-indigo-600 border-blue-600 shadow-lg' 
            : 'bg-white border-gray-300 group-hover:border-blue-400 group-hover:shadow-sm'
          }
        `}>
          {checked && (
            <Check className="h-4 w-4 text-white animate-in zoom-in-50 duration-200" />
          )}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Shield className="h-5 w-5 text-blue-600" />
        <span className="text-base font-medium text-gray-700 group-hover:text-gray-900 transition-colors">
          I'm not a robot
        </span>
        <span className="ml-1 text-lg" aria-label="robot emoji" title="robot">🤖</span>
      </div>
    </label>
    {error && (
      <div className="flex items-center gap-2 text-sm text-red-500 bg-red-50 px-3 py-2 rounded-lg border border-red-200">
        <Shield className="h-4 w-4" />
        {error}
      </div>
    )}
  </div>
);

export default SimpleCaptcha;
