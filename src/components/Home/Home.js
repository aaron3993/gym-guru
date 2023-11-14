import React from 'react';
import Navbar from '../Navbar/Navbar';
import ExerciseList from '../ExercseList/ExerciseList';
import WorkoutList from '../WorkoutList/WorkoutList';
 
const Home = () => {
    return(
        <>
            <Navbar />
            {/* <h1>Home</h1> */}
            {/* <ExerciseList /> */}
            <WorkoutList />
        </>
    )
}
 
export default Home;
