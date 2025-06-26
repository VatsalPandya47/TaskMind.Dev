// Simple CORS proxy server
import express from 'express';
import cors from 'cors';
import multer from 'multer';
import fetch from 'node-fetch';
import { createProxyMiddleware } from 'http-proxy-middleware';

const app = express();
const port = 3001;

// Enable CORS for all routes
app.use(cors());

// Configure multer for file uploads
const upload = multer({ storage: multer.memoryStorage() });

// Increase timeout for large file uploads
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Proxy middleware configuration
const proxyOptions = {
  target: 'https://jsxupnogyvfynjgkwdyj.supabase.co',
  changeOrigin: true,
  timeout: 300000, // 5 minutes
  proxyTimeout: 300000, // 5 minutes
  onError: (err, req, res) => {
    console.error('Proxy error:', err);
    res.status(500).json({ error: 'Proxy error', details: err.message });
  },
  onProxyReq: (proxyReq, req, res) => {
    // Log the request for debugging
    console.log(`Proxying ${req.method} ${req.path} to ${proxyOptions.target}`);
    
    // Set longer timeout for transcription requests
    if (req.path.includes('transcribe-audio')) {
      proxyReq.setHeader('Connection', 'keep-alive');
    }
  },
  onProxyRes: (proxyRes, req, res) => {
    console.log(`Received response: ${proxyRes.statusCode} for ${req.path}`);
  }
};

// Apply proxy to all routes
app.use('/', createProxyMiddleware(proxyOptions));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(port, () => {
  console.log(`CORS proxy server running on http://localhost:${port}`);
  console.log(`Proxying requests to: ${proxyOptions.target}`);
}); 