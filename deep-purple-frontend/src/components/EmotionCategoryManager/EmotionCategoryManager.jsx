import React, { useState, useEffect } from "react";
import useEmotionApi from "@/api";
import { Input } from "@/components/ui/input"; // Replace with the correct shadcn Input component import
import { Button } from "@/components/ui/button"; // Replace with the correct shadcn Button component import
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"; // Replace with the correct Card imports


const EmotionCategoryManager = ({ selectedModelId , refreshTrigger, onRefresh }) => {
  const { createCategory, getCategoriesByModel, deleteCategory } = useEmotionApi();
  const [categories, setCategories] = useState([]);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [, forceUpdate] = useState(0);

  const fetchCategories = async () => {
    try {
      const response = await getCategoriesByModel(selectedModelId);
      console.log("Fetched categories:", response.data);
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
    forceUpdate((prev) => prev + 1); 
  }, [selectedModelId, refreshTrigger]);

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) {
      alert("Category name cannot be empty!");
      return;
    }

    try {
      await createCategory(selectedModelId, newCategoryName);
      setNewCategoryName("");
      fetchCategories();
      onRefresh(); // <== Notify parent to refresh
    } catch (error) {
      console.error("Error adding category:", error);
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;
    console.log("Deleting category with ID:", id);
      try {
        await deleteCategory(id);
        console.log("Successfully deleted category:", id); 
        fetchCategories();
        onRefresh(); // <== Notify parent to refresh
      } catch (error) {
        console.error("Error deleting category:", error);
      }
    };



  return (
    <Card className="p-4 shadow-lg w-full h-auto">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Manage Emotion Categories</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2 mb-4">
          <Input
            type="text"
            placeholder="Enter category name"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            className="w-full"
          />
          <Button onClick={handleAddCategory} variant="default">
            Add
          </Button>
        </div>
        <ul className="bg-slate-100 p-2 rounded divide-y divide-slate-700">
          {categories.map((category) => (
            <li key={category.id} className="flex justify-between items-center">
              <strong>{category.emotion}</strong>
                <Button
                  className="my-1"
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDeleteCategory(category.id)}
                  >
                  Delete
                  </Button>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default EmotionCategoryManager;
