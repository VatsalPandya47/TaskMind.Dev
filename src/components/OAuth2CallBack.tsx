// src/pages/OAuth2Callback.tsx
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

export default function OAuth2Callback() {
  const [searchParams] = useSearchParams();
  const code = searchParams.get("code");

  useEffect(() => {
    if (code) {
      // Send code to backend to exchange for tokens
      // fetch('/api/exchange-code', { ... })
    }
  }, [code]);

  return <div>Processing Google OAuth...</div>;
}