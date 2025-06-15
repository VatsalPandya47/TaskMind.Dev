
import React from "react";

interface SimpleCaptchaProps {
  checked: boolean;
  setChecked: (value: boolean) => void;
  error?: string;
}

const SimpleCaptcha: React.FC<SimpleCaptchaProps> = ({ checked, setChecked, error }) => (
  <div className="flex flex-col items-center gap-2 my-6">
    <label className="flex items-center space-x-3 cursor-pointer select-none">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => setChecked(e.target.checked)}
        className="w-5 h-5 border-gray-300 text-blue-600 rounded focus:ring-blue-500 focus:ring-2"
      />
      <span className="text-base font-medium text-gray-700">
        I'm not a robot
      </span>
      <span className="ml-2" aria-label="robot emoji" title="robot">🤖</span>
    </label>
    {error && <span className="text-sm text-red-500">{error}</span>}
  </div>
);

export default SimpleCaptcha;
