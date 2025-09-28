import { Settings, Moon, Sun, Monitor, Shield, Info, User, Trash2, LogIn, LogOut, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
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
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

export function SettingsScreen() {
  const { theme, setTheme } = useTheme();
  const [profileVisible, setProfileVisible] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Load profile visibility from local storage
  useEffect(() => {
    const stored = localStorage.getItem('chiconnect-profile-visible');
    if (stored !== null) {
      setProfileVisible(JSON.parse(stored));
    }
  }, []);

  const handleProfileVisibilityToggle = (visible: boolean) => {
    setProfileVisible(visible);
    localStorage.setItem('chiconnect-profile-visible', JSON.stringify(visible));
    toast({
      title: "Privacy Updated",
      description: `Profile is now ${visible ? 'visible' : 'hidden'} to other attendees.`,
    });
  };

  const handleClearData = () => {
    localStorage.removeItem('chiconnect-events');
    localStorage.removeItem('chiconnect-connections');
    localStorage.removeItem('chiconnect-profile');
    localStorage.removeItem('chiconnect-onboarding-completed');
    localStorage.removeItem('chiconnect-profile-visible');
    localStorage.removeItem('chiconnect-host-filters');
    
    toast({
      title: "Data cleared",
      description: "All app data has been cleared. Refresh to start over.",
    });
  };

  const handleDeleteAccount = () => {
    // Clear all app data
    localStorage.clear();
    
    toast({
      title: "Account deleted",
      description: "Your account has been deleted. Redirecting to start...",
    });
    
    // Redirect to splash/onboarding after a short delay
    setTimeout(() => {
      window.location.reload();
    }, 2000);
  };

  const handleLogInOut = () => {
    setIsLoggedIn(!isLoggedIn);
    toast({
      title: isLoggedIn ? "Logged out" : "Logged in",
      description: isLoggedIn ? "You have been logged out." : "Successfully logged in!",
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
      <motion.header 
        className="safe-area-top px-6 py-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center">
            <Settings className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-2xl font-bold font-heading">Settings</h1>
        </div>
      </motion.header>

      {/* Settings Content */}
      <div className="px-6 pb-6 space-y-6">
        {/* Appearance */}
        <motion.div 
          className="glass-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Monitor className="w-5 h-5 mr-2" />
            Appearance
          </h3>
          
          <div className="space-y-4">
            <Label className="text-sm font-medium">Theme</Label>
            <RadioGroup value={theme} onValueChange={(value: any) => setTheme(value)}>
              <motion.div 
                className="flex items-center space-x-2"
                whileTap={{ scale: 0.98 }}
              >
                <RadioGroupItem value="light" id="light" />
                <Label htmlFor="light" className="flex items-center cursor-pointer">
                  <Sun className="w-4 h-4 mr-2" />
                  Light
                </Label>
              </motion.div>
              <motion.div 
                className="flex items-center space-x-2"
                whileTap={{ scale: 0.98 }}
              >
                <RadioGroupItem value="dark" id="dark" />
                <Label htmlFor="dark" className="flex items-center cursor-pointer">
                  <Moon className="w-4 h-4 mr-2" />
                  Dark
                </Label>
              </motion.div>
              <motion.div 
                className="flex items-center space-x-2"
                whileTap={{ scale: 0.98 }}
              >
                <RadioGroupItem value="system" id="system" />
                <Label htmlFor="system" className="flex items-center cursor-pointer">
                  <Monitor className="w-4 h-4 mr-2" />
                  System
                </Label>
              </motion.div>
            </RadioGroup>
          </div>
        </motion.div>

        {/* Privacy */}
        <motion.div 
          className="glass-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Shield className="w-5 h-5 mr-2" />
            Privacy
          </h3>
          
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center space-x-2">
              {profileVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              <Label htmlFor="profile-visibility" className="text-sm font-medium">
                Show profile to other attendees
              </Label>
            </div>
            <Switch
              id="profile-visibility"
              checked={profileVisible}
              onCheckedChange={handleProfileVisibilityToggle}
            />
          </div>
        </motion.div>

        {/* Account Management */}
        <motion.div 
          className="glass-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <User className="w-5 h-5 mr-2" />
            Account
          </h3>
          
          <div className="space-y-3">
            <motion.div whileTap={{ scale: 0.98 }}>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={handleLogInOut}
              >
                {isLoggedIn ? <LogOut className="w-4 h-4 mr-2" /> : <LogIn className="w-4 h-4 mr-2" />}
                {isLoggedIn ? "Log Out" : "Log In"}
              </Button>
            </motion.div>

            <motion.div whileTap={{ scale: 0.98 }}>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={handleExportData}
              >
                <Shield className="w-4 h-4 mr-2" />
                Export My Data
              </Button>
            </motion.div>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <motion.div whileTap={{ scale: 0.98 }}>
                  <Button variant="outline" className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Account
                  </Button>
                </motion.div>
              </AlertDialogTrigger>
              <AlertDialogContent className="glass-card border-destructive/20">
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-destructive">Delete Account</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete your account? This will permanently delete all your events, connections, and profile data. This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive">Yes, Delete Account</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="glass-card border-destructive/20">
                      <AlertDialogHeader>
                        <AlertDialogTitle className="text-destructive">Final Confirmation</AlertDialogTitle>
                        <AlertDialogDescription>
                          This is your final warning. Are you absolutely sure you want to delete your account? All data will be permanently lost and cannot be recovered.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Keep My Account</AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={handleDeleteAccount} 
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Yes, Delete Forever
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </motion.div>

        {/* About */}
        <motion.div 
          className="glass-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
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
              <strong>Version 1.0.0</strong> - Built with love for the Chicago community.
            </p>
            <p className="text-primary font-semibold">
              🏆 Built for Chi-Tech Hackathon 2025
            </p>
            <div className="pt-4 border-t border-border">
              <p className="text-xs">
                🔒 All data stored locally • 🚫 No tracking • 💾 Browser storage only
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}