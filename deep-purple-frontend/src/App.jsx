import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "react-oidc-context";
import { Button } from "@/components/ui/button"; // ShadCN Button
import { LogOut } from "lucide-react"; // For the Logout Icon

import LandingPage from "@/pages/LandingPage";
import AnalysisPage from "@/pages/AnalysisPage";
import EmotionCategoryPage from "@/pages/EmotionCategoryPage";
import UserDashboard from "@/pages/UserDashboard";
import Layout from "@/components/layout";
import CommunicationsPage from "./pages/communicationsPage";

function App() {
  const auth = useAuth();

  const signOutRedirect = () => {
    const clientId = "2flkekbciug2qi1uockcmi16d2"; // Replace with your actual App Client ID
    const logoutUri = "https://app.purpleproj.click"; // Replace with your app's logout redirect URI
    const cognitoDomain = "https://ap-southeast-1ijzndsfnv.auth.ap-southeast-1.amazoncognito.com"; // Replace with your Cognito domain

    // Redirect to Cognito logout and then navigate to the Landing Page
    auth.removeUser().then(() => {
      window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(logoutUri)}`;
    });
  };

  if (auth.isLoading) {
    return <div>Loading...</div>;
  }

  if (auth.error) {
    return <div>Error: {auth.error.message}</div>;
  }

  if (!auth.isAuthenticated) {
    return (
      <div className="w-full h-full bg-[url('@/svg/purpleBG.jpg')] bg-cover flex flex-col items-center justify-center min-h-screen relative">
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2">
          <Button className="bg-cyan-800 text-slate-200 px-8 py-4 rounded-lg hover:bg-cyan-900 transition text-lg " variant="default" onClick={() => auth.signinRedirect()}>
            Sign in or Register
          </Button>
        </div>
        <div className="py-20">
        <LandingPage />
        </div>
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
        {/* Authenticated Routes */}
        <Route
          path="/*"
          element={
            <Layout>
              <Routes>
                <Route path="/" element={<Navigate to="/analysis" />} /> {/* Default redirect inside Layout */}
                <Route path="analysis" element={<AnalysisPage />} />
                <Route path="communications" element={<CommunicationsPage />} />
                <Route path="emotion" element={<EmotionCategoryPage />} />
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

