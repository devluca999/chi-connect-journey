import { Settings, Moon, Sun, Monitor, Shield, Info, User, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle, 
  AlertDialogTrigger 
} from "@/components/ui/alert-dialog";
import { useTheme } from "../theme/ThemeProvider";
import { toast } from "@/hooks/use-toast";

export function SettingsScreen() {
  const { theme, setTheme } = useTheme();

  const handleClearData = () => {
    localStorage.removeItem('chiconnect-events');
    localStorage.removeItem('chiconnect-connections');
    localStorage.removeItem('chiconnect-profile');
    localStorage.removeItem('chiconnect-onboarding-completed');
    
    toast({
      title: "Data cleared",
      description: "All app data has been cleared. Refresh to start over.",
    });
  };

  const handleExportData = () => {
    const events = localStorage.getItem('chiconnect-events') || '[]';
    const connections = localStorage.getItem('chiconnect-connections') || '[]';
    const profile = localStorage.getItem('chiconnect-profile') || '{}';
    
    const exportData = {
      events: JSON.parse(events),
      connections: JSON.parse(connections),
      profile: JSON.parse(profile),
      exportDate: new Date().toISOString()
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `chiconnect-data-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
    
    toast({
      title: "Data exported",
      description: "Your data has been downloaded as a JSON file.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Header */}
      <header className="safe-area-top px-6 py-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center">
            <Settings className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-2xl font-bold font-heading">Settings</h1>
        </div>
      </header>

      {/* Settings Content */}
      <div className="px-6 pb-6 space-y-6">
        {/* Appearance */}
        <div className="glass-card">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Monitor className="w-5 h-5 mr-2" />
            Appearance
          </h3>
          
          <div className="space-y-4">
            <Label className="text-sm font-medium">Theme</Label>
            <RadioGroup value={theme} onValueChange={(value: any) => setTheme(value)}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="light" id="light" />
                <Label htmlFor="light" className="flex items-center cursor-pointer">
                  <Sun className="w-4 h-4 mr-2" />
                  Light
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="dark" id="dark" />
                <Label htmlFor="dark" className="flex items-center cursor-pointer">
                  <Moon className="w-4 h-4 mr-2" />
                  Dark
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="system" id="system" />
                <Label htmlFor="system" className="flex items-center cursor-pointer">
                  <Monitor className="w-4 h-4 mr-2" />
                  System
                </Label>
              </div>
            </RadioGroup>
          </div>
        </div>

        {/* Account Management */}
        <div className="glass-card">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <User className="w-5 h-5 mr-2" />
            Account
          </h3>
          
          <div className="space-y-3">
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={handleExportData}
            >
              <Shield className="w-4 h-4 mr-2" />
              Export My Data
            </Button>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Clear All Data
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Clear All Data</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete all your events, connections, and profile data. 
                    This action cannot be undone. Consider exporting your data first.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleClearData} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                    Clear Data
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        {/* Privacy & Security */}
        <div className="glass-card">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Shield className="w-5 h-5 mr-2" />
            Privacy & Security
          </h3>
          
          <div className="space-y-3 text-sm text-muted-foreground">
            <p>
              🔒 All your data is stored locally on your device and never sent to external servers.
            </p>
            <p>
              🚫 We don't track your activity or collect personal information.
            </p>
            <p>
              💾 Your connections and events are saved in your browser's local storage.
            </p>
          </div>
        </div>

        {/* About */}
        <div className="glass-card">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Info className="w-5 h-5 mr-2" />
            About ChiConnect
          </h3>
          
          <div className="space-y-3 text-sm text-muted-foreground">
            <p>
              ChiConnect helps you discover community events, build meaningful connections, 
              and track your networking opportunities.
            </p>
            <p>
              Version 1.0.0 - Built with love for the Chicago community.
            </p>
            <div className="pt-4 border-t border-border">
              <p className="text-xs">
                This is a demo app with mock data. All functionality is local to your device.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}