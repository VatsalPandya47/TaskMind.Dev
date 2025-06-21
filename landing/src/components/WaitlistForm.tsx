
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowRight, CheckCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface WaitlistFormProps {
  onSuccess?: () => void;
}

const WaitlistForm = ({ onSuccess }: WaitlistFormProps) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: "Email required",
        description: "Please enter your email address.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase
        .from('waitlist')
        .insert([
          {
            email: email.trim(),
            name: name.trim() || null,
            source: 'hero_button'
          }
        ]);

      if (error) {
        if (error.code === '23505') { // Unique constraint violation
          toast({
            title: "Already signed up!",
            description: "You're already on our waitlist. We'll be in touch soon!",
          });
        } else {
          throw error;
        }
      } else {
        // Send notification email
        try {
          await supabase.functions.invoke('send-notification', {
            body: {
              type: 'waitlist',
              email: email.trim(),
              name: name.trim() || undefined,
              source: 'hero_button'
            }
          });
        } catch (notificationError) {
          console.log('Failed to send notification:', notificationError);
          // Don't fail the signup if notification fails
        }

        setIsSuccess(true);
        toast({
          title: "Welcome to the waitlist!",
          description: "We'll notify you as soon as TaskMind is ready.",
        });
        onSuccess?.();
      }
    } catch (error) {
      console.error('Waitlist signup error:', error);
      toast({
        title: "Something went wrong",
        description: "Please try again or contact us directly.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="max-w-md mx-auto text-center">
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-green-800 mb-2">
            You're on the list!
          </h3>
          <p className="text-green-700">
            We'll email you as soon as TaskMind is ready for early access.
          </p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Name (optional)</Label>
        <Input
          id="name"
          type="text"
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="email">Email *</Label>
        <Input
          id="email"
          type="email"
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full"
        />
      </div>

      <Button 
        type="submit" 
        size="lg" 
        className="w-full bg-black text-white hover:bg-gray-800"
        disabled={isLoading}
      >
        {isLoading ? (
          "Joining..."
        ) : (
          <>
            <ArrowRight className="mr-2" size={20} />
            Join Waitlist
          </>
        )}
      </Button>
    </form>
  );
};

export default WaitlistForm;
