import React from "react";
// Import your page components
import InboxPage from "@/pages/InboxPage";
import SearchPage from "@/pages/SearchPage";
import SettingsPage from "@/pages/SettingsPage";
import AnalysisPage from "@/pages/AnalysisPage";
import EmotionCategoryPage from "@/pages/EmotionCategoryPage";
import UserDashboard from "@/pages/UserDashboard";
import LandingPage from "@/pages/LandingPage"

// Define the shape of a route
interface Route {
  path: string;
  component: React.ComponentType<any>;
  exact?: boolean;
}



// Define your routes
const routes: Route[] = [
  { path: "/inbox", component: InboxPage },
  { path: "/emotion", component: EmotionCategoryPage },
  { path: "/search", component: SearchPage },
  { path: "/settings", component: SettingsPage },
  { path: "/analysis", component: AnalysisPage},
  { path: "/user", component: UserDashboard},
  { path: "/", component: LandingPage},
];

export default routes;
