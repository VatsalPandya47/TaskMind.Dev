import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import SlackIntegration, { SlackSettings } from "@/components/SlackIntegration";
import { useTheme } from '../context/ThemeContext';
import { 
  User, 
  Bell, 
  Shield, 
  Zap, 
  Download, 
  Trash2, 
  Settings, 
  Calendar,
  MessageSquare,
  Slack,
  Mail,
  Key,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  Clock,
  Database
} from "lucide-react";

const SettingsTab = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { theme } = useTheme();
  const [profile, setProfile] = useState({
    first_name: "",
    last_name: "",
    email: "",
    timezone: "UTC",
    language: "en",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [notifications, setNotifications] = useState({
    email: true,
    slack: false,
    taskReminders: true,
    meetingDigests: true,
    weeklyReports: false,
  });
  const [integrations, setIntegrations] = useState({
    zoom: { connected: false, status: "disconnected" },
    teams: { connected: false, status: "disconnected" },
    slack: { connected: false, status: "disconnected" },
    google: { connected: false, status: "disconnected" },
  });

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (error) {
      console.error("Error fetching profile:", error);
    } else if (data) {
      setProfile({
        first_name: data.first_name || "",
        last_name: data.last_name || "",
        email: data.email || user.email || "",
        timezone: "UTC",
        language: "en",
      });
    }
  };

  const updateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsLoading(true);
    
    const { error } = await supabase
      .from("profiles")
      .upsert({
        id: user.id,
        first_name: profile.first_name,
        last_name: profile.last_name,
        email: profile.email,
        updated_at: new Date().toISOString(),
      });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
    }

    setIsLoading(false);
  };

  const handleNotificationChange = (key: string, value: boolean) => {
    setNotifications(prev => ({ ...prev, [key]: value }));
    toast({
      title: "Notification Updated",
      description: `${key.replace(/([A-Z])/g, ' $1').toLowerCase()} ${value ? 'enabled' : 'disabled'}`,
    });
  };

  const connectIntegration = (platform: string) => {
    setIntegrations(prev => ({
      ...prev,
      [platform]: { connected: true, status: "connected" }
    }));
    toast({
      title: "Integration Connected",
      description: `${platform} has been successfully connected`,
    });
  };

  const disconnectIntegration = (platform: string) => {
    setIntegrations(prev => ({
      ...prev,
      [platform]: { connected: false, status: "disconnected" }
    }));
    toast({
      title: "Integration Disconnected",
      description: `${platform} has been disconnected`,
    });
  };

  const downloadData = () => {
    toast({
      title: "Download Started",
      description: "Your data download is being prepared. You'll receive an email when it's ready.",
    });
  };

  const deleteAccount = () => {
    if (confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      toast({
        title: "Account Deletion",
        description: "Account deletion request submitted. Our team will contact you within 24 hours.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-8 relative">
      {/* Decorative blur elements */}
      <div className="absolute top-0 left-1/4 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl -z-10"></div>
      
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight">
          Your Command Center ⚙️
        </h1>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
          Customize your TaskMind experience and manage your account settings
        </p>
      </div>

      {/* Profile Information */}
      <Card className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 shadow-xl hover:shadow-2xl transition-all duration-300">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <User className="h-5 w-5 text-blue-400" />
            Your Profile
          </CardTitle>
          <CardDescription className="text-gray-300">
            Update your personal information and account details
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={updateProfile} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="first_name" className="text-gray-200">First Name</Label>
                <Input
                  id="first_name"
                  value={profile.first_name}
                  onChange={(e) => setProfile({ ...profile, first_name: e.target.value })}
                  placeholder="Enter your first name"
                  className="rounded-xl bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="last_name" className="text-gray-200">Last Name</Label>
                <Input
                  id="last_name"
                  value={profile.last_name}
                  onChange={(e) => setProfile({ ...profile, last_name: e.target.value })}
                  placeholder="Your last name"
                  className="rounded-xl bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-200">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  placeholder="your.email@example.com"
                  className="rounded-xl bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="timezone" className="text-gray-200">Timezone</Label>
                <Select value={profile.timezone} onValueChange={(value) => setProfile({ ...profile, timezone: value })}>
                  <SelectTrigger className="rounded-xl bg-gray-700/50 border-gray-600 text-white focus:border-blue-500 focus:ring-blue-500">
                    <SelectValue placeholder="Where are you located?" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-600">
                    <SelectItem value="UTC" className="text-white hover:bg-gray-700">UTC</SelectItem>
                    <SelectItem value="America/New_York" className="text-white hover:bg-gray-700">Eastern Time</SelectItem>
                    <SelectItem value="America/Chicago" className="text-white hover:bg-gray-700">Central Time</SelectItem>
                    <SelectItem value="America/Denver" className="text-white hover:bg-gray-700">Mountain Time</SelectItem>
                    <SelectItem value="America/Los_Angeles" className="text-white hover:bg-gray-700">Pacific Time</SelectItem>
                    <SelectItem value="Europe/London" className="text-white hover:bg-gray-700">London</SelectItem>
                    <SelectItem value="Europe/Paris" className="text-white hover:bg-gray-700">Paris</SelectItem>
                    <SelectItem value="Asia/Tokyo" className="text-white hover:bg-gray-700">Tokyo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button type="submit" disabled={isLoading} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Account Information */}
      <Card className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 shadow-xl hover:shadow-2xl transition-all duration-300">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Key className="h-5 w-5 text-blue-400" />
            Account Details
          </CardTitle>
          <CardDescription className="text-gray-300">
            Your account information and subscription status
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 bg-gray-700/50 rounded-xl border border-gray-600/30">
              <Label className="text-sm font-medium text-gray-400">User ID</Label>
              <p className="text-sm text-white font-mono mt-1">{user?.id}</p>
            </div>
            <div className="p-4 bg-gray-700/50 rounded-xl border border-gray-600/30">
              <Label className="text-sm font-medium text-gray-400">Member Since</Label>
              <p className="text-sm text-white mt-1">
                {user?.created_at ? new Date(user.created_at).toLocaleDateString() : "N/A"}
              </p>
            </div>
            <div className="p-4 bg-gray-700/50 rounded-xl border border-gray-600/30">
              <Label className="text-sm font-medium text-gray-400">Your Plan</Label>
              <div className="flex items-center gap-2 mt-1">
                <Badge className="bg-blue-500/20 text-blue-400 border border-blue-400/30">Pro Plan</Badge>
                <span className="text-sm text-gray-300">Active</span>
              </div>
            </div>
            <div className="p-4 bg-gray-700/50 rounded-xl border border-gray-600/30">
              <Label className="text-sm font-medium text-gray-400">Last Login</Label>
              <p className="text-sm text-white mt-1">
                {user?.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleString() : "N/A"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Integrations */}
      <Card className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 shadow-xl hover:shadow-2xl transition-all duration-300">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Zap className="h-5 w-5 text-blue-400" />
            Connect Your Tools
          </CardTitle>
          <CardDescription className="text-gray-300">
            Link your favorite apps and platforms
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Zoom Integration */}
            <div className="flex items-center justify-between p-4 bg-gray-700/30 border border-gray-600/30 rounded-xl hover:bg-gray-600/30 transition-all duration-200">
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-blue-400" />
                <div>
                  <p className="font-medium text-white">Zoom</p>
                  <p className="text-sm text-gray-300">
                    {integrations.zoom.connected ? "Connected" : "Not connected"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {integrations.zoom.connected ? (
                  <>
                    <Badge className="bg-green-500/20 text-green-400 border border-green-400/30">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Connected
                    </Badge>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => disconnectIntegration('zoom')}
                      className="rounded-lg border-gray-600 text-gray-300 hover:bg-gray-600 hover:text-white"
                    >
                      Disconnect
                    </Button>
                  </>
                ) : (
                  <Button 
                    onClick={() => connectIntegration('zoom')}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                  >
                    Connect
                  </Button>
                )}
              </div>
            </div>

            {/* Teams Integration */}
            <div className="flex items-center justify-between p-4 bg-gray-700/30 border border-gray-600/30 rounded-xl hover:bg-gray-600/30 transition-all duration-200">
              <div className="flex items-center gap-3">
                <MessageSquare className="h-5 w-5 text-purple-400" />
                <div>
                  <p className="font-medium text-white">Microsoft Teams</p>
                  <p className="text-sm text-gray-300">
                    {integrations.teams.connected ? "Connected" : "Not connected"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {integrations.teams.connected ? (
                  <>
                    <Badge className="bg-green-500/20 text-green-400 border border-green-400/30">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Connected
                    </Badge>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => disconnectIntegration('teams')}
                      className="rounded-lg border-gray-600 text-gray-300 hover:bg-gray-600 hover:text-white"
                    >
                      Disconnect
                    </Button>
                  </>
                ) : (
                  <Button 
                    onClick={() => connectIntegration('teams')}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                  >
                    Connect
                  </Button>
                )}
              </div>
            </div>

            {/* Google Integration */}
            <div className="flex items-center justify-between p-4 bg-gray-700/30 border border-gray-600/30 rounded-xl hover:bg-gray-600/30 transition-all duration-200">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-red-400" />
                <div>
                  <p className="font-medium text-white">Google Workspace</p>
                  <p className="text-sm text-gray-300">
                    {integrations.google.connected ? "Connected" : "Not connected"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {integrations.google.connected ? (
                  <>
                    <Badge className="bg-green-500/20 text-green-400 border border-green-400/30">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Connected
                    </Badge>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => disconnectIntegration('google')}
                      className="rounded-lg border-gray-600 text-gray-300 hover:bg-gray-600 hover:text-white"
                    >
                      Disconnect
                    </Button>
                  </>
                ) : (
                  <Button 
                    onClick={() => connectIntegration('google')}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                  >
                    Connect
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Slack Integration */}
      <SlackIntegration 
        onSettingsChange={(slackSettings: SlackSettings) => {
          // Update the main notifications state when Slack settings change
          setNotifications(prev => ({
            ...prev,
            slack: slackSettings.enabled
          }));
          
          // Update integrations state
          setIntegrations(prev => ({
            ...prev,
            slack: { 
              connected: slackSettings.enabled, 
              status: slackSettings.enabled ? "connected" : "disconnected" 
            }
          }));
        }}
      />

      {/* Notifications */}
      <Card className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 shadow-xl hover:shadow-2xl transition-all duration-300">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Bell className="h-5 w-5 text-blue-400" />
            Stay in the Loop
          </CardTitle>
          <CardDescription className="text-gray-300">
            Choose how you want to receive updates and alerts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {Object.entries(notifications).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between p-4 bg-gray-700/30 border border-gray-600/30 rounded-xl hover:bg-gray-600/30 transition-all duration-200">
                <div>
                  <p className="font-medium text-white">
                    {key === 'email' && 'Email Notifications 📧'}
                    {key === 'slack' && 'Slack Notifications 💬'}
                    {key === 'taskReminders' && 'Task Reminders ⏰'}
                    {key === 'meetingDigests' && 'Meeting Digests 📋'}
                    {key === 'weeklyReports' && 'Weekly Reports 📊'}
                  </p>
                  <p className="text-sm text-gray-300">
                    {key === 'email' && 'Get updates delivered to your inbox'}
                    {key === 'slack' && 'Receive notifications in your Slack channels'}
                    {key === 'taskReminders' && 'Never miss a deadline again'}
                    {key === 'meetingDigests' && 'Daily summaries of your meetings'}
                    {key === 'weeklyReports' && 'Weekly productivity insights'}
                  </p>
                </div>
                <Switch
                  checked={value}
                  onCheckedChange={(checked) => handleNotificationChange(key, checked)}
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Security */}
      <Card className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 shadow-xl hover:shadow-2xl transition-all duration-300">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Shield className="h-5 w-5 text-blue-400" />
            Security & Privacy
          </CardTitle>
          <CardDescription className="text-gray-300">
            Keep your account safe and secure
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-700/30 border border-gray-600/30 rounded-xl hover:bg-gray-600/30 transition-all duration-200">
              <div>
                <p className="font-medium text-white">Two-Factor Authentication</p>
                <p className="text-sm text-gray-300">Add an extra layer of security to your account</p>
              </div>
              <Button variant="outline" size="sm" className="rounded-lg border-gray-600 text-gray-300 hover:bg-gray-600 hover:text-white">
                Enable
              </Button>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-700/30 border border-gray-600/30 rounded-xl hover:bg-gray-600/30 transition-all duration-200">
              <div>
                <p className="font-medium text-white">Password</p>
                <p className="text-sm text-gray-300">Change your account password</p>
              </div>
              <Button variant="outline" size="sm" className="rounded-lg border-gray-600 text-gray-300 hover:bg-gray-600 hover:text-white">
                Change
              </Button>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-700/30 border border-gray-600/30 rounded-xl hover:bg-gray-600/30 transition-all duration-200">
              <div>
                <p className="font-medium text-white">Active Sessions</p>
                <p className="text-sm text-gray-300">Manage your active login sessions</p>
              </div>
              <Button variant="outline" size="sm" className="rounded-lg border-gray-600 text-gray-300 hover:bg-gray-600 hover:text-white">
                View
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Management */}
      <Card className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 shadow-xl hover:shadow-2xl transition-all duration-300">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Database className="h-5 w-5 text-blue-400" />
            Your Data
          </CardTitle>
          <CardDescription className="text-gray-300">
            Download your data or manage your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-700/30 border border-gray-600/30 rounded-xl hover:bg-gray-600/30 transition-all duration-200">
              <div className="flex items-center gap-3">
                <Download className="h-5 w-5 text-blue-400" />
                <div>
                  <p className="font-medium text-white">Download Your Data</p>
                  <p className="text-sm text-gray-300">Download all your meetings and tasks data</p>
                </div>
              </div>
              <Button onClick={downloadData} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                Download
              </Button>
            </div>
            <Separator className="bg-gray-600" />
            <div className="flex items-center justify-between p-4 bg-red-500/10 border border-red-500/30 rounded-xl hover:bg-red-500/20 transition-all duration-200">
              <div className="flex items-center gap-3">
                <Trash2 className="h-5 w-5 text-red-400" />
                <div>
                  <p className="font-medium text-red-300">Delete Account</p>
                  <p className="text-sm text-red-400">Permanently delete your account and all data</p>
                </div>
              </div>
              <Button 
                onClick={deleteAccount} 
                variant="destructive" 
                className="rounded-lg bg-red-600 hover:bg-red-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                Delete
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsTab;
