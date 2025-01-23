import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "react-oidc-context";
import { Button } from "@/components/ui/button"; // ShadCN Button
import { LogOut } from "lucide-react"; // For the Logout Icon

import LandingPage from "@/pages/LandingPage";
import AnalysisPage from "@/pages/AnalysisPage";
import InboxPage from "@/pages/InboxPage";
import SearchPage from "@/pages/SearchPage";
import SettingsPage from "@/pages/SettingsPage";
import EmotionCategoryPage from "@/pages/EmotionCategoryPage";
import AdminDashboardPage from "@/pages/AdminDashboardPage";
import UserDashboard from "@/pages/UserDashboard";
import Layout from "@/components/layout";

function App() {
  const auth = useAuth();

  const signOutRedirect = () => {
    const clientId = "2flkekbciug2qi1uockcmi16d2"; // Replace with your actual App Client ID
    const logoutUri = "http://app.purpleproj.click"; // Replace with your app's logout redirect URI
    const cognitoDomain = "https://ap-southeast-1ijzndsfnv.auth.ap-southeast-1.amazoncognito.com"; // Replace with your Cognito domain
    window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(logoutUri)}`;
  };

  if (auth.isLoading) {
    return <div>Loading...</div>;
  }

  if (auth.error) {
    return <div>Error: {auth.error.message}</div>;
  }

  if (!auth.isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-semibold mb-4">Welcome to Your App</h1>
        <Button variant="default" onClick={() => auth.signinRedirect()}>
          Sign in
        </Button>
      </div>
    );
  }

  return (
    <Router>
      {/* Logout Button */}
      <Button
        onClick={signOutRedirect}
        className="absolute top-4 right-4 bg-red-500 hover:bg-red-600 text-white"
      >
        <LogOut className="mr-2" />
        Logout
      </Button>

      <Routes>
        {/* Public Route */}
        <Route path="/" element={<UserDashboard />} />

        {/* Authenticated Routes */}
        <Route
          path="/*"
          element={
            <Layout>
              <Routes>
                <Route path="analysis" element={<AnalysisPage />} />
                <Route path="inbox" element={<InboxPage />} />
                <Route path="search" element={<SearchPage />} />
                <Route path="settings" element={<SettingsPage />} />
                <Route path="emotion" element={<EmotionCategoryPage />} />
                <Route path="admin" element={<AdminDashboardPage />} />
                <Route path="user" element={<UserDashboard />} />
              </Routes>
            </Layout>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
