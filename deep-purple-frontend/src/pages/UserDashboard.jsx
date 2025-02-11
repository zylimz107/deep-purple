import React, { useState } from "react";
import VisualizationDashboard from "@/components/VisualizationDashboard";
import { Button } from "@/components/ui/button";
import { getAllCommunications } from "@/api";

const UserDashboard = () => {
    const [communicationsData, setCommunicationsData] = useState(null);

    const handleGetAll = async () => {
        try {
            const res = await getAllCommunications();
            setCommunicationsData(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div>
            <Button 
                variant="outline" 
                className="border-purple-800 text-purple-800" 
                onClick={handleGetAll}
            >
                Fetch Communications
            </Button>
            <VisualizationDashboard communicationsData={communicationsData} />
        </div>
    );
};

export default UserDashboard;