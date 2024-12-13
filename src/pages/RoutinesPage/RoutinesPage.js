import React, { useState, useEffect } from "react";
import { Button } from "antd";
import RoutineList from "./RoutineList/RoutineList";
import { getAllRoutinesForUser } from "../../utils/firestoreUtils";
import { useAuth } from "../../contexts/AuthContext";
import LoadingSpinner from "../../components/LoadingSpinner";
import GenerateWorkoutModal from "../../components/GenerateWorkoutModal";
import "./RoutinesPage.css";

const RoutinesPage = () => {
  const { user } = useAuth();
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
  }, [user.uid]);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
  };

  return (
    <div className="routines-page">
      <div className="header">
        <h1>Your Routines</h1>
        <p>View your AI-generated routines.</p>
        <Button type="primary" className="ai-button" onClick={showModal}>
          Generate Routine with AI
        </Button>
      </div>
      <div className="content">
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
