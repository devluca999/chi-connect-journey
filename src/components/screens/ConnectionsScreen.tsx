import { useState, useEffect } from "react";
import { Users, Search, Calendar, Building, Trash2, ExternalLink } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import { Connection, getConnections, deleteConnection } from "@/lib/storage";
import { cn } from "@/lib/utils";

export function ConnectionsScreen() {
  const [connections, setConnections] = useState<Connection[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredConnections, setFilteredConnections] = useState<Connection[]>([]);

  useEffect(() => {
    const allConnections = getConnections();
    setConnections(allConnections);
    setFilteredConnections(allConnections);
  }, []);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredConnections(connections);
    } else {
      const filtered = connections.filter(connection =>
        connection.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        connection.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
        connection.company?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        connection.eventTitle.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredConnections(filtered);
    }
  }, [searchQuery, connections]);

  const handleDeleteConnection = (connectionId: string) => {
    const updatedConnections = deleteConnection(connectionId);
    setConnections(updatedConnections);
  };

  const formatConnectionDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Header */}
      <header className="safe-area-top px-6 py-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-gradient-secondary rounded-full flex items-center justify-center">
            <Users className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold font-heading">Connections</h1>
            <p className="text-muted-foreground text-sm">
              {connections.length} professional contacts
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search connections..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 glass"
          />
        </div>
      </header>

      {/* Connections List */}
      <div className="px-6 pb-6">
        {filteredConnections.length === 0 ? (
          <div className="glass-card text-center py-12">
            {connections.length === 0 ? (
              <>
                <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No connections yet</h3>
                <p className="text-muted-foreground">
                  Add connections from events in your Timeline
                </p>
              </>
            ) : (
              <>
                <Search className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No matches found</h3>
                <p className="text-muted-foreground">
                  Try a different search term
                </p>
              </>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredConnections.map((connection, index) => (
              <ConnectionCard
                key={connection.id}
                connection={connection}
                onDelete={() => handleDeleteConnection(connection.id)}
                className={cn(
                  "animate-slide-up",
                  `[animation-delay:${index * 50}ms]`
                )}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

interface ConnectionCardProps {
  connection: Connection;
  onDelete: () => void;
  className?: string;
}

function ConnectionCard({ connection, onDelete, className }: ConnectionCardProps) {
  const handleSocialClick = () => {
    const url = connection.socialHandle.startsWith('@') 
      ? `https://twitter.com/${connection.socialHandle.slice(1)}`
      : `https://twitter.com/${connection.socialHandle}`;
    window.open(url, '_blank');
  };

  return (
    <div className={cn("glass-card", className)}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          {/* Name and Role */}
          <div className="mb-3">
            <h3 className="font-semibold text-foreground mb-1">{connection.name}</h3>
            <p className="text-sm text-muted-foreground">{connection.role}</p>
            {connection.company && (
              <div className="flex items-center mt-1">
                <Building className="w-3 h-3 mr-1 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">{connection.company}</span>
              </div>
            )}
          </div>

          {/* Event and Date */}
          <div className="space-y-2 mb-4">
            <Badge variant="secondary" className="text-xs">
              <Calendar className="w-3 h-3 mr-1" />
              {connection.eventTitle}
            </Badge>
              <p className="text-xs text-muted-foreground">
                Connected on {new Date(connection.addedDate).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </p>
          </div>

          {/* Social Handle */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleSocialClick}
            className="text-xs"
          >
            <ExternalLink className="w-3 h-3 mr-1" />
            @{connection.socialHandle.replace('@', '')}
          </Button>
        </div>

        {/* Delete Button */}
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive hover:bg-destructive/10">
              <Trash2 className="w-4 h-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Connection</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to remove {connection.name} from your connections? 
                This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={onDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}