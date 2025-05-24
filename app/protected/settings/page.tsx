'use client';

import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { PageLayout } from "@/components/layout/page-layout";
import { Settings, Loader2, Save, Shield, Palette, UserCog, HelpCircle } from 'lucide-react';

type Field = {
  id: string;
  label: string;
  type: 'select' | 'toggle';
  options?: string[];
  value: string | boolean;
};

type SettingSection = {
  id: string;
  title: string;
  icon: string;
  fields: Field[];
};

const initialSettings: SettingSection[] = [
  {
    id: 'account',
    title: 'Account Settings',
    icon: 'mdi:account-cog',
    fields: [
      { id: 'language', label: 'Language', type: 'select', options: ['English', 'Spanish', 'French'], value: 'English' },
      { id: 'timezone', label: 'Time Zone', type: 'select', options: ['UTC', 'EST', 'PST'], value: 'UTC' },
      { id: 'notifications', label: 'Notifications', type: 'toggle', value: true },
    ],
  },
  {
    id: 'appearance',
    title: 'Appearance',
    icon: 'mdi:palette',
    fields: [
      { id: 'theme', label: 'Theme', type: 'select', options: ['System', 'Light', 'Dark'], value: 'System' },
      { id: 'fontSize', label: 'Font Size', type: 'select', options: ['Small', 'Medium', 'Large'], value: 'Medium' },
      { id: 'animations', label: 'Animations', type: 'toggle', value: true },
    ],
  },
  {
    id: 'privacy',
    title: 'Privacy',
    icon: 'mdi:shield-lock',
    fields: [
      { id: 'profileVisibility', label: 'Profile Visibility', type: 'select', options: ['Public', 'Private', 'Friends'], value: 'Public' },
      { id: 'activityStatus', label: 'Activity Status', type: 'toggle', value: true },
      { id: 'dataCollection', label: 'Data Collection', type: 'toggle', value: false },
    ],
  },
];

const iconMap: { [key: string]: React.ComponentType<any> } = {
  'mdi:account-cog': UserCog,
  'mdi:palette': Palette,
  'mdi:shield-lock': Shield,
  'mdi:cog': Settings,
};

export default function SettingsPage() {
  const [settings, setSettings] = useState(initialSettings);
  const [isSaving, setIsSaving] = useState(false);

  const handleSelectChange = (sectionId: string, fieldId: string, value: string) => {
    setSettings(prev => 
      prev.map(section => 
        section.id === sectionId
          ? {
              ...section,
              fields: section.fields.map(field =>
                field.id === fieldId
                  ? { ...field, value }
                  : field
              )
            }
          : section
      )
    );
  };

  const handleToggleChange = (sectionId: string, fieldId: string, value: boolean) => {
    setSettings(prev => 
      prev.map(section => 
        section.id === sectionId
          ? {
              ...section,
              fields: section.fields.map(field =>
                field.id === fieldId
                  ? { ...field, value }
                  : field
              )
            }
          : section
      )
    );
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success("Settings saved successfully");
    } catch (error) {
      toast.error("Failed to save settings. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <PageLayout
      title="Settings"
      icon="mdi:cog"
      maxWidth="7xl"
    >
      <div className="space-y-6">
        {settings.map((section) => {
          const SectionIcon = iconMap[section.icon] || HelpCircle;
          return (
            <Card key={section.id}>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <SectionIcon className="w-6 h-6 text-foreground" />
                  <CardTitle>{section.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {section.fields.map((field) => (
                  <div key={field.id} className="flex items-center justify-between">
                    <label className="font-medium">{field.label}</label>
                    {field.type === 'select' ? (
                      <Select
                        value={field.value as string}
                        onValueChange={(value) => handleSelectChange(section.id, field.id, value)}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder={`Select ${field.label}`} />
                        </SelectTrigger>
                        <SelectContent>
                          {field.options?.map((option) => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <Switch
                        checked={field.value as boolean}
                        onCheckedChange={(checked: boolean) => handleToggleChange(section.id, field.id, checked)}
                      />
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          );
        })}

        <div className="flex justify-end">
          <Button 
            onClick={handleSave}
            disabled={isSaving}
            className="gap-2"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </div>
    </PageLayout>
  );
} 