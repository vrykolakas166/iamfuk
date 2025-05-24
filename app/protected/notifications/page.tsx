'use client';

import { Bell, Mail, AlertCircle, Info } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { PageLayout } from "@/components/layout/page-layout";

const notifications = [
  {
    id: 1,
    type: 'message',
    icon: 'mdi:message',
    title: 'New Message',
    content: 'You have a new message from John Doe',
    time: '2 minutes ago',
    read: false,
  },
  {
    id: 2,
    type: 'alert',
    icon: 'mdi:alert',
    title: 'System Update',
    content: 'System maintenance scheduled for tomorrow',
    time: '1 hour ago',
    read: true,
  },
  {
    id: 3,
    type: 'success',
    icon: 'mdi:check-circle',
    title: 'Task Completed',
    content: 'Your task "Update Profile" has been completed',
    time: '3 hours ago',
    read: true,
  },
  {
    id: 4,
    type: 'warning',
    icon: 'mdi:alert-circle',
    title: 'Storage Warning',
    content: 'You are running low on storage space',
    time: '1 day ago',
    read: false,
  },
];

export default function NotificationsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notificationsList, setNotificationsList] = useState<typeof notifications>([]);

  useEffect(() => {
    // Simulate API call
    const fetchNotifications = async () => {
      try {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500));
        setNotificationsList(notifications);
        setLoading(false);
      } catch (err) {
        setError('Failed to load notifications');
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const handleMarkAllAsRead = () => {
    setNotificationsList(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const markAllAsReadButton = (
    <Button 
      variant="outline" 
      onClick={handleMarkAllAsRead}
      className="gap-2"
    >
      <Bell />
      Mark all as read
    </Button>
  );

  return (
    <PageLayout
      title="Notifications"
      icon="mdi:bell"
      loading={loading}
      error={error}
      headerAction={markAllAsReadButton}
    >
      <div className="space-y-4">
        {notificationsList.map((notification) => (
          <div
            key={notification.id}
            className={`
              bg-accent/50 backdrop-blur-sm border border-foreground/10 rounded-xl p-4
              transition-colors duration-200
              ${notification.read ? 'opacity-60' : ''}
            `}
          >
            <div className="flex items-start gap-4">
              <div className={`
                p-2 rounded-lg
                ${notification.type === 'message' ? 'bg-blue-500/10' : ''}
                ${notification.type === 'alert' ? 'bg-red-500/10' : ''}
                ${notification.type === 'success' ? 'bg-green-500/10' : ''}
                ${notification.type === 'warning' ? 'bg-yellow-500/10' : ''}
              `}>
                <Bell />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">{notification.title}</h3>
                  <span className="text-sm text-foreground/60">{notification.time}</span>
                </div>
                <p className="text-foreground/80 mt-1">{notification.content}</p>
              </div>
              {!notification.read && (
                <div className="w-2 h-2 rounded-full bg-blue-500" />
              )}
            </div>
          </div>
        ))}
      </div>
    </PageLayout>
  );
} 