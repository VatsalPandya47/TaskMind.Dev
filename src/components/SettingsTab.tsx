
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Settings, Video, Calendar, User, Bell } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const SettingsTab = () => {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [autoProcessing, setAutoProcessing] = useState(false);
  const [zoomConnected, setZoomConnected] = useState(false);
  const [googleConnected, setGoogleConnected] = useState(false);
  const { toast } = useToast();

  const handleConnectZoom = () => {
    // In a real app, this would redirect to Zoom OAuth
    setZoomConnected(true);
    toast({
      title: "Zoom Connected",
      description: "Your Zoom account has been successfully connected.",
    });
  };

  const handleConnectGoogle = () => {
    // In a real app, this would redirect to Google OAuth
    setGoogleConnected(true);
    toast({
      title: "Google Calendar Connected",
      description: "Your Google Calendar has been successfully connected.",
    });
  };

  const handleSaveSettings = () => {
    toast({
      title: "Settings Saved",
      description: "Your preferences have been updated.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <Settings className="w-6 h-6" />
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
      </div>

      {/* Account Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Account Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">First Name</Label>
              <Input id="firstName" defaultValue="John" />
            </div>
            <div>
              <Label htmlFor="lastName">Last Name</Label>
              <Input id="lastName" defaultValue="Doe" />
            </div>
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" defaultValue="john.doe@example.com" />
          </div>
          <Button onClick={handleSaveSettings}>Save Changes</Button>
        </CardContent>
      </Card>

      {/* Integrations */}
      <Card>
        <CardHeader>
          <CardTitle>Integrations</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <Video className="w-6 h-6 text-blue-600" />
              <div>
                <h3 className="font-medium">Zoom</h3>
                <p className="text-sm text-gray-600">Connect your Zoom account to automatically process meeting recordings</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {zoomConnected && (
                <span className="text-sm text-green-600 font-medium">Connected</span>
              )}
              <Button 
                variant={zoomConnected ? "outline" : "default"}
                onClick={handleConnectZoom}
                disabled={zoomConnected}
              >
                {zoomConnected ? "Disconnect" : "Connect"}
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <Calendar className="w-6 h-6 text-red-600" />
              <div>
                <h3 className="font-medium">Google Calendar</h3>
                <p className="text-sm text-gray-600">Sync your calendar to automatically detect meetings</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {googleConnected && (
                <span className="text-sm text-green-600 font-medium">Connected</span>
              )}
              <Button 
                variant={googleConnected ? "outline" : "default"}
                onClick={handleConnectGoogle}
                disabled={googleConnected}
              >
                {googleConnected ? "Disconnect" : "Connect"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="email-notifications" className="text-base font-medium">
                Email Notifications
              </Label>
              <p className="text-sm text-gray-600">Receive email notifications for new action items</p>
            </div>
            <Switch
              id="email-notifications"
              checked={emailNotifications}
              onCheckedChange={setEmailNotifications}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="auto-processing" className="text-base font-medium">
                Auto-Processing
              </Label>
              <p className="text-sm text-gray-600">Automatically process new meeting recordings</p>
            </div>
            <Switch
              id="auto-processing"
              checked={autoProcessing}
              onCheckedChange={setAutoProcessing}
            />
          </div>

          <Button onClick={handleSaveSettings}>Save Preferences</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsTab;
