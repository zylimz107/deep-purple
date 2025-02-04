import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
    Alert,
    AlertDescription,
} from "@/components/ui/alert";
import { getAllModels } from "@/api";
import {
    uploadFile,
    saveCommunication,
} from "@/api";

const CommunicationForm = ({ setResponse, setAllCommunications, setDeleteNotification, clearNotification, clearResponse }) => {
    const [content, setContent] = useState('');
    const [operation, setOperation] = useState('');
    const [modelName, setModelName] = useState('');
    const [file, setFile] = useState(null); // State for the uploaded file
    const [models, setModels] = useState([]);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]); // Set the file selected by the user
    };

    const fetchModels = async () => {
        try {
          const response = await getAllModels();
          console.log("Fetched models:", response.data);
          setModels(response.data);
        } catch (error) {
          console.error("Error fetching models:", error);
        }
      };
    
      useEffect(() => {
        fetchModels();
      }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        clearResponse();
    
        try {
            let res;
    
            const dataToSend = { content, modelName };
    
            if (operation === 'upload') {
                res = await uploadFile(file, modelName);
            } else if (operation === 'save') {
                res = await saveCommunication(dataToSend);
                return;
            }
    
            setResponse(res?.data);
            if (['save', 'upload'].includes(operation)) {
                setContent('');
            }
        } catch (error) {
            setResponse({ error: error.message });
        }
    };

    const getDescription = (operation) => {
        switch (operation) {
          case "save":
            return "Analyze the content and save the analysis.";
          case "upload":
            return "Upload a file for analysis.";
          default:
            return "Please select an operation.";
        }
    };

    return (
        <Card className="p-4">
            <CardContent>
                <form onSubmit={handleSubmit} className="w-[1000px] space-y-4">
                    {operation !== 'get' && operation !== 'delete' && (
                        <div>
                            <Label htmlFor="content">Content</Label>
                            <Textarea
                                id="content"
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                placeholder="Enter communication content"
                                required={operation === 'save'}
                                maxLength={1000}
                            />
                        </div>
                    )}

                    <div>
                        <Label htmlFor="operation">Operation</Label>
                        <Select
                            id="operation"
                            value={operation}
                            onValueChange={setOperation}
                        >
                            <SelectTrigger className="w-[500px]">
                                <SelectValue placeholder="select operation" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectItem value="save">Save</SelectItem>
                                    <SelectItem value="upload">Upload File</SelectItem> {/* New Upload option */}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        <Separator className="w-[500px] my-2" />
                        <Alert className="w-[500px] border-purple-800">
                            <AlertDescription className="text-purple-800">
                                {getDescription(operation)}
                            </AlertDescription>
                        </Alert>
                    </div>

                    {/* File input field for upload */}
                    {operation === 'upload' && (
                        <div>
                            <Label htmlFor="file">Select File</Label>
                            <Input
                                type="file"
                                id="file"
                                onChange={handleFileChange}
                                required
                            />
                        </div>
                    )}

                    <div>
                        <Label htmlFor="modelName">Model Name</Label>
                        <Select
                        id="modelName"
                        value={modelName} // The current selected model
                       onValueChange={(value) => setModelName(value)} // Update modelName when a model is selected
                         >
                        <SelectTrigger className="w-[500px]">
                         <SelectValue placeholder="Select model" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                               {/* Placeholder option */}
                                <SelectItem value="placeholder" disabled>Select a model</SelectItem>
                                {models.length > 0 ? (
                                  models.map((model) => (
                                <SelectItem key={model.id} value={model.name}>
                              {model.name}
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem value="loading" disabled>Loading models...</SelectItem> 
                          )}
                      </SelectGroup>
                    </SelectContent>
                    </Select>
                    </div>

                    <Separator className="w-[500px] my-4" />
                    <Button type="submit" className="w-[500px]">
                        Submit
                    </Button>
                </form>
                <Separator className="my-4" />
            </CardContent>
        </Card>
    );
};

export default CommunicationForm;
