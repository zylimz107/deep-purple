import React, { useState, useEffect } from "react";
import VisualizationDashboard from "@/components/VisualizationDashboard";
import useEmotionApi from "@/api";

const UserDashboard = () => {
    const { getAllCommunications } = useEmotionApi();
    const [communicationsData, setCommunicationsData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await getAllCommunications();
                setCommunicationsData(res.data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="w-full h-screen flex">
            <VisualizationDashboard communicationsData={communicationsData} />
        </div>
    );
};

export default UserDashboard;
