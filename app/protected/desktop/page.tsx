'use client';

import { useEffect, useState } from 'react';
import { PageLayout } from '@/components/layout/page-layout';
import ProtectedRoute from '@/components/auth/protected-route';
import { Button } from '@/components/ui/button';
import { 
  Monitor, 
  Wifi, 
  RefreshCw, 
  Settings, 
  Loader2, 
  AlertCircle,
  Save,
  X
} from 'lucide-react';

interface ConnectionSettings {
  serverAddress: string;
  port: string;
  protocol: string;
}

export default function DesktopPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'connecting'>('connected');
  const [settings, setSettings] = useState<ConnectionSettings>({
    serverAddress: 'desktop.iamfuk.io.vn',
    port: '3389',
    protocol: 'RDP'
  });
  const [editedSettings, setEditedSettings] = useState<ConnectionSettings>(settings);

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleEdit = () => {
    setEditedSettings(settings);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setEditedSettings(settings);
    setIsEditing(false);
  };

  const handleSave = async () => {
    setIsEditing(false);
    setSettings(editedSettings);
    await handleReconnect();
  };

  const handleReconnect = async () => {
    setIsConnecting(true);
    setConnectionStatus('connecting');
    
    // Simulate connection attempt
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setConnectionStatus('connected');
      // Add new log entry
      const newLog = {
        timestamp: new Date().toLocaleString(),
        message: 'Connected successfully',
        type: 'success'
      };
      setConnectionLogs(prev => [newLog, ...prev]);
    } catch (err) {
      setConnectionStatus('disconnected');
      setError('Failed to connect to remote desktop');
      // Add error log entry
      const newLog = {
        timestamp: new Date().toLocaleString(),
        message: 'Connection failed',
        type: 'error'
      };
      setConnectionLogs(prev => [newLog, ...prev]);
    } finally {
      setIsConnecting(false);
    }
  };

  const [connectionLogs, setConnectionLogs] = useState([
    { timestamp: '2024-03-19 10:30:15', message: 'Connected successfully', type: 'success' },
    { timestamp: '2024-03-19 10:29:45', message: 'Establishing connection...', type: 'info' },
    { timestamp: '2024-03-19 10:29:30', message: 'Connection initiated', type: 'info' }
  ]);

  return (
    <ProtectedRoute pageKey="RESTRICTED">
      <PageLayout
        title="Remote Desktop"
        icon="mdi:remote-desktop"
        loading={loading}
        error={error}
      >
        <div className="space-y-6">
          {/* Desktop Connection Status */}
          <div className="p-6 rounded-xl bg-accent/50 backdrop-blur-sm border border-foreground/10">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-lg ${
                  connectionStatus === 'connected' ? 'bg-green-500/20' :
                  connectionStatus === 'connecting' ? 'bg-blue-500/20' :
                  'bg-red-500/20'
                }`}>
                  <Monitor 
                    className={`w-6 h-6 ${
                      connectionStatus === 'connected' ? 'text-green-500' :
                      connectionStatus === 'connecting' ? 'text-blue-500 animate-spin' :
                      'text-red-500'
                    }`} 
                  />
                </div>
                <div>
                  <h3 className="text-lg font-medium">Connection Status</h3>
                  <p className="text-foreground/60">
                    {connectionStatus === 'connected' ? 'Connected' :
                     connectionStatus === 'connecting' ? 'Connecting...' :
                     'Disconnected'}
                  </p>
                </div>
              </div>
              <Button
                onClick={handleReconnect}
                disabled={isConnecting}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors`}
              >
                <RefreshCw 
                  className={`w-5 h-5 ${isConnecting ? 'animate-spin' : ''}`} 
                />
                <span>{isConnecting ? 'Connecting...' : 'Reconnect'}</span>
              </Button>
            </div>
          </div>

          {/* Desktop Controls */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Connection Settings */}
            <div className="p-6 rounded-xl bg-accent/50 backdrop-blur-sm border border-foreground/10">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium">Connection Settings</h3>
                {!isEditing ? (
                  <button
                    onClick={handleEdit}
                    className="p-2 rounded-lg hover:bg-foreground/5 transition-colors"
                  >
                    <Settings className="w-5 h-5" />
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={handleSave}
                      className="p-2 rounded-lg bg-green-500/20 hover:bg-green-500/30 transition-colors"
                    >
                      <Save className="w-5 h-5 text-green-500" />
                    </button>
                    <button
                      onClick={handleCancel}
                      className="p-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 transition-colors"
                    >
                      <X className="w-5 h-5 text-red-500" />
                    </button>
                  </div>
                )}
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-foreground/60">Server Address</span>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedSettings.serverAddress}
                      onChange={(e) => setEditedSettings(prev => ({ ...prev, serverAddress: e.target.value }))}
                      className="px-2 py-1 rounded bg-foreground/5 border border-foreground/10 focus:border-blue-500 focus:outline-none"
                    />
                  ) : (
                    <span className="font-medium overflow-hidden text-ellipsis" title={settings.serverAddress}>{settings.serverAddress}</span>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-foreground/60">Port</span>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedSettings.port}
                      onChange={(e) => setEditedSettings(prev => ({ ...prev, port: e.target.value }))}
                      className="px-2 py-1 rounded bg-foreground/5 border border-foreground/10 focus:border-blue-500 focus:outline-none w-24"
                    />
                  ) : (
                    <span className="font-medium">{settings.port}</span>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-foreground/60">Protocol</span>
                  {isEditing ? (
                    <select
                      value={editedSettings.protocol}
                      onChange={(e) => setEditedSettings(prev => ({ ...prev, protocol: e.target.value }))}
                      className="px-2 py-1 rounded bg-foreground/5 border border-foreground/10 focus:border-blue-500 focus:outline-none"
                    >
                      <option value="RDP">RDP</option>
                      <option value="VNC">VNC</option>
                      <option value="SSH">SSH</option>
                    </select>
                  ) : (
                    <span className="font-medium">{settings.protocol}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="p-6 rounded-xl bg-accent/50 backdrop-blur-sm border border-foreground/10">
              <h3 className="text-lg font-medium mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-4">
                <button className="p-3 rounded-lg bg-foreground/5 hover:bg-foreground/10 transition-colors">
                  <Monitor className="w-6 h-6 mx-auto mb-2" />
                  <span className="text-sm">Restart</span>
                </button>
                <button className="p-3 rounded-lg bg-foreground/5 hover:bg-foreground/10 transition-colors">
                  <RefreshCw className="w-6 h-6 mx-auto mb-2" />
                  <span className="text-sm">Refresh</span>
                </button>
                <button className="p-3 rounded-lg bg-foreground/5 hover:bg-foreground/10 transition-colors">
                  <Wifi className="w-6 h-6 mx-auto mb-2" />
                  <span className="text-sm">Clipboard</span>
                </button>
                <button className="p-3 rounded-lg bg-foreground/5 hover:bg-foreground/10 transition-colors">
                  <Settings className="w-6 h-6 mx-auto mb-2" />
                  <span className="text-sm">Upload</span>
                </button>
              </div>
            </div>

            {/* System Status */}
            <div className="p-6 rounded-xl bg-accent/50 backdrop-blur-sm border border-foreground/10">
              <h3 className="text-lg font-medium mb-4">System Status</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-foreground/60">CPU Usage</span>
                    <span className="font-medium">45%</span>
                  </div>
                  <div className="h-2 rounded-full bg-foreground/10">
                    <div className="h-full rounded-full bg-blue-500" style={{ width: '15%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-foreground/60">Memory Usage</span>
                    <span className="font-medium">60%</span>
                  </div>
                  <div className="h-2 rounded-full bg-foreground/10">
                    <div className="h-full rounded-full bg-green-500" style={{ width: '20%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-foreground/60">Disk Usage</span>
                    <span className="font-medium">75%</span>
                  </div>
                  <div className="h-2 rounded-full bg-foreground/10">
                    <div className="h-full rounded-full bg-yellow-500" style={{ width: '35%' }} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Connection Log */}
          <div className="p-6 rounded-xl bg-accent/50 backdrop-blur-sm border border-foreground/10">
            <h3 className="text-lg font-medium mb-4">Connection Log</h3>
            <div className="space-y-2">
              {connectionLogs.map((log, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <Monitor className="w-4 h-4 text-foreground/60" />
                  <span className="text-foreground/60">{log.timestamp}</span>
                  <span className={
                    log.type === 'success' ? 'text-green-500' :
                    log.type === 'error' ? 'text-red-500' :
                    log.type === 'info' ? 'text-blue-500' :
                    'text-foreground/60'
                  }>
                    {log.message}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </PageLayout>
    </ProtectedRoute>
  );
} 