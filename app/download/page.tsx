'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function DownloadPage() {
  const [key, setKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'error' | 'success'>('idle');
  const [message, setMessage] = useState('');
  const [downloadUrl, setDownloadUrl] = useState('');

  const handleVerify = async () => {
    if (!key.trim()) {
      setStatus('error');
      setMessage('Please enter your license key');
      return;
    }

    setLoading(true);
    setStatus('idle');

    try {
      const res = await fetch('/api/verify-key', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus('success');
        setMessage('Key verified! Your download link is ready. (Link expires in 1 hour)');
        setDownloadUrl(data.downloadUrl);
      } else {
        setStatus('error');
        setMessage(data.error || 'Invalid, inactive, or expired license key');
        setKey('');
      }
    } catch (err) {
      setStatus('error');
      setMessage('Error verifying key. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-black to-slate-950 flex items-center justify-center px-4 py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <Card className="p-8">
          <h1 className="text-3xl font-bold text-white mb-2">Download Mod</h1>
          <p className="text-white/60 mb-8">Enter your license key to get a secure download link</p>

          <div className="space-y-4">
            <Input
              label="License Key"
              placeholder="XXXX-XXXX-XXXX-XXXX"
              value={key}
              onChange={(e) => setKey(e.target.value.toUpperCase())}
              disabled={loading}
              onKeyPress={(e) => e.key === 'Enter' && handleVerify()}
            />

            <Button
              variant="primary"
              onClick={handleVerify}
              disabled={loading}
              className="w-full"
            >
              {loading ? 'Verifying...' : 'Get Download Link'}
            </Button>
          </div>

          {status === 'error' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-4 bg-red-500/20 border border-red-500/50 rounded-lg"
            >
              <p className="text-red-400 text-sm">{message}</p>
            </motion.div>
          )}

          {status === 'success' && downloadUrl && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-4 bg-green-500/20 border border-green-500/50 rounded-lg"
            >
              <p className="text-green-400 text-sm mb-4">{message}</p>
              <p className="text-white/70 text-xs mb-3 p-2 bg-black/30 rounded">
                ⚠️ Each link can only be used once. Generate a new one if needed.
              </p>
              <a href={downloadUrl}>
                <Button variant="primary" className="w-full">
                  📥 Download Now
                </Button>
              </a>
            </motion.div>
          )}

          <div className="mt-8 pt-8 border-t border-white/10">
            <p className="text-white/60 text-sm mb-4">Don't have a key? Purchase on Discord!</p>
            <Button
              variant="secondary"
              className="w-full"
              onClick={() => window.location.href = 'https://discord.gg/your-discord'}
            >
              Join Discord
            </Button>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
