
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const EarlyAccessForm = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true); // Dummy, no backend
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
            disabled={submitted}
          />
          <Button
            type="submit"
            className="px-8 py-3 font-medium"
            disabled={submitted}
          >
            {submitted ? "Submitted!" : "Request Early Access"}
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
