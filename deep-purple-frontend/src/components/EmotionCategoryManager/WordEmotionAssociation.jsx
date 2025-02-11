import React, { useState, useEffect } from "react";
import { getAssociationsForModel, createAssociation, deleteAssociation, getCategoriesByModel } from "@/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const WordEmotionManager = ({ selectedModelId, refreshTrigger, onRefresh }) => {
  const [associations, setAssociations] = useState([]);
  const [word, setWord] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");

  // Fetch associations for the selected model
  const fetchAssociations = async () => {
    try {
      const response = await getAssociationsForModel(selectedModelId);
      console.log("Fetched associations:", response.data);
      setAssociations(response.data);
    } catch (error) {
      console.error("Error fetching associations:", error);
    }
  };

  // Fetch categories for the selected model
  const fetchCategories = async () => {
    try {
      const response = await getCategoriesByModel(selectedModelId);
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  // Fetch data when model changes or refresh is triggered
  useEffect(() => {
    if (selectedModelId) {
      fetchAssociations();
      fetchCategories();
    }
  }, [selectedModelId, refreshTrigger]); // <== Triggers refresh

  // Handle adding a word-emotion association
  const handleAddAssociation = async () => {
    if (!word.trim()) {
      alert("Word cannot be empty!");
      return;
    }
    if (!selectedCategoryId) {
      alert("Please select an emotion category!");
      return;
    }

    try {
      await createAssociation(word, selectedCategoryId);
      setWord(""); 
      setSelectedCategoryId(""); 
      fetchCategories();
      onRefresh(); // <== Notify parent to refresh
    } catch (error) {
      console.error("Error creating association:", error);
    }
  };

  // Handle deleting an association
  const handleDeleteAssociation = async (id) => {
    if (!window.confirm("Are you sure you want to delete this association?")) return;
    try {
      await deleteAssociation(id);
      fetchCategories();
      onRefresh(); // <== Notify parent to refresh
    } catch (error) {
      console.error("Error deleting association:", error);
    }
  };

  return (
    <Card className="p-4 shadow-lg">
      <CardHeader>
        <CardTitle>Manage Word-Emotion Associations</CardTitle>
      </CardHeader>
      <CardContent>
        <div>
          <div className="flex gap-2 mb-4">
            <Input
              type="text"
              placeholder="Enter word"
              value={word}
              onChange={(e) => setWord(e.target.value)}
              className="w-full"
            />
            <Select
              value={selectedCategoryId}
              onValueChange={setSelectedCategoryId}
              className="w-[200px]"
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Emotion Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {categories.length > 0 ? (
                    categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.emotion}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="loading" disabled>
                      Loading categories...
                    </SelectItem>
                  )}
                </SelectGroup>
              </SelectContent>
            </Select>
            <Button onClick={handleAddAssociation}>Add</Button>
          </div>

          <ul className="bg-slate-100 p-2 rounded divide-y divide-slate-700">
            {associations.length > 0 ? (
              associations.map((assoc) => (
                <li key={assoc.id} className="flex justify-between items-center ">
                  <span>
                    {assoc.word} - {assoc.emotionCategory}
                  </span>
                  <Button
                    className="my-1"
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteAssociation(assoc.id)}
                  >
                    Delete
                  </Button>
                </li>
              ))
            ) : (
              <p>No associations available.</p>
            )}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default WordEmotionManager;

