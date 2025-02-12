import React from "react";
import { 
    BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, 
    CartesianGrid, Legend as RechartsLegend,
    LineChart, Line, ResponsiveContainer,
    ScatterChart, Scatter, ZAxis
} from "recharts";
import { Radar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip as ChartJSTooltip,
    Legend as ChartJSLegend
} from 'chart.js';

const VisualizationDashboard = ({ communicationsData }) => {
    React.useEffect(() => {
        ChartJS.register(
            RadialLinearScale,
            PointElement,
            LineElement,
            Filler,
            ChartJSTooltip,
            ChartJSLegend
        );
    }, []);

    if (!communicationsData) {
        return <p className="text-center text-red-500">No data available for visualization.</p>;
    }

    // Process data for emotion counts
    const primaryEmotionCounts = {};
    const secondaryEmotionCounts = {};

    communicationsData.forEach(communication => {
        const primaryEmotion = communication.primaryEmotion?.emotion || "Unknown";
        primaryEmotionCounts[primaryEmotion] = (primaryEmotionCounts[primaryEmotion] || 0) + 1;

        communication.secondaryEmotions?.forEach(secEmotion => {
            const emotion = secEmotion.emotion || "Unknown";
            secondaryEmotionCounts[emotion] = (secondaryEmotionCounts[emotion] || 0) + 1;
        });
    });

    // Prepare data for combined bar chart
    const emotionCounts = {};
    for (const [emotion, count] of Object.entries(primaryEmotionCounts)) {
        emotionCounts[emotion] = { primary: count, secondary: 0 };
    }
    for (const [emotion, count] of Object.entries(secondaryEmotionCounts)) {
        if (!emotionCounts[emotion]) {
            emotionCounts[emotion] = { primary: 0, secondary: count };
        } else {
            emotionCounts[emotion].secondary = count;
        }
    }

    const combinedData = Object.entries(emotionCounts).map(([emotion, counts]) => ({
        name: emotion,
        Primary: counts.primary,
        Secondary: counts.secondary,
    }));

    // Prepare data for radar chart
    const radarData = {
        labels: Object.keys(emotionCounts),
        datasets: [
            {
                label: 'Primary Emotions',
                data: Object.values(emotionCounts).map(counts => counts.primary),
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1,
            },
            {
                label: 'Secondary Emotions',
                data: Object.values(emotionCounts).map(counts => counts.secondary),
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1,
            }
        ],
    };

    // Process data for model comparison
    const modelStats = communicationsData.reduce((acc, item) => {
        if (!acc[item.modelVersion]) {
            acc[item.modelVersion] = {
                count: 0,
                avgConfidence: 0
            };
        }
        acc[item.modelVersion].count++;
        acc[item.modelVersion].avgConfidence += item.confidenceRating;
        return acc;
    }, {});

    Object.keys(modelStats).forEach(model => {
        modelStats[model].avgConfidence /= modelStats[model].count;
    });

    const modelComparisonData = Object.entries(modelStats).map(([model, stats]) => ({
        model: model,
        confidence: stats.avgConfidence,
        count: stats.count
    }));

    // Process data for confidence timeline
    const timelineData = communicationsData.map(item => ({
        timestamp: new Date(item.timestamp).toLocaleString(),
        confidence: item.confidenceRating,
        model: item.modelVersion
    }));

    const radarOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Emotion Intensity Distribution',
            },
        },
        scales: {
            r: {
                min: 0,
                ticks: {
                    stepSize: 1
                }
            }
        }
    };

    return (
        <div className="w-full min-h-screen p-4 space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
            {/* Combined Emotions Bar Chart */}
            <div className="bg-white p-4 rounded-lg shadow h-full flex flex-col">
              <h3 className="text-xl font-semibold text-center mb-4">Emotion Distribution</h3>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={combinedData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <RechartsTooltip />
                  <RechartsLegend />
                  <Bar dataKey="Primary" fill="hsl(var(--chart-1))" />
                  <Bar dataKey="Secondary" fill="hsl(var(--chart-2))" />
                </BarChart>
              </ResponsiveContainer>
            </div>
      
            {/* Radar Chart */}
            <div className="bg-white p-4 rounded-lg shadow h-full flex flex-col">
              <h3 className="text-xl font-semibold text-center mb-4">Emotion Intensity</h3>
              <div className="h-full flex items-center justify-center">
                <Radar data={radarData} options={radarOptions} />
              </div>
            </div>
      
            {/* Model Comparison */}
            <div className="bg-white p-4 rounded-lg shadow h-full flex flex-col">
              <h3 className="text-xl font-semibold text-center mb-4">Model Performance</h3>
              <ResponsiveContainer width="100%" height={400}>
                <ScatterChart>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="count" name="Analysis Count" />
                  <YAxis dataKey="confidence" name="Confidence" domain={[60, 100]} />
                  <ZAxis range={[100, 100]} />
                  <RechartsTooltip cursor={{ strokeDasharray: "3 3" }} />
                  <RechartsLegend />
                  <Scatter name="Models" data={modelComparisonData} fill="#8884d8" />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
      
            {/* Confidence Timeline */}
            <div className="bg-white p-4 rounded-lg shadow h-full flex flex-col">
              <h3 className="text-xl font-semibold text-center mb-4">Confidence Timeline</h3>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={timelineData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    tick={{ fontSize: 10 }}
                    dataKey="timestamp"
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis domain={[60, 100]} />
                  <RechartsTooltip />
                  <RechartsLegend />
                  <Line type="monotone" dataKey="confidence" stroke="#8884d8" name="Confidence Rating" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
      
          {/* Total Communications Count */}
          <div className="text-center text-lg font-medium">
            Total Communications: {communicationsData.length}
          </div>
        </div>
      );
      
};

export default VisualizationDashboard;