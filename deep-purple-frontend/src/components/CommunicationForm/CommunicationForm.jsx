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
import { getAllModels } from "@/api";
import { uploadFile, saveCommunication, uploadBatchFiles } from "@/api";
import { ClipLoader } from "react-spinners";

const CommunicationForm = ({ setResponse, clearNotification, clearResponse }) => {
    const [content, setContent] = useState("");
    const [operation, setOperation] = useState("");
    const [modelName, setModelName] = useState("");
    const [file, setFile] = useState(null);
    const [files, setFiles] = useState([]);
    const [models, setModels] = useState([]);
    const [errors, setErrors] = useState({});
    const [pdfUrl, setPdfUrl] = useState("");
    const [loading, setLoading] = useState(false);
    const Spinner = () => <ClipLoader size={20} color="#ffffff" />;

    useEffect(() => {
        const fetchModels = async () => {
            try {
                const response = await getAllModels();
                console.log("API Full Response:", response);
    
                let modelsData = response.data;
    
                // Ensure `modelsData` is correctly parsed JSON
                if (typeof modelsData === "string") {
                    try {
                        modelsData = JSON.parse(modelsData);
                    } catch (error) {
                        console.error("Error parsing models JSON:", error);
                        modelsData = [];
                    }
                }
    
                // Log to check structure
                console.log("Parsed Models Data:", modelsData);
    
                // Ensure modelsData is an array before setting state
                if (!Array.isArray(modelsData)) {
                    console.error("Error: modelsData is not an array!", modelsData);
                    modelsData = []; // Prevent crash
                }
    
                setModels(modelsData);
            } catch (error) {
                console.error("Error fetching models:", error);
                setModels([]); // Fallback to empty array
            }
        };
    
        fetchModels();
    }, []);
    
    
    const handleFileChange = (e) => {
        setFiles([...e.target.files]); // Store multiple files in state
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        clearNotification();
        clearResponse();
        setPdfUrl("");
        setLoading(true);

        let validationErrors = {};
        if (!operation) validationErrors.operation = "Please select an operation.";
        if (!modelName) validationErrors.modelName = "Please select a model.";
        if (operation === "save" && !content) validationErrors.content = "Content is required.";
        if (operation === "upload" && !file) validationErrors.file = "Please select a file.";
        if (operation === "batch-upload" && files.length === 0) validationErrors.files = "Please select at least one file.";

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            setLoading(false);
            return;
        }

        try {
            let res;
            const dataToSend = { content, modelName };

            if (operation === "upload") {
                res = await uploadFile(file, modelName);
            } else if (operation === "save") {
                res = await saveCommunication(dataToSend);
            } else if (operation === "batch-upload") {
                const formData = new FormData();
                files.forEach(file => formData.append("files", file));
                formData.append("modelName", modelName);

                res = await uploadBatchFiles(formData);
            }
            console.log(res);

        // Check if the response is a PDF (blob) and handle accordingly
        if (res && res.data && res.data instanceof Blob) {
            const pdfBlob = res.data;  // The blob response from the server

            // Create a URL for the PDF file
            const pdfUrl = URL.createObjectURL(pdfBlob);
            setPdfUrl(pdfUrl);  // Set the URL for downloading the PDF
            setResponse(null);   // Reset any previous response
        } else {
            // Handle non-PDF response (regular data)
            setResponse(res?.data);  // Set the regular response data
            setPdfUrl("");  // Ensure PDF URL is cleared if not a PDF
        }
            setFiles([]);
            setContent("");
        } catch (error) {
            setResponse({ error: error.message });
        }   finally {
            setLoading(false);  // Turn off loading after the request completes
        }
    };

    return (
        <Card className="p-4">
            <CardContent>
                <form onSubmit={handleSubmit} className="w-[1000px] space-y-4">

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
                                disabled={loading}
                            />
                            {errors.content && <p className="text-red-600">{errors.content}</p>}
                        </div>
                    )}

                    {operation === "upload" && (
                    <div>
                        <Label htmlFor="file">Select File</Label>
                        <Input
                            type="file"
                            id="file"
                            onChange={(e) => setFile(e.target.files[0])}
                            required
                            disabled={loading} // Disable during loading
                        />
                        {errors.file && <p className="text-red-600">{errors.file}</p>}
                    </div>
                    )}

                    {operation === "batch-upload" && (
                    <div>
                        <Label htmlFor="files">Select Files</Label>
                        <Input
                            type="file"
                            id="files"
                            multiple
                            onChange={handleFileChange}
                            required
                            disabled={loading} // Disable during loading
                        />
                        {errors.files && <p className="text-red-600">{errors.files}</p>}
                    </div>
                    )}

                    <div>
                        <Label htmlFor="operation">Operation</Label>
                        <Select
                        id="operation"
                        value={operation}
                        onValueChange={setOperation}
                        disabled={loading} // Disable during loading
                        >
                            <SelectTrigger className="w-[500px]">
                                <SelectValue placeholder="Select operation" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectItem value="save">Save</SelectItem>
                                    <SelectItem value="upload">Upload File</SelectItem>
                                    <SelectItem value="batch-upload">Batch Upload</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        {errors.operation && <p className="text-red-600">{errors.operation}</p>}
                    </div>

                    <div>
                        <Label htmlFor="modelName">Model Name</Label>
                        <Select id="modelName" value={modelName} onValueChange={setModelName} disabled={loading}>
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
                    <Button type="submit" className="w-[500px]" disabled={loading}>
                    {loading ? (
                        <div className="flex items-center gap-2">
                            <Spinner /> {/* Add a spinner component here */}
                            Loading...
                        </div>
                    ) : (
                        "Submit"
                    )}
                </Button>

                    {/* ✅ Download button for PDF */}
                    {pdfUrl && (
                        <div className="mt-4">
                            <a href={pdfUrl} download className="text-blue-600 underline">
                                Download Processed PDF
                            </a>
                        </div>
                    )}
                </form>
            </CardContent>
        </Card>
    );
};

export default CommunicationForm;