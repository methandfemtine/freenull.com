'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface Key {
  id: number;
  key: string;
  is_active: number;
  created_at: string;
  label?: string;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [keys, setKeys] = useState<Key[]>([]);
  const [loading, setLoading] = useState(true);
  const [file, setFile] = useState<File | null>(null);
  const [version, setVersion] = useState('');
  const [uploading, setUploading] = useState(false);
  const [generateCount, setGenerateCount] = useState(1);
  const [generating, setGenerating] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchKeys();
  }, []);

  const fetchKeys = async () => {
    try {
      const res = await fetch('/api/admin/keys');
      if (res.status === 401) {
        router.push('/admin');
        return;
      }
      const data = await res.json();
      setKeys(data.keys || []);
    } catch (err) {
      console.error('Error fetching keys:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async () => {
    if (!file) {
      setMessage('Please select a file');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    if (version) formData.append('version', version);

    try {
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        setMessage(`✓ File uploaded: ${data.filename}`);
        setFile(null);
        setVersion('');
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage(`Error: ${data.error}`);
      }
    } catch (err) {
      setMessage('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleGenerateKeys = async () => {
    if (generateCount < 1 || generateCount > 100) {
      setMessage('Generate between 1 and 100 keys');
      return;
    }

    setGenerating(true);

    try {
      const res = await fetch('/api/admin/keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ count: generateCount }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage(`✓ Generated ${data.count} keys`);
        console.log('New keys:', data.keys);
        fetchKeys();
        setGenerateCount(1);
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage(`Error: ${data.error}`);
      }
    } catch (err) {
      setMessage('Generation failed');
    } finally {
      setGenerating(false);
    }
  };

  const toggleKeyStatus = async (key: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/admin/keys/${key}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !currentStatus }),
      });

      if (res.ok) {
        fetchKeys();
      }
    } catch (err) {
      console.error('Error toggling key:', err);
    }
  };

  const deleteKeyFn = async (key: string) => {
    if (!confirm('Delete this key?')) return;

    try {
      const res = await fetch(`/api/admin/keys/${key}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        fetchKeys();
      }
    } catch (err) {
      console.error('Error deleting key:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-black to-slate-950 px-4 py-20">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl font-bold text-white mb-2">Admin Dashboard</h1>
          <p className="text-white/60 mb-12">Manage mod files, keys, and downloads</p>

          {message && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-6 p-4 bg-blue-500/20 border border-blue-500/50 rounded-lg text-blue-400"
            >
              {message}
            </motion.div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
            {/* File Upload Section */}
            <Card>
              <h2 className="text-2xl font-bold text-white mb-6">Upload Mod File</h2>

              <div className="border-2 border-dashed border-white/20 rounded-lg p-8 text-center mb-4 cursor-pointer hover:border-purple-500/50 transition-colors"
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  const droppedFile = e.dataTransfer.files[0];
                  if (droppedFile) setFile(droppedFile);
                }}
              >
                <input
                  type="file"
                  id="file-input"
                  className="hidden"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                />
                <label htmlFor="file-input" className="cursor-pointer">
                  {file ? (
                    <div>
                      <p className="text-white font-semibold">{file.name}</p>
                      <p className="text-white/60 text-sm">Click or drag to change</p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-white/60">📦 Drag file here or click to select</p>
                    </div>
                  )}
                </label>
              </div>

              <Input
                label="Version (optional)"
                placeholder="1.0.0"
                value={version}
                onChange={(e) => setVersion(e.target.value)}
                disabled={uploading}
                className="mb-4"
              />

              <Button
                variant="primary"
                onClick={handleFileUpload}
                disabled={uploading || !file}
                className="w-full"
              >
                {uploading ? 'Uploading...' : 'Upload File'}
              </Button>
            </Card>

            {/* Generate Keys Section */}
            <Card>
              <h2 className="text-2xl font-bold text-white mb-6">Generate Keys</h2>

              <Input
                label="Number of keys to generate"
                type="number"
                min="1"
                max="100"
                value={generateCount}
                onChange={(e) => setGenerateCount(parseInt(e.target.value) || 1)}
                disabled={generating}
                className="mb-4"
              />

              <Button
                variant="primary"
                onClick={handleGenerateKeys}
                disabled={generating}
                className="w-full"
              >
                {generating ? 'Generating...' : 'Generate Keys'}
              </Button>

              <p className="text-white/60 text-sm mt-4">
                Generated keys will appear in the list below. Copy them and send to customers via Discord.
              </p>
            </Card>
          </div>

          {/* Keys List */}
          <Card>
            <h2 className="text-2xl font-bold text-white mb-6">License Keys ({keys.length})</h2>

            {loading ? (
              <p className="text-white/60">Loading keys...</p>
            ) : keys.length === 0 ? (
              <p className="text-white/60">No keys generated yet</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left py-3 px-4 text-white/80">Key</th>
                      <th className="text-left py-3 px-4 text-white/80">Status</th>
                      <th className="text-left py-3 px-4 text-white/80">Created</th>
                      <th className="text-center py-3 px-4 text-white/80">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {keys.map((k) => (
                      <tr key={k.id} className="border-b border-white/10 hover:bg-white/5 transition-colors">
                        <td className="py-3 px-4 text-white font-mono text-xs">{k.key}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-1 rounded text-xs font-semibold ${
                              k.is_active
                                ? 'bg-green-500/20 text-green-400'
                                : 'bg-red-500/20 text-red-400'
                            }`}
                          >
                            {k.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-white/60 text-xs">
                          {new Date(k.created_at).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <button
                            onClick={() => toggleKeyStatus(k.key, !!k.is_active)}
                            className="text-white/60 hover:text-white text-xs mr-3 transition-colors"
                          >
                            {k.is_active ? 'Deactivate' : 'Activate'}
                          </button>
                          <button
                            onClick={() => deleteKeyFn(k.key)}
                            className="text-red-400/60 hover:text-red-400 text-xs transition-colors"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
