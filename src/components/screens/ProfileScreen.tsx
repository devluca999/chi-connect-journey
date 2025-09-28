import { useState, useEffect } from "react";
import { User, Camera, Plus, X, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { UserProfile, getUserProfile, saveUserProfile } from "@/lib/storage";
import { cn } from "@/lib/utils";

export function ProfileScreen() {
  const [profile, setProfile] = useState<UserProfile>(getUserProfile());
  const [isEditing, setIsEditing] = useState(false);
  const [newSkill, setNewSkill] = useState("");
  const [newGoal, setNewGoal] = useState("");

  useEffect(() => {
    const savedProfile = getUserProfile();
    setProfile(savedProfile);
    
    // Show edit mode if profile is empty
    if (!savedProfile.name && !savedProfile.bio) {
      setIsEditing(true);
    }
  }, []);

  const handleSave = () => {
    if (!profile.name.trim()) {
      toast({
        title: "Name required",
        description: "Please enter your name to save your profile.",
        variant: "destructive"
      });
      return;
    }

    saveUserProfile(profile);
    setIsEditing(false);
    toast({
      title: "Profile saved",
      description: "Your profile has been updated successfully."
    });
  };

  const addSkill = () => {
    if (newSkill.trim() && !profile.skills.includes(newSkill.trim())) {
      setProfile(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }));
      setNewSkill("");
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setProfile(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  const addGoal = () => {
    if (newGoal.trim() && !profile.goals.includes(newGoal.trim())) {
      setProfile(prev => ({
        ...prev,
        goals: [...prev.goals, newGoal.trim()]
      }));
      setNewGoal("");
    }
  };

  const removeGoal = (goalToRemove: string) => {
    setProfile(prev => ({
      ...prev,
      goals: prev.goals.filter(goal => goal !== goalToRemove)
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Header */}
      <header className="safe-area-top px-6 py-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold font-heading">Profile</h1>
          </div>

          <Button
            onClick={isEditing ? handleSave : () => setIsEditing(true)}
            size="sm"
            className={cn(
              "transition-all duration-200",
              isEditing ? "bg-gradient-primary" : "bg-gradient-secondary"
            )}
          >
            {isEditing ? (
              <>
                <Save className="w-4 h-4 mr-1" />
                Save
              </>
            ) : (
              "Edit"
            )}
          </Button>
        </div>
      </header>

      {/* Profile Content */}
      <div className="px-6 pb-6 space-y-6">
        {/* Profile Picture and Basic Info */}
        <div className="glass-card text-center">
          <div className="relative inline-block mb-4">
            <div className="w-24 h-24 bg-gradient-secondary rounded-full flex items-center justify-center mx-auto">
              <User className="w-12 h-12 text-white" />
            </div>
            {isEditing && (
              <Button
                size="sm"
                className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0"
                onClick={() => toast({ title: "Coming soon", description: "Photo upload will be available soon!" })}
              >
                <Camera className="w-4 h-4" />
              </Button>
            )}
          </div>

          {isEditing ? (
            <div className="space-y-4">
              <Input
                placeholder="Your name"
                value={profile.name}
                onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                className="text-center text-lg font-semibold glass"
              />
              <Textarea
                placeholder="Tell us about yourself..."
                value={profile.bio}
                onChange={(e) => setProfile(prev => ({ ...prev, bio: e.target.value }))}
                className="glass resize-none"
                rows={3}
              />
            </div>
          ) : (
            <div>
              <h2 className="text-xl font-semibold mb-2">
                {profile.name || "Your Name"}
              </h2>
              <p className="text-muted-foreground">
                {profile.bio || "Add a bio to tell others about yourself"}
              </p>
            </div>
          )}
        </div>

        {/* Skills Section */}
        <div className="glass-card">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            Skills & Expertise
          </h3>

          <div className="flex flex-wrap gap-2 mb-4">
            {profile.skills.map((skill) => (
              <Badge
                key={skill}
                variant="secondary"
                className="text-sm relative group"
              >
                {skill}
                {isEditing && (
                  <button
                    onClick={() => removeSkill(skill)}
                    className="ml-2 text-destructive hover:text-destructive-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </Badge>
            ))}
          </div>

          {isEditing && (
            <div className="flex gap-2">
              <Input
                placeholder="Add a skill"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                className="glass"
              />
              <Button onClick={addSkill} size="sm" variant="outline">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          )}

          {profile.skills.length === 0 && !isEditing && (
            <p className="text-muted-foreground text-sm">
              No skills added yet. Edit your profile to add skills.
            </p>
          )}
        </div>

        {/* Goals Section */}
        <div className="glass-card">
          <h3 className="text-lg font-semibold mb-4">
            Networking Goals
          </h3>

          <div className="space-y-2 mb-4">
            {profile.goals.map((goal) => (
              <div
                key={goal}
                className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
              >
                <span className="text-sm">{goal}</span>
                {isEditing && (
                  <Button
                    onClick={() => removeGoal(goal)}
                    size="sm"
                    variant="ghost"
                    className="text-destructive hover:text-destructive-foreground"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>

          {isEditing && (
            <div className="flex gap-2">
              <Input
                placeholder="Add a networking goal"
                value={newGoal}
                onChange={(e) => setNewGoal(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addGoal()}
                className="glass"
              />
              <Button onClick={addGoal} size="sm" variant="outline">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          )}

          {profile.goals.length === 0 && !isEditing && (
            <p className="text-muted-foreground text-sm">
              No goals set yet. Edit your profile to add networking goals.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}