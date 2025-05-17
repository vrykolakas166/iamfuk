'use client';

import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";
import { PageLayout } from "@/components/page-layout";

// Sample data - in real app, this would come from an API
const sampleFaqs = [
  {
    id: 1,
    question: 'How do I reset my password?',
    answer: 'You can reset your password by clicking on the "Forgot Password" link on the login page. You will receive an email with instructions to reset your password.',
    icon: 'mdi:key',
  },
  {
    id: 2,
    question: 'How can I enable two-factor authentication?',
    answer: 'Go to the Security settings page and toggle on Two-Factor Authentication. You will be guided through the setup process.',
    icon: 'mdi:shield-lock',
  },
  {
    id: 3,
    question: 'How do I contact support?',
    answer: 'You can reach our support team by email at support@example.com or by using the contact form below.',
    icon: 'mdi:help-circle',
  },
];

const sampleSupportOptions = [
  {
    id: 1,
    title: 'Email Support',
    description: 'Get help via email',
    icon: 'mdi:email',
    action: 'support@example.com',
  },
  {
    id: 2,
    title: 'Live Chat',
    description: 'Chat with our support team',
    icon: 'mdi:chat',
    action: 'Start Chat',
  },
  {
    id: 3,
    title: 'Documentation',
    description: 'Browse our help center',
    icon: 'mdi:book-open',
    action: 'View Docs',
  },
];

export default function HelpPage() {
  const [faqs, setFaqs] = useState<typeof sampleFaqs>([]);
  const [supportOptions, setSupportOptions] = useState<typeof sampleSupportOptions>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  useEffect(() => {
    // Simulate API call
    const fetchData = async () => {
      try {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500));
        setFaqs(sampleFaqs);
        setSupportOptions(sampleSupportOptions);
        setLoading(false);
      } catch (err) {
        setError('Failed to load help content');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <PageLayout
      title="Help & Support"
      icon="mdi:help-circle"
      loading={loading}
      error={error}
    >
      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-semibold mb-4">Frequently Asked Questions</h2>
          {faqs.length === 0 ? (
            <div className="text-center text-foreground/60 py-8">
              No FAQs available
            </div>
          ) : (
            <div className="space-y-4">
              {faqs.map((faq) => (
                <div 
                  key={faq.id}
                  className="rounded-lg bg-foreground/5 overflow-hidden"
                >
                  <button
                    onClick={() => setExpandedFaq(expandedFaq === faq.id ? null : faq.id)}
                    className="w-full flex items-center gap-4 p-4 hover:bg-foreground/10 transition-colors"
                  >
                    <div className="p-2 rounded-lg bg-foreground/5">
                      <Icon icon={faq.icon} className="w-5 h-5 text-foreground" />
                    </div>
                    <div className="flex-1 text-left font-medium">{faq.question}</div>
                    <Icon 
                      icon={expandedFaq === faq.id ? 'mdi:chevron-up' : 'mdi:chevron-down'} 
                      className="w-5 h-5 text-foreground/60"
                    />
                  </button>
                  {expandedFaq === faq.id && (
                    <div className="p-4 text-foreground/80">
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-4">Contact Support</h2>
          {supportOptions.length === 0 ? (
            <div className="text-center text-foreground/60 py-8">
              No support options available
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {supportOptions.map((option) => (
                <div 
                  key={option.id}
                  className="p-4 rounded-lg bg-foreground/5 hover:bg-foreground/10 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 rounded-lg bg-foreground/5">
                      <Icon icon={option.icon} className="w-5 h-5 text-foreground" />
                    </div>
                    <div className="font-medium">{option.title}</div>
                  </div>
                  <div className="text-sm text-foreground/60 mb-2">{option.description}</div>
                  <div className="text-sm">{option.action}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
} 