import React, { useState, useEffect } from "react";
import ModelManagement from "@/components/ModelManagement";
import EmotionCategoryManager from "@/components/EmotionCategoryManager/EmotionCategoryManager";
import WordEmotionManager from "@/components/EmotionCategoryManager/WordEmotionAssociation";
import useEmotionApi from "@/api";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const EmotionCategoryPage = () => {
  const { getAllCustomModels } = useEmotionApi();
  const [models, setModels] = useState([]);
  const [selectedModel, setSelectedModel] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0); 

  // Fetch models from the backend
  const fetchModels = async () => {
    try {
      const response = await getAllCustomModels();
      console.log("Fetched models:", response.data);
      setModels(response.data);
    } catch (error) {
      console.error("Error fetching models:", error);
    }
  };

  // Fetch models on initial render
  useEffect(() => {
    fetchModels();
  }, []);

  return (
    <div className="w-full min-h-screen p-4 space-y-8">
      <h1 className="text-2xl font-bold text-center">Emotion Model Manager</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 h-full">
        {/* Model Management Component */}
        <ModelManagement 
          refreshModels={fetchModels}             
          refreshTrigger={refreshTrigger}
          onRefresh={() => setRefreshTrigger((prev) => prev + 1)}  />

        <div>
          {/* Select Model */}
          <Card className="p-4 shadow-lg">
            <CardHeader>
              <CardTitle>Select a Model</CardTitle>
            </CardHeader>
            <CardContent>
              <Select
                value={selectedModel?.id || ""}
                onValueChange={(modelId) => {
                  const model = models.find((model) => model.id === modelId);
                  setSelectedModel(model);
                  setRefreshTrigger((prev) => prev + 1);
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choose a model" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="placeholder" disabled>
                      Select a model
                    </SelectItem>
                    {models.length > 0 ? (
                      models.map((model) => (
                        <SelectItem key={model.id} value={model.id}>
                          {model.name}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="loading" disabled>
                        Loading models...
                      </SelectItem>
                    )}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Emotion Category Manager */}
          {selectedModel && (
            <EmotionCategoryManager 
            key={selectedModel.id + refreshTrigger}
            selectedModelId={selectedModel.id}
            refreshTrigger={refreshTrigger}
            onRefresh={() => setRefreshTrigger((prev) => prev + 1)} />
          )}

          {/* Word-Emotion Manager */}
          {selectedModel && (
            <WordEmotionManager selectedModelId={selectedModel.id} 
            refreshTrigger={refreshTrigger}
            onRefresh={() => setRefreshTrigger((prev) => prev + 1)}/>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmotionCategoryPage;
