import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getAllCommunications, deleteCommunication } from "@/api";

const CommunicationsPage = () => {
    const [communications, setCommunications] = useState([]);
    const [deleteNotification, setDeleteNotification] = useState('');
    const [idToDelete, setIdToDelete] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10; // Change as needed

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

     // Pagination logic
    const totalPages = Math.ceil(communications.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const displayedCommunications = communications.slice(startIndex, startIndex + itemsPerPage);
    

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
            {displayedCommunications.length > 0 ? (
                <Card className="mb-5 p-4">
                    <ul>
                        {displayedCommunications.map((comm) => (
                            <li key={comm.id} className="mb-5 p-3 border border-gray-300 rounded">
                                <div><strong>ID:</strong> {comm.id}</div>
                                <div><strong>Content:</strong> {comm.content}</div>
                                <div><strong>Primary Emotion:</strong> {comm.primaryEmotion.emotion} ({comm.primaryEmotion.percentage}%)</div>
                                <div><strong>Model:</strong> {comm.modelName}</div>
                                <div><strong>Timestamp:</strong> {new Date(comm.timestamp).toLocaleString()}</div>
                            </li>
                        ))}
                    </ul>

                    {/* Pagination Controls */}
                    <div className="flex justify-between mt-4">
                        <Button 
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                        >
                            Previous
                        </Button>
                        <span>Page {currentPage} of {totalPages}</span>
                        <Button 
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                        >
                            Next
                        </Button>
                    </div>
                </Card>
            ) : (
                <p>No communications available.</p>
            )}
        </div>
    );
};

export default CommunicationsPage;
