import React, { useState, useEffect } from "react";
import { Button, Typography } from "antd";
import RoutineList from "./RoutineList/RoutineList";
import { getAllRoutinesForUser } from "../../utils/firestoreUtils";
import { useAuth } from "../../contexts/AuthContext";
import { useJob } from "../../contexts/JobContext";
import LoadingSpinner from "../../components/LoadingSpinner";
import GenerateWorkoutModal from "../../components/GenerateRoutineModal";
import "./RoutinesPage.css";

const { Title } = Typography;

const RoutinesPage = () => {
  const { user } = useAuth();
  const { status } = useJob();
  const [routines, setRoutines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    const fetchRoutines = async () => {
      try {
        const routinesData = await getAllRoutinesForUser(user.uid);
        setRoutines(routinesData);
      } catch (error) {
        console.error("Error fetching routines:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRoutines();
  }, [user.uid, status]);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
  };

  return (
    <div className="routines-page">
      <div className="header">
        <Title level={1}>My Routines</Title>
        <p>Generate routines using AI based on your criteria.</p>
      </div>

      <div className="content">
        <Button type="primary" className="ai-button" onClick={showModal}>
          Generate Routine with AI
        </Button>
        {loading ? (
          <LoadingSpinner />
        ) : routines.length > 0 ? (
          <RoutineList routines={routines} />
        ) : (
          <p>No routines found. Start creating one!</p>
        )}
      </div>

      <GenerateWorkoutModal isVisible={isModalVisible} onClose={closeModal} />
    </div>
  );
};

export default RoutinesPage;
