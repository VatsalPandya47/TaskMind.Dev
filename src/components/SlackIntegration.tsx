import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { slackService } from '@/lib/slackService';
import { 
  MessageSquare, 
  CheckCircle, 
  XCircle, 
  Settings, 
  Bell,
  Zap,
  TestTube,
  Send
} from 'lucide-react';

interface SlackIntegrationProps {
  onSettingsChange?: (settings: SlackSettings) => void;
}

export interface SlackSettings {
  enabled: boolean;
  taskNotifications: boolean;
  meetingNotifications: boolean;
  dailyDigest: boolean;
  weeklyReports: boolean;
  reminders: boolean;
  customChannel?: string;
}

const SlackIntegration: React.FC<SlackIntegrationProps> = ({ onSettingsChange }) => {
  const { toast } = useToast();
  const [isTesting, setIsTesting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [settings, setSettings] = useState<SlackSettings>({
    enabled: true,
    taskNotifications: true,
    meetingNotifications: true,
    dailyDigest: false,
    weeklyReports: false,
    reminders: true,
  });

  const handleSettingChange = (key: keyof SlackSettings, value: boolean) => {
    const newSettings = { ...settings, [key]: value as boolean };
    setSettings(newSettings);
    onSettingsChange?.(newSettings);
  };

  const testConnection = async () => {
    setIsTesting(true);
    try {
      const success = await slackService.testConnection();
      setIsConnected(success);
      
      if (success) {
        toast({
          title: "✅ Slack Connected!",
          description: "TaskMind is successfully connected to your Slack workspace.",
        });
      } else {
        toast({
          title: "❌ Connection Failed",
          description: "Unable to connect to Slack. Please check your configuration.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Slack connection test failed:', error);
      setIsConnected(false);
      toast({
        title: "❌ Connection Error",
        description: "There was an error testing the Slack connection.",
        variant: "destructive",
      });
    } finally {
      setIsTesting(false);
    }
  };

  const sendTestNotification = async () => {
    try {
      await slackService.sendCustomNotification({
        type: 'custom',
        title: 'TaskMind Test Notification',
        message: '🎉 This is a test notification from TaskMind! Your Slack integration is working perfectly.'
      });
      
      toast({
        title: "✅ Test Message Sent!",
        description: "Check your Slack channel for the test notification.",
      });
    } catch (error) {
      console.error('Failed to send test notification:', error);
      toast({
        title: "❌ Test Failed",
        description: "Unable to send test notification. Please try again.",
        variant: "destructive",
      });
    }
  };

  const notificationTypes = [
    {
      key: 'taskNotifications' as const,
      title: 'Task Notifications',
      description: 'Get notified when tasks are created, completed, or due',
      icon: CheckCircle,
      emoji: '🎯'
    },
    {
      key: 'meetingNotifications' as const,
      title: 'Meeting Summaries',
      description: 'Receive meeting summaries and action items',
      icon: MessageSquare,
      emoji: '📋'
    },
    {
      key: 'reminders' as const,
      title: 'Task Reminders',
      description: 'Get reminded about upcoming deadlines',
      icon: Bell,
      emoji: '⏰'
    },
    {
      key: 'dailyDigest' as const,
      title: 'Daily Digest',
      description: 'Daily summary of your productivity',
      icon: Zap,
      emoji: '📊'
    },
    {
      key: 'weeklyReports' as const,
      title: 'Weekly Reports',
      description: 'Weekly productivity insights and trends',
      icon: Settings,
      emoji: '📈'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Connection Status */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-blue-600" />
            Slack Integration
          </CardTitle>
          <CardDescription>
            Connect TaskMind to your Slack workspace for real-time notifications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
            <div className="flex items-center gap-3">
              {isConnected ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : (
                <XCircle className="h-5 w-5 text-red-600" />
              )}
              <div>
                <p className="font-medium">Connection Status</p>
                <p className="text-sm text-gray-600">
                  {isConnected ? 'Connected to Slack' : 'Not connected'}
                </p>
              </div>
            </div>
            <Badge variant={isConnected ? "default" : "secondary"}>
              {isConnected ? 'Connected' : 'Disconnected'}
            </Badge>
          </div>

          <div className="flex gap-3">
            <Button 
              onClick={testConnection} 
              disabled={isTesting}
              variant="outline"
              className="flex-1"
            >
              <TestTube className="h-4 w-4 mr-2" />
              {isTesting ? 'Testing...' : 'Test Connection'}
            </Button>
            <Button 
              onClick={sendTestNotification} 
              disabled={!isConnected}
              variant="outline"
              className="flex-1"
            >
              <Send className="h-4 w-4 mr-2" />
              Send Test Message
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-purple-600" />
            Notification Preferences
          </CardTitle>
          <CardDescription>
            Choose which notifications you want to receive in Slack
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {notificationTypes.map((notification) => (
              <div key={notification.key} className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">{notification.emoji}</div>
                  <div>
                    <p className="font-medium">{notification.title}</p>
                    <p className="text-sm text-gray-600">{notification.description}</p>
                  </div>
                </div>
                <Switch
                  checked={settings[notification.key]}
                  onCheckedChange={(checked) => handleSettingChange(notification.key, checked)}
                  disabled={!settings.enabled}
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Integration Info */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-gray-600" />
            Integration Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm text-gray-600">
            <p>• <strong>Channel:</strong> TaskMind notifications will be sent to your configured Slack channel</p>
            <p>• <strong>Bot:</strong> Messages are sent via the TaskMind Notifier bot</p>
            <p>• <strong>Privacy:</strong> Only you and your team members in the channel will see these notifications</p>
            <p>• <strong>Customization:</strong> You can customize notification types and frequency</p>
          </div>
        </CardContent>
      </Card>

      {/* Test Notifications */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Test Notifications
          </CardTitle>
          <CardDescription>
            Test different types of Slack notifications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button
              onClick={async () => {
                try {
                  await slackService.notifyTaskCreated({
                    title: "Test Task",
                    description: "This is a test task notification",
                    dueDate: new Date().toISOString(),
                    priority: "high"
                  });
                  toast({
                    title: "Test Sent",
                    description: "Task creation notification sent to Slack",
                  });
                } catch (error) {
                  toast({
                    title: "Test Failed",
                    description: "Failed to send task notification",
                    variant: "destructive",
                  });
                }
              }}
              variant="outline"
              className="w-full"
            >
              Test Task Created
            </Button>

            <Button
              onClick={async () => {
                try {
                  await slackService.notifyTaskCompleted({
                    title: "Test Completed Task",
                    description: "This task was completed"
                  });
                  toast({
                    title: "Test Sent",
                    description: "Task completion notification sent to Slack",
                  });
                } catch (error) {
                  toast({
                    title: "Test Failed",
                    description: "Failed to send completion notification",
                    variant: "destructive",
                  });
                }
              }}
              variant="outline"
              className="w-full"
            >
              Test Task Completed
            </Button>

            <Button
              onClick={async () => {
                try {
                  await slackService.notifyMeetingCreated({
                    title: "Test Meeting",
                    description: "This is a test meeting",
                    date: new Date().toISOString(),
                    duration: "30 minutes",
                    location: "Conference Room A"
                  });
                  toast({
                    title: "Test Sent",
                    description: "Meeting creation notification sent to Slack",
                  });
                } catch (error) {
                  toast({
                    title: "Test Failed",
                    description: "Failed to send meeting notification",
                    variant: "destructive",
                  });
                }
              }}
              variant="outline"
              className="w-full"
            >
              Test Meeting Created
            </Button>

            <Button
              onClick={async () => {
                try {
                  await slackService.sendDailyDigest(
                    [
                      { title: "Task 1", completed: true },
                      { title: "Task 2", completed: false },
                      { title: "Task 3", completed: true }
                    ],
                    [
                      { title: "Meeting 1", date: new Date().toISOString() },
                      { title: "Meeting 2", date: new Date().toISOString() }
                    ]
                  );
                  toast({
                    title: "Test Sent",
                    description: "Daily digest sent to Slack",
                  });
                } catch (error) {
                  toast({
                    title: "Test Failed",
                    description: "Failed to send daily digest",
                    variant: "destructive",
                  });
                }
              }}
              variant="outline"
              className="w-full"
            >
              Test Daily Digest
            </Button>

            <Button
              onClick={async () => {
                try {
                  await slackService.sendWeeklyReport(
                    [
                      { title: "Task 1", completed: true },
                      { title: "Task 2", completed: true },
                      { title: "Task 3", completed: false },
                      { title: "Task 4", completed: true }
                    ],
                    [
                      { title: "Meeting 1", date: new Date().toISOString() },
                      { title: "Meeting 2", date: new Date().toISOString() },
                      { title: "Meeting 3", date: new Date().toISOString() }
                    ]
                  );
                  toast({
                    title: "Test Sent",
                    description: "Weekly report sent to Slack",
                  });
                } catch (error) {
                  toast({
                    title: "Test Failed",
                    description: "Failed to send weekly report",
                    variant: "destructive",
                  });
                }
              }}
              variant="outline"
              className="w-full"
            >
              Test Weekly Report
            </Button>

            <Button
              onClick={async () => {
                try {
                  await slackService.sendCustomNotification({
                    type: "custom",
                    title: "Custom Test Message",
                    message: "This is a custom test notification from TaskMind! 🚀",
                    metadata: {
                      userId: "test-user",
                      priority: "medium"
                    }
                  });
                  toast({
                    title: "Test Sent",
                    description: "Custom notification sent to Slack",
                  });
                } catch (error) {
                  toast({
                    title: "Test Failed",
                    description: "Failed to send custom notification",
                    variant: "destructive",
                  });
                }
              }}
              variant="outline"
              className="w-full"
            >
              Test Custom Message
            </Button>

            <Button
              onClick={async () => {
                try {
                  console.log('🧪 Testing basic connection...');
                  const result = await slackService.testConnection();
                  console.log('🧪 Test result:', result);
                  toast({
                    title: result ? "Connection Successful!" : "Connection Failed",
                    description: result ? "Slack integration is working!" : "Check console for details",
                    variant: result ? "default" : "destructive",
                  });
                } catch (error) {
                  console.error('🧪 Test error:', error);
                  toast({
                    title: "Connection Failed",
                    description: error.message,
                    variant: "destructive",
                  });
                }
              }}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              Test Connection
            </Button>

            <Button
              onClick={async () => {
                try {
                  console.log('🧪 Testing basic fetch...');
                  const response = await fetch('http://127.0.0.1:54321/functions/v1/notifySlack', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                      'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0',
                    },
                    body: JSON.stringify({
                      message: '🧪 Direct fetch test from browser!'
                    })
                  });
                  
                  console.log('🧪 Direct fetch status:', response.status);
                  const text = await response.text();
                  console.log('🧪 Direct fetch response:', text);
                  
                  toast({
                    title: response.ok ? "Direct Test Success!" : "Direct Test Failed",
                    description: `Status: ${response.status}`,
                    variant: response.ok ? "default" : "destructive",
                  });
                } catch (error) {
                  console.error('🧪 Direct test error:', error);
                  toast({
                    title: "Direct Test Failed",
                    description: error.message,
                    variant: "destructive",
                  });
                }
              }}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              Direct Fetch Test
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SlackIntegration; 