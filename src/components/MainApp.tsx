import { Routes, Route } from "react-router-dom";
import { BottomNavigation } from "./navigation/BottomNavigation";
import { HomeScreen } from "./screens/HomeScreen";
import { FeedScreen } from "./screens/FeedScreen";
import { TimelineScreen } from "./screens/TimelineScreen";
import { ConnectionsScreen } from "./screens/ConnectionsScreen";
import { ProfileScreen } from "./screens/ProfileScreen";
import { SettingsScreen } from "./screens/SettingsScreen";

export function MainApp() {
  return (
    <div className="mobile-app bg-background flex flex-col">
      {/* Main Content */}
      <main className="flex-1 pb-20 status-bar-safe mobile-scroll">
        <Routes>
          <Route path="/" element={<HomeScreen />} />
          <Route path="/home" element={<HomeScreen />} />
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