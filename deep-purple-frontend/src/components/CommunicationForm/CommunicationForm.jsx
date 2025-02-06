import React, { useState, useEffect } from "react";
import axios from "axios";
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { getAllModels } from "@/api";
import { uploadFile, saveCommunication } from "@/api";

const CommunicationForm = ({ setResponse, clearNotification, clearResponse }) => {
    const [content, setContent] = useState("");
    const [operation, setOperation] = useState("");
    const [modelName, setModelName] = useState("");
    const [file, setFile] = useState(null);
    const [models, setModels] = useState([]);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        const fetchModels = async () => {
            try {
                const response = await getAllModels();
                setModels(response.data);
            } catch (error) {
                console.error("Error fetching models:", error);
            }
        };
        fetchModels();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        clearNotification();
        clearResponse();

        // Validation
        let validationErrors = {};
        if (!operation) validationErrors.operation = "Please select an operation.";
        if (!modelName) validationErrors.modelName = "Please select a model.";
        if (operation === "save" && !content) validationErrors.content = "Content is required.";
        if (operation === "upload" && !file) validationErrors.file = "Please select a file.";

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        try {
            let res;
            const dataToSend = { content, modelName };

            if (operation === "upload") {
                res = await uploadFile(file, modelName);
            } else if (operation === "save") {
                res = await saveCommunication(dataToSend);
            }

            setResponse(res?.data);
            setContent("");
        } catch (error) {
            setResponse({ error: error.message });
        }
    };

    return (
        <Card className="p-4">
            <CardContent>
                <form onSubmit={handleSubmit} className="w-[1000px] space-y-4">
                    <div>
                        <Label htmlFor="operation">Operation</Label>
                        <Select id="operation" value={operation} onValueChange={setOperation}>
                            <SelectTrigger className="w-[500px]">
                                <SelectValue placeholder="Select operation" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectItem value="save">Save</SelectItem>
                                    <SelectItem value="upload">Upload File</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        {errors.operation && <p className="text-red-600">{errors.operation}</p>}
                    </div>

                    {operation === "save" && (
                        <div>
                            <Label htmlFor="content">Content</Label>
                            <Textarea
                                id="content"
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                placeholder="Enter communication content"
                                maxLength={1000}
                                required
                            />
                            {errors.content && <p className="text-red-600">{errors.content}</p>}
                        </div>
                    )}

                    {operation === "upload" && (
                        <div>
                            <Label htmlFor="file">Select File</Label>
                            <Input type="file" id="file" onChange={(e) => setFile(e.target.files[0])} required />
                            {errors.file && <p className="text-red-600">{errors.file}</p>}
                        </div>
                    )}

                    <div>
                        <Label htmlFor="modelName">Model Name</Label>
                        <Select id="modelName" value={modelName} onValueChange={setModelName}>
                            <SelectTrigger className="w-[500px]">
                                <SelectValue placeholder="Select model" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectItem value="placeholder" disabled>
                                        Select a model
                                    </SelectItem>
                                    {models.length > 0 ? (
                                        models.map((model) => (
                                            <SelectItem key={model.id} value={model.name}>
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
                        {errors.modelName && <p className="text-red-600">{errors.modelName}</p>}
                    </div>

                    <Separator className="w-[500px] my-4" />
                    <Button type="submit" className="w-[500px]">
                        Submit
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
};

export default CommunicationForm;
