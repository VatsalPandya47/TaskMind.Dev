import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw, CheckCircle, XCircle } from 'lucide-react';

interface SimpleCaptchaProps {
  onVerify: (isValid: boolean) => void;
  className?: string;
}

const SimpleCaptcha = ({ onVerify, className = '' }: SimpleCaptchaProps) => {
  const [captcha, setCaptcha] = useState({ question: '', answer: '' });
  const [userAnswer, setUserAnswer] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const generateCaptcha = () => {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    const operators = ['+', '-', '×'];
    const operator = operators[Math.floor(Math.random() * operators.length)];
    
    let answer;
    let question;
    
    switch (operator) {
      case '+':
        answer = num1 + num2;
        question = `${num1} + ${num2}`;
        break;
      case '-':
        answer = num1 - num2;
        question = `${num1} - ${num2}`;
        break;
      case '×':
        answer = num1 * num2;
        question = `${num1} × ${num2}`;
        break;
      default:
        answer = num1 + num2;
        question = `${num1} + ${num2}`;
    }
    
    setCaptcha({ question, answer: answer.toString() });
    setUserAnswer('');
    setIsVerified(false);
    setIsCorrect(false);
  };

  const verifyAnswer = () => {
    const correct = userAnswer.trim() === captcha.answer;
    setIsCorrect(correct);
    setIsVerified(true);
    onVerify(correct);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      verifyAnswer();
    }
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

  return (
    <div className={`bg-gradient-to-br from-gray-800/50 to-gray-700/30 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 shadow-xl hover:shadow-2xl transition-all duration-300 ${className}`}>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">Security Check</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={generateCaptcha}
            className="text-gray-400 hover:text-white hover:bg-gray-700/50"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-sm rounded-lg p-4 border border-blue-500/20">
          <p className="text-sm text-gray-300 mb-2">Please solve this simple math problem:</p>
          <div className="text-2xl font-bold text-white text-center mb-4">
            {captcha.question} = ?
          </div>
          
          <div className="flex gap-2">
            <input
              type="text"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter your answer"
              className={`flex-1 px-3 py-2 rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 ${
                isVerified 
                  ? isCorrect 
                    ? 'bg-green-500/20 text-green-400 border-green-400/30' 
                    : 'bg-red-500/20 text-red-400 border-red-400/30'
                  : 'bg-gray-700/50 text-white border-gray-600/50 hover:border-gray-500/50'
              }`}
            />
            <Button
              onClick={verifyAnswer}
              disabled={!userAnswer.trim() || isVerified}
              className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                isVerified
                  ? isCorrect
                    ? 'bg-green-500/20 text-green-400 border border-green-400/30 hover:bg-green-500/30'
                    : 'bg-red-500/20 text-red-400 border border-red-400/30 hover:bg-red-500/30'
                  : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl'
              }`}
            >
              {isVerified ? (
                isCorrect ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  <XCircle className="h-4 w-4" />
                )
              ) : (
                'Verify'
              )}
            </Button>
          </div>
          
          {isVerified && (
            <div className={`mt-3 p-3 rounded-lg border ${
              isCorrect 
                ? 'bg-green-500/20 text-green-400 border-green-400/30' 
                : 'bg-red-500/20 text-red-400 border-red-400/30'
            }`}>
              <div className="flex items-center gap-2">
                {isCorrect ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  <XCircle className="h-4 w-4" />
                )}
                <span className="text-sm font-medium">
                  {isCorrect ? 'Correct! You can proceed.' : `Incorrect. The answer is ${captcha.answer}.`}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SimpleCaptcha;
