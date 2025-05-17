'use client';

import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";
import { PageLayout } from "@/components/page-layout";

const messages = [
  {
    id: 1,
    sender: 'John Doe',
    avatar: '👨‍💼',
    content: 'Hey, how are you doing with the project?',
    time: '10:30 AM',
    unread: true,
  },
  {
    id: 2,
    sender: 'Alice Smith',
    avatar: '👩‍💻',
    content: 'The new design looks great! Can we schedule a review?',
    time: 'Yesterday',
    unread: false,
  },
  {
    id: 3,
    sender: 'Team Updates',
    avatar: '👥',
    content: 'Weekly meeting scheduled for Friday at 2 PM',
    time: '2 days ago',
    unread: false,
  },
];

export default function MessagesPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [messagesList, setMessagesList] = useState<typeof messages>([]);

  useEffect(() => {
    // Simulate API call
    const fetchMessages = async () => {
      try {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500));
        setMessagesList(messages);
        setLoading(false);
      } catch (err) {
        setError('Failed to load messages');
        setLoading(false);
      }
    };

    fetchMessages();
  }, []);

  return (
    <PageLayout
      title="Messages"
      icon="mdi:message"
      loading={loading}
      error={error}
    >
      <div className="space-y-4">
        {messagesList.map((message) => (
          <div 
            key={message.id} 
            className={`
              flex items-start gap-4 p-4 rounded-lg 
              ${message.unread ? 'bg-foreground/10' : 'bg-foreground/5'}
              hover:bg-foreground/10 transition-colors cursor-pointer
            `}
          >
            <div className="text-2xl">{message.avatar}</div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <div className="font-medium">{message.sender}</div>
                <div className="text-sm text-foreground/60">{message.time}</div>
              </div>
              <div className="text-foreground/80 truncate">{message.content}</div>
            </div>
            {message.unread && (
              <div className="w-2 h-2 rounded-full bg-blue-500 mt-2" />
            )}
          </div>
        ))}
      </div>
    </PageLayout>
  );
} 