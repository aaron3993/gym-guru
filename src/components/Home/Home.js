import React from 'react';
import Navbar from '../Navbar/Navbar';
import ExerciseList from '../ExercseList/ExerciseList';
 
const Home = () => {
    return(
        <>
            <Navbar />
            {/* <h1>Home</h1> */}
            <ExerciseList />
        </>
    )
}
 
export default Home;
