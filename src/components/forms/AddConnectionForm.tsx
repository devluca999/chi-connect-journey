import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DialogClose } from "@/components/ui/dialog";
import { User, Building, AtSign } from "lucide-react";
import { Connection } from "@/lib/storage";
import { toast } from "@/hooks/use-toast";

interface AddConnectionFormProps {
  onSubmit: (connectionData: Omit<Connection, 'id' | 'eventId' | 'eventTitle' | 'addedDate'>) => void;
}

export function AddConnectionForm({ onSubmit }: AddConnectionFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    company: '',
    socialHandle: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.role.trim() || !formData.socialHandle.trim()) {
      toast({
        title: "Required fields missing",
        description: "Please fill in name, role, and social handle.",
        variant: "destructive"
      });
      return;
    }

    // Clean up social handle
    const cleanSocialHandle = formData.socialHandle.replace('@', '');

    onSubmit({
      name: formData.name.trim(),
      role: formData.role.trim(),
      company: formData.company.trim() || undefined,
      socialHandle: cleanSocialHandle
    });

    // Reset form
    setFormData({
      name: '',
      role: '',
      company: '',
      socialHandle: ''
    });

    toast({
      title: "Connection added",
      description: `${formData.name} has been added to your connections.`
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Name */}
      <div className="space-y-2">
        <Label htmlFor="name" className="text-sm font-medium flex items-center">
          <User className="w-4 h-4 mr-1" />
          Name *
        </Label>
        <Input
          id="name"
          placeholder="Full name"
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          className="glass"
          required
        />
      </div>

      {/* Role */}
      <div className="space-y-2">
        <Label htmlFor="role" className="text-sm font-medium">
          Role / Title *
        </Label>
        <Input
          id="role"
          placeholder="e.g. Software Engineer, Marketing Manager"
          value={formData.role}
          onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
          className="glass"
          required
        />
      </div>

      {/* Company */}
      <div className="space-y-2">
        <Label htmlFor="company" className="text-sm font-medium flex items-center">
          <Building className="w-4 h-4 mr-1" />
          Company
        </Label>
        <Input
          id="company"
          placeholder="Company name (optional)"
          value={formData.company}
          onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
          className="glass"
        />
      </div>

      {/* Social Handle */}
      <div className="space-y-2">
        <Label htmlFor="socialHandle" className="text-sm font-medium flex items-center">
          <AtSign className="w-4 h-4 mr-1" />
          Social Handle *
        </Label>
        <Input
          id="socialHandle"
          placeholder="@username or username"
          value={formData.socialHandle}
          onChange={(e) => setFormData(prev => ({ ...prev, socialHandle: e.target.value }))}
          className="glass"
          required
        />
        <p className="text-xs text-muted-foreground">
          Twitter/X handle or other social media username
        </p>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-2 pt-4">
        <DialogClose asChild>
          <Button variant="outline" type="button">
            Cancel
          </Button>
        </DialogClose>
        <DialogClose asChild>
          <Button type="submit" className="bg-gradient-primary">
            Add Connection
          </Button>
        </DialogClose>
      </div>
    </form>
  );
}