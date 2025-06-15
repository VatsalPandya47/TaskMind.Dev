import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

const sendToEdgeFunction = async (email: string): Promise<{ success?: boolean; error?: string }> => {
  try {
    const res = await fetch("https://jsxupnogyvfynjgkwdyj.functions.supabase.co/send-early-access", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const json = await res.json();
    return json;
  } catch (err: any) {
    return { error: "Failed to submit" };
  }
};

const EarlyAccessForm = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { success, error } = await sendToEdgeFunction(email);

    setLoading(false);

    if (success) {
      setSubmitted(true);
      toast({
        title: "Success",
        description: "Thanks! Your request has been sent. We'll be in touch soon.",
      });
    } else {
      toast({
        title: "Submission failed",
        description: error || "Something went wrong. Please try again later.",
        variant: "destructive",
      });
    }
  };

  return (
    <section className="w-full py-20 bg-gray-50 flex items-center justify-center" id="early-access">
      <div className="max-w-lg w-full bg-white border rounded-xl p-8 shadow-md">
        <h3 className="text-2xl font-bold mb-4 text-gray-900 text-center">Get Early Access</h3>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            type="email"
            required
            placeholder="Your email…"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="text-base"
            disabled={submitted || loading}
          />
          <Button
            type="submit"
            className="px-8 py-3 font-medium"
            disabled={submitted || loading}
          >
            {submitted ? "Submitted!" : loading ? "Submitting…" : "Request Early Access"}
          </Button>
        </form>
        {submitted && (
          <div className="text-green-600 mt-4 text-center text-base">
            Thanks! We’ll be in touch soon.
          </div>
        )}
      </div>
    </section>
  );
};

export default EarlyAccessForm;
