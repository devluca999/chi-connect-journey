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
    <div className="mobile-app bg-gradient-to-b from-background to-muted/20">
      {/* Header */}
      <header className="px-6 py-6 pt-12">
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-12 h-12 bg-gradient-secondary rounded-full flex items-center justify-center shadow-lg">
            <Users className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold font-heading">Connections</h1>
            <p className="text-muted-foreground text-lg">
              {connections.length} professional contacts
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Search connections..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 h-12 glass rounded-2xl text-lg"
          />
        </div>
      </header>

      {/* Connections List */}
      <div className="px-6 pb-6">
        {filteredConnections.length === 0 ? (
          <div className="glass-card native-card text-center py-16">
            {connections.length === 0 ? (
              <>
                <Users className="w-20 h-20 text-muted-foreground mx-auto mb-6" />
                <h3 className="text-xl font-semibold mb-3">No connections yet</h3>
                <p className="text-muted-foreground text-lg">
                  Add connections from events in your Timeline
                </p>
              </>
            ) : (
              <>
                <Search className="w-20 h-20 text-muted-foreground mx-auto mb-6" />
                <h3 className="text-xl font-semibold mb-3">No matches found</h3>
                <p className="text-muted-foreground text-lg">
                  Try a different search term
                </p>
              </>
            )}
          </div>
        ) : (
          <div className="space-y-6">
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
    <div className={cn("glass-card native-card interactive-enhanced", className)}>
      <div className="flex items-start space-x-4">
        {/* Avatar */}
        <div className="flex-shrink-0">
          <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center text-white text-lg font-bold shadow-lg">
            {connection.avatar || connection.name.charAt(0)}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Name and Role */}
          <div className="mb-4">
            <h3 className="font-bold text-foreground text-lg mb-1">{connection.name}</h3>
            <p className="text-muted-foreground text-base">{connection.role}</p>
            {connection.company && (
              <div className="flex items-center mt-2">
                <Building className="w-4 h-4 mr-2 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">{connection.company}</span>
              </div>
            )}
          </div>

          {/* Event and Date */}
          <div className="space-y-3 mb-4">
            <Badge variant="secondary" className="text-sm px-3 py-1">
              <Calendar className="w-4 h-4 mr-2" />
              {connection.eventTitle}
            </Badge>
            <p className="text-sm text-muted-foreground">
              Connected on {new Date(connection.addedDate).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric'
              })}
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={handleSocialClick}
              className="native-button"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              @{connection.socialHandle.replace('@', '')}
            </Button>

            {/* Delete Button */}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive hover:bg-destructive/10 native-button">
                  <Trash2 className="w-5 h-5" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="native-modal">
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Connection</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to remove {connection.name} from your connections? 
                    This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="native-button">Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={onDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90 native-button">
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </div>
    </div>
  );
}