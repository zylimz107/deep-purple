import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { getAllCommunications, deleteCommunication } from "@/api";

const CommunicationsPage = () => {
    const [communications, setCommunications] = useState([]);
    const [deleteNotification, setDeleteNotification] = useState('');
    const [idToDelete, setIdToDelete] = useState('');

    useEffect(() => {
        const fetchCommunications = async () => {
            try {
                const response = await getAllCommunications();
                setCommunications(response.data);
            } catch (error) {
                console.error("Error fetching communications:", error);
            }
        };

        fetchCommunications();
    }, [deleteNotification]); // Refetch communications after deletion

    const handleDelete = async (id) => {
        try {
            await deleteCommunication(id);
            setDeleteNotification(`Communication with ID ${id} has been deleted.`);
            setIdToDelete(''); // Reset input field
        } catch (error) {
            console.error("Error deleting communication:", error);
        }
    };

    return (
        <div className="p-5">
            <h1 className="text-3xl font-bold mb-4">All Communications</h1>

            {/* Delete Notification */}
            {deleteNotification && (
                <div className="text-green-500 mb-4">{deleteNotification}</div>
            )}

            {/* Delete by ID Form */}
            <Card className="mb-5 p-4">
                <div className="mb-4">
                    <Label htmlFor="id">Enter ID to Delete</Label>
                    <Input
                        id="id"
                        type="number"
                        value={idToDelete}
                        onChange={(e) => setIdToDelete(e.target.value)}
                        placeholder="Enter ID"
                        className="w-[500px]"
                    />
                </div>
                <Button
                    onClick={() => handleDelete(idToDelete)}
                    className="w-[500px]"
                    disabled={!idToDelete}
                >
                    Delete Communication
                </Button>
            </Card>

            {/* List of All Communications */}
            {communications.length > 0 ? (
                communications.map((comm) => (
                    <Card key={comm.id} className="mb-5 p-4">
                        <div><strong>ID:</strong> {comm.id}</div>
                        <div><strong>Content:</strong> {comm.content}</div>
                        <div><strong>Primary Emotion:</strong> {comm.primaryEmotion.emotion}</div>
                        <div><strong>Secondary Emotions:</strong>
                            {Array.isArray(comm.secondaryEmotions) && comm.secondaryEmotions.length > 0 ? (
                                <ul>
                                    {comm.secondaryEmotions.map((secEmotion, index) => (
                                        <li key={index}>{secEmotion.emotion}</li>
                                    ))}
                                </ul>
                            ) : 'No secondary emotions available'}
                        </div>
                        <div><strong>Model:</strong> {comm.modelName}</div>
                        <div><strong>AI Model Version:</strong> {comm.modelVersion}</div>
                        <div><strong>Confidence Rating:</strong> {comm.confidenceRating}</div>
                        <div><strong>Timestamp:</strong> {new Date(comm.timestamp).toLocaleString()}</div>
                    </Card>
                ))
            ) : (
                <p>No communications found.</p>
            )}
        </div>
    );
};

export default CommunicationsPage;
