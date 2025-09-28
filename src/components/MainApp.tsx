import { Routes, Route } from "react-router-dom";
import { BottomNavigation } from "./navigation/BottomNavigation";
import { FeedScreen } from "./screens/FeedScreen";
import { TimelineScreen } from "./screens/TimelineScreen";
import { ConnectionsScreen } from "./screens/ConnectionsScreen";
import { ProfileScreen } from "./screens/ProfileScreen";
import { SettingsScreen } from "./screens/SettingsScreen";

export function MainApp() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Main Content */}
      <main className="flex-1 pb-20">
        <Routes>
          <Route path="/" element={<FeedScreen />} />
          <Route path="/feed" element={<FeedScreen />} />
          <Route path="/timeline" element={<TimelineScreen />} />
          <Route path="/connections" element={<ConnectionsScreen />} />
          <Route path="/profile" element={<ProfileScreen />} />
          <Route path="/settings" element={<SettingsScreen />} />
        </Routes>
      </main>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
}