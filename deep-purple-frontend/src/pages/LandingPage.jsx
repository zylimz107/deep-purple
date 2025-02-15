import React, { useState, useEffect, useCallback } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import CommunicationForm from "@/components/CommunicationForm/CommunicationForm";
import { PieChart, Pie, Tooltip } from "recharts";
import Icon1 from '@/svg/icon1.png';
import Icon2 from '@/svg/icon2.png';
import Icon3 from '@/svg/icon3.png';

const LandingPage = () => {
  const [response, setResponse] = useState(null);
  const [deleteNotification, setDeleteNotification] = useState('');
  const [showForm, setShowForm] = useState(false);

  const clearNotification = useCallback(() => setDeleteNotification(''), []);
  const clearResponse = useCallback(() => setResponse(null), []);

  useEffect(() => {
    if (deleteNotification) {
      const timer = setTimeout(clearNotification, 3000);
      return () => clearTimeout(timer);
    }
  }, [deleteNotification, clearNotification]);

  // Prepare pie chart data from response
  const pieChartData = response ? [
    {
      name: response.primaryEmotion.emotion,
      value: response.primaryEmotion.percentage,
      fill: "hsl(var(--chart-1))", // You can customize the color for primary emotion
    },
    ...response.secondaryEmotions.map((secEmotion, index) => {
      const fillColor = `hsl(var(--chart-${index + 2}))`;
      return {
        name: secEmotion.emotion,
        value: secEmotion.percentage,
        fill: fillColor, };})
  ] : [];

  return (
    <div className="flex flex-col items-center">
      {/* Hero Section with Background Image */}
      <div className="flex flex-col justify-center items-center text-slate-100">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }} className="text-center">
          <h1 className="text-6xl font-bold mb-4">DeepPurple</h1>
          <p className="text-xl mb-8">Uncover the emotions behind your text with AI-powered analysis.</p>
        </motion.div>
      </div>

      {/* Infographics Section */}
      <div className="w-full pt-12">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }} className="text-center">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-slate-100 text-center mb-12">Why Choose DeepPurple Analysis?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <img src={Icon1} alt="Infographic 1" className="w-32 h-32 mx-auto mb-4"/>
              <h3 className="text-2xl font-semibold text-slate-100 mb-2">Accurate Emotion Detection</h3>
              <p className="text-slate-200">Our AI models accurately detect and analyze emotions in your text.</p>
            </div>
            <div className="text-center">
              <img src={Icon2} alt="Infographic 2" className="w-32 h-32 mx-auto mb-4"/>
              <h3 className="text-2xl font-semibold text-slate-100 mb-2">Detailed Insights</h3>
              <p className="text-slate-200">Get detailed insights into primary and secondary emotions.</p>
            </div>
            <div className="text-center">
              <img src={Icon3} alt="Infographic 3" className="w-32 h-32 mx-auto mb-4"/>
              <h3 className="text-2xl font-semibold text-slate-100 mb-2">User-Friendly Interface</h3>
              <p className="text-slate-200">Easy-to-use interface with clear and concise results.</p>
            </div>
          </div>
        </div>
        <div className="pt-10">
        <Button onClick={() => setShowForm(true)} className="bg-cyan-800 text-slate-200 px-8 py-4 rounded-lg hover:bg-cyan-900 transition text-lg">Try Analysis</Button>
        </div>
        </motion.div>
      </div>

      {/* Communication Form and Results Section */}
      <div className="w-full max-w-6xl mx-auto px-4 py-20">
        {showForm && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
            <CommunicationForm
              setResponse={setResponse}
              setDeleteNotification={setDeleteNotification}
              clearNotification={clearNotification}
              clearResponse={clearResponse}
            />
          </motion.div>
        )}

        {response && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.5 }}>
            <Card className="mb-5 w-full p-10">
              <h3 className="text-2xl font-semibold">Analysis Results:</h3>
              {response.error ? (
                <div className="text-red-500"><strong>Error:</strong> {response.error}</div>
              ) : (
                <>
                  {/* Emotion Pie Chart */}
                  <div className="mb-4">
                    <h4 className="font-medium text-purple-800">Emotion Distribution</h4>
                    <PieChart width={300} height={300}>
                      <Pie
                        data={pieChartData}
                        dataKey="value"
                        nameKey="name"
                        innerRadius={60}
                        outerRadius={80}
                        label
                      />
                      <Tooltip />
                    </PieChart>
                  </div>

                  {/* Other Operation Details */}
                  <div><strong>ID:</strong> {response.id || 'N/A'}</div>
                  <div><strong>Content:</strong> {response.content || 'N/A'}</div>
                  <div><strong>Primary Emotion:</strong>
                    {response.primaryEmotion.emotion}
                  </div>
                  <div><strong>Secondary Emotions:</strong>
                    {Array.isArray(response.secondaryEmotions) && response.secondaryEmotions.length > 0 ? (
                      <ul>
                        {response.secondaryEmotions.map((secEmotion, index) => (
                          <li key={index}>{secEmotion.emotion}</li>
                        ))}
                      </ul>
                    ) : 'No secondary emotions available'}
                  </div>
                  <div><strong>Model:</strong> {response.modelName || 'N/A'}</div>
                  <div><strong>AI Model Version:</strong> {response.modelVersion || 'N/A'}</div>
                  <div><strong>Confidence Rating:</strong> {response.confidenceRating || 'N/A'}</div>
                  <div><strong>Summary:</strong> {response.summary || 'N/A'}</div>
                  <div><strong>Timestamp:</strong> {response.timestamp ? new Date(response.timestamp).toLocaleString() : 'N/A'}</div>
                </>
              )}
            </Card>
          </motion.div>
        )}

        {deleteNotification && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="text-green-500 mt-2">
            {deleteNotification}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default LandingPage;