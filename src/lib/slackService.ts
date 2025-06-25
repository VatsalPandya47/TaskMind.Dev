import { createClient } from '@supabase/supabase-js';

// Use local Supabase URL for development, production URL for production
const isLocalDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
const supabaseUrl = isLocalDevelopment 
  ? 'http://127.0.0.1:54321' 
  : (import.meta.env.VITE_SUPABASE_URL || 'https://jsxupnogyvfynjgkwdyj.supabase.co');

const supabaseAnonKey = isLocalDevelopment
  ? 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0'
  : import.meta.env.VITE_SUPABASE_ANON_KEY;

console.log('🔧 SlackService Configuration:', {
  isLocalDevelopment,
  supabaseUrl,
  hasAnonKey: !!supabaseAnonKey
});

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface SlackMessage {
  message: string;
  channel?: string;
}

export interface TaskMindSlackNotification {
  type: 'task_created' | 'task_completed' | 'meeting_summary' | 'daily_digest' | 'weekly_report' | 'reminder' | 'custom';
  title: string;
  message: string;
  channel?: string;
  metadata?: {
    taskId?: string;
    meetingId?: string;
    userId?: string;
    priority?: 'low' | 'medium' | 'high';
    dueDate?: string;
  };
}

class SlackService {
  private async sendSlackMessage(message: SlackMessage): Promise<any> {
    try {
      console.log('🔗 Slack Service - Using URL:', supabaseUrl);
      console.log('🔗 Slack Service - Anon Key:', supabaseAnonKey ? 'Set' : 'Not set');
      console.log('🔗 Slack Service - Sending message:', message);
      console.log('🔗 Slack Service - Full request URL:', `${supabaseUrl}/functions/v1/notifySlack`);
      
      const response = await fetch(`${supabaseUrl}/functions/v1/notifySlack`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseAnonKey}`,
        },
        body: JSON.stringify(message),
      });

      console.log('🔗 Slack Service - Response status:', response.status);
      console.log('🔗 Slack Service - Response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorText = await response.text();
        console.error('🔗 Slack Service - Error response text:', errorText);
        let error;
        try {
          error = JSON.parse(errorText);
        } catch {
          error = { error: errorText };
        }
        throw new Error(error.error || 'Failed to send Slack message');
      }

      const result = await response.json();
      console.log('🔗 Slack Service - Success response:', result);
      return result;
    } catch (error) {
      console.error('🔗 Slack Service - Detailed error:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      });
      throw error;
    }
  }

  // Task-related notifications
  async notifyTaskCreated(task: any): Promise<void> {
    const message = `🎯 *New Task Created*\n*${task.title}*\n${task.description || 'No description'}\n\n📅 Due: ${task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'}\n🏷️ Priority: ${task.priority || 'Medium'}`;
    
    await this.sendSlackMessage({ message });
  }

  async notifyTaskCompleted(task: any): Promise<void> {
    const message = `✅ *Task Completed*\n*${task.title}*\n\n🎉 Great job! This task has been marked as complete.`;
    
    await this.sendSlackMessage({ message });
  }

  async notifyTaskReminder(task: any): Promise<void> {
    const message = `⏰ *Task Reminder*\n*${task.title}*\n\n📅 Due: ${task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'}\n🏷️ Priority: ${task.priority || 'Medium'}\n\nDon't forget to complete this task!`;
    
    await this.sendSlackMessage({ message });
  }

  // Meeting-related notifications
  async notifyMeetingCreated(meeting: any): Promise<void> {
    const message = `📅 *New Meeting Scheduled*\n*${meeting.title}*\n\n📝 Description: ${meeting.description || 'No description'}\n📅 Date: ${meeting.date ? new Date(meeting.date).toLocaleDateString() : 'No date set'}\n⏱️ Duration: ${meeting.duration || 'Not specified'}\n📍 Location: ${meeting.location || 'Not specified'}`;
    
    await this.sendSlackMessage({ message });
  }

  async notifyMeetingUpdated(meeting: any): Promise<void> {
    const message = `📝 *Meeting Updated*\n*${meeting.title}*\n\n📅 Date: ${meeting.date ? new Date(meeting.date).toLocaleDateString() : 'No date set'}\n⏱️ Duration: ${meeting.duration || 'Not specified'}\n📍 Location: ${meeting.location || 'Not specified'}\n\nMeeting details have been updated.`;
    
    await this.sendSlackMessage({ message });
  }

  async notifyMeetingSummary(meeting: any, summary: string): Promise<void> {
    const message = `📋 *Meeting Summary*\n*${meeting.title}*\n\n${summary}\n\n📅 Date: ${new Date(meeting.date).toLocaleDateString()}\n⏱️ Duration: ${meeting.duration || 'Unknown'}`;
    
    await this.sendSlackMessage({ message });
  }

  async notifyMeetingActionItems(meeting: any, actionItems: string[]): Promise<void> {
    const actionItemsList = actionItems.map((item, index) => `${index + 1}. ${item}`).join('\n');
    const message = `📝 *Meeting Action Items*\n*${meeting.title}*\n\n${actionItemsList}\n\n📅 Meeting Date: ${new Date(meeting.date).toLocaleDateString()}`;
    
    await this.sendSlackMessage({ message });
  }

  // Digest and report notifications
  async sendDailyDigest(tasks: any[], meetings: any[]): Promise<void> {
    const completedTasks = tasks.filter(t => t.completed).length;
    const pendingTasks = tasks.filter(t => !t.completed).length;
    const todayMeetings = meetings.filter(m => {
      const meetingDate = new Date(m.date);
      const today = new Date();
      return meetingDate.toDateString() === today.toDateString();
    }).length;

    const message = `📊 *Daily Digest - ${new Date().toLocaleDateString()}*\n\n✅ Completed Tasks: ${completedTasks}\n📋 Pending Tasks: ${pendingTasks}\n📅 Today's Meetings: ${todayMeetings}\n\nKeep up the great work! 🚀`;
    
    await this.sendSlackMessage({ message });
  }

  async sendWeeklyReport(tasks: any[], meetings: any[]): Promise<void> {
    const completedTasks = tasks.filter(t => t.completed).length;
    const totalTasks = tasks.length;
    const totalMeetings = meetings.length;
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    const message = `📈 *Weekly Report - ${new Date().toLocaleDateString()}*\n\n📊 *Productivity Summary*\n• Total Tasks: ${totalTasks}\n• Completed Tasks: ${completedTasks}\n• Completion Rate: ${completionRate}%\n• Meetings Attended: ${totalMeetings}\n\n${completionRate >= 80 ? '🎉 Excellent week! You\'re crushing it!' : completionRate >= 60 ? '👍 Good progress! Keep it up!' : '💪 Room for improvement next week!'}`;
    
    await this.sendSlackMessage({ message });
  }

  // Custom notifications
  async sendCustomNotification(notification: TaskMindSlackNotification): Promise<void> {
    const emoji = this.getEmojiForType(notification.type);
    const message = `${emoji} *${notification.title}*\n\n${notification.message}`;
    
    await this.sendSlackMessage({ 
      message,
      channel: notification.channel 
    });
  }

  // Utility methods
  private getEmojiForType(type: string): string {
    const emojiMap: Record<string, string> = {
      task_created: '🎯',
      task_completed: '✅',
      meeting_summary: '📋',
      daily_digest: '📊',
      weekly_report: '📈',
      reminder: '⏰',
      custom: '💬'
    };
    return emojiMap[type] || '💬';
  }

  // Test connection
  async testConnection(): Promise<boolean> {
    try {
      await this.sendSlackMessage({ 
        message: '🔗 *TaskMind Slack Integration Test*\n\n✅ Connection successful! TaskMind is now connected to your Slack workspace.' 
      });
      return true;
    } catch (error) {
      console.error('Slack connection test failed:', error);
      return false;
    }
  }
}

export const slackService = new SlackService();
export default slackService; 