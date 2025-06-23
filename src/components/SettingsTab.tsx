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
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-5xl md:text-6xl font-bold text-black leading-tight">
          Your Command Center ⚙️
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Customize your TaskMind experience and manage your account settings
        </p>
      </div>

      {/* Profile Information */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Your Profile
          </CardTitle>
          <CardDescription>
            Update your personal information and account details
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={updateProfile} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="first_name">First Name</Label>
                <Input
                  id="first_name"
                  value={profile.first_name}
                  onChange={(e) => setProfile({ ...profile, first_name: e.target.value })}
                  placeholder="Enter your first name"
                  className="rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="last_name">Last Name</Label>
                <Input
                  id="last_name"
                  value={profile.last_name}
                  onChange={(e) => setProfile({ ...profile, last_name: e.target.value })}
                  placeholder="Your last name"
                  className="rounded-xl"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  placeholder="your.email@example.com"
                  className="rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="timezone">Timezone</Label>
                <Select value={profile.timezone} onValueChange={(value) => setProfile({ ...profile, timezone: value })}>
                  <SelectTrigger className="rounded-xl">
                    <SelectValue placeholder="Where are you located?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="UTC">UTC</SelectItem>
                    <SelectItem value="America/New_York">Eastern Time</SelectItem>
                    <SelectItem value="America/Chicago">Central Time</SelectItem>
                    <SelectItem value="America/Denver">Mountain Time</SelectItem>
                    <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                    <SelectItem value="Europe/London">London</SelectItem>
                    <SelectItem value="Europe/Paris">Paris</SelectItem>
                    <SelectItem value="Asia/Tokyo">Tokyo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button type="submit" disabled={isLoading} className="bg-blue-600 hover:bg-blue-700 rounded-xl">
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Account Information */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            Account Details
          </CardTitle>
          <CardDescription>
            Your account information and subscription status
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 bg-gray-50 rounded-xl">
              <Label className="text-sm font-medium text-gray-500">User ID</Label>
              <p className="text-sm text-gray-900 font-mono mt-1">{user?.id}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl">
              <Label className="text-sm font-medium text-gray-500">Member Since</Label>
              <p className="text-sm text-gray-900 mt-1">
                {user?.created_at ? new Date(user.created_at).toLocaleDateString() : "N/A"}
              </p>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl">
              <Label className="text-sm font-medium text-gray-500">Your Plan</Label>
              <div className="flex items-center gap-2 mt-1">
                <Badge className="bg-blue-100 text-blue-800">Pro Plan</Badge>
                <span className="text-sm text-gray-600">Active</span>
              </div>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl">
              <Label className="text-sm font-medium text-gray-500">Last Login</Label>
              <p className="text-sm text-gray-900 mt-1">
                {user?.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleString() : "N/A"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Integrations */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Connect Your Tools
          </CardTitle>
          <CardDescription>
            Link your favorite apps and platforms
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(integrations).map(([platform, status]) => (
              <div key={platform} className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
                <div className="flex items-center gap-3">
                  {platform === 'zoom' && <Calendar className="h-5 w-5 text-blue-600" />}
                  {platform === 'teams' && <MessageSquare className="h-5 w-5 text-purple-600" />}
                  {platform === 'slack' && <Slack className="h-5 w-5 text-pink-600" />}
                  {platform === 'google' && <Mail className="h-5 w-5 text-red-600" />}
                  <div>
                    <p className="font-medium capitalize">{platform}</p>
                    <p className="text-sm text-gray-600">
                      {status.connected ? "Connected" : "Not connected"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {status.connected ? (
                    <>
                      <Badge className="bg-green-100 text-green-800">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Connected
                      </Badge>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => disconnectIntegration(platform)}
                        className="rounded-lg"
                      >
                        Disconnect
                      </Button>
                    </>
                  ) : (
                    <Button 
                      onClick={() => connectIntegration(platform)}
                      className="bg-blue-600 hover:bg-blue-700 rounded-lg"
                    >
                      Connect
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Stay in the Loop
          </CardTitle>
          <CardDescription>
            Choose how you want to receive updates and alerts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {Object.entries(notifications).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
                <div>
                  <p className="font-medium">
                    {key === 'email' && 'Email Notifications 📧'}
                    {key === 'slack' && 'Slack Notifications 💬'}
                    {key === 'taskReminders' && 'Task Reminders ⏰'}
                    {key === 'meetingDigests' && 'Meeting Digests 📋'}
                    {key === 'weeklyReports' && 'Weekly Reports 📊'}
                  </p>
                  <p className="text-sm text-gray-600">
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
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Security & Privacy
          </CardTitle>
          <CardDescription>
            Keep your account safe and secure
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
              <div>
                <p className="font-medium">Two-Factor Authentication</p>
                <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
              </div>
              <Button variant="outline" size="sm" className="rounded-lg">
                Enable
              </Button>
            </div>
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
              <div>
                <p className="font-medium">Password</p>
                <p className="text-sm text-gray-600">Change your account password</p>
              </div>
              <Button variant="outline" size="sm" className="rounded-lg">
                Change
              </Button>
            </div>
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
              <div>
                <p className="font-medium">Active Sessions</p>
                <p className="text-sm text-gray-600">Manage your active login sessions</p>
              </div>
              <Button variant="outline" size="sm" className="rounded-lg">
                View
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Management */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Your Data
          </CardTitle>
          <CardDescription>
            Download your data or manage your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
              <div className="flex items-center gap-3">
                <Download className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="font-medium">Download Your Data</p>
                  <p className="text-sm text-gray-600">Download all your meetings and tasks data</p>
                </div>
              </div>
              <Button onClick={downloadData} className="bg-blue-600 hover:bg-blue-700 rounded-lg">
                Download
              </Button>
            </div>
            <Separator />
            <div className="flex items-center justify-between p-4 border border-red-200 rounded-xl bg-red-50">
              <div className="flex items-center gap-3">
                <Trash2 className="h-5 w-5 text-red-600" />
                <div>
                  <p className="font-medium text-red-900">Delete Account</p>
                  <p className="text-sm text-red-700">Permanently delete your account and all data</p>
                </div>
              </div>
              <Button 
                onClick={deleteAccount} 
                variant="destructive" 
                className="rounded-lg"
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
