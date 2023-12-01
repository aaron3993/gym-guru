import React, { useState, useEffect } from 'react';
import CreateWorkoutModal from '../../components/CreateWorkoutModal/CreateWorkoutModal';
import WorkoutList from './WorkoutList/WorkoutList';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { auth, db } from '../../firebase';
import './WorkoutsPage.css';

const WorkoutsPage = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [workouts, setWorkouts] = useState([]);

  useEffect(() => {
    // Fetch workouts from Firestore when the component mounts
    const fetchWorkouts = async () => {
      try {
        const workoutsCollection = collection(db, 'workouts');
        const querySnapshot = await getDocs(workoutsCollection);
        const fetchedWorkouts = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setWorkouts(fetchedWorkouts);
      } catch (error) {
        console.error('Error fetching workouts:', error);
      }
    };

    fetchWorkouts();
  }, []);

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleCreateWorkout = async (workoutName) => {
    try {
      // Add the new workout to Firestore
      const docRef = await addDoc(collection(db, 'workouts'), { name: workoutName });
      const newWorkout = { id: docRef.id, name: workoutName };
      setWorkouts((prevWorkouts) => [...prevWorkouts, newWorkout]);
    } catch (error) {
      console.error('Error creating workout:', error);
    } finally {
      // Close the modal regardless of success or failure
      setModalOpen(false);
    }
  };

  return (
    <div className="workouts-container">
      <h1>Your Workouts</h1>
      <button onClick={handleOpenModal}>Create Workout</button>

      {/* Render the list of workouts */}
      <WorkoutList workouts={workouts} />

      <CreateWorkoutModal
        isOpen={isModalOpen}
        onRequestClose={handleCloseModal}
        onCreateWorkout={handleCreateWorkout}
      />
    </div>
  );
};

export default WorkoutsPage;
