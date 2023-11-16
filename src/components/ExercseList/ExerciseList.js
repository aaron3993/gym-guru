import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Table from '../Table/Table'; // Assume you have a Table component

const ExerciseList = () => {
  const [exercises, setExercises] = useState([]);
  const [page, setPage] = useState(1);
  const limit = 5; // Number of items per page
  const [loading, setLoading] = useState(false);
  const [endOfData, setEndOfData] = useState(false);

  useEffect(() => {
    console.log('fetching exercises');
    // Fetch exercises when the component mounts or when the page changes
    fetchExercises();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run whenever the page changes

  const fetchExercises = async () => {
    if (loading || endOfData) return;

    setLoading(true);

    // const offset = (page - 1) * limit;

    const options = {
      method: 'GET',
      url: 'https://exercisedb.p.rapidapi.com/exercises',
      params: {limit: '10'},
      headers: {
        'X-RapidAPI-Key': process.env.REACT_APP_RAPID_API_KEY,
        'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com'
      }
    };
    
    try {
      const response = await axios.request(options);
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  // const handlePrevPage = () => {
  //   if (page > 1) {
  //     setPage(prevPage => prevPage - 1);
  //     setEndOfData(false); // Reset endOfData when navigating to the previous page
  //   }
  // };

  // const handleNextPage = () => {
  //   setPage(prevPage => prevPage + 1);
  // };

  return (
    <div>
      {/* <Table
        data={exercises}
        columns={['Name', 'Description', 'Equipment', 'Category']}
        rowKeys={['name', 'description', 'equipment', 'category']}
      /> */}
      {/* <div>
        <button onClick={handlePrevPage} disabled={page === 1 || loading}>
          Previous
        </button>
        <span> Page {page} </span>
        <button onClick={handleNextPage} disabled={loading}>
          Next
        </button>
      </div>
      {loading && <p>Loading...</p>}
      {endOfData && <p>End of data reached</p>} */}
    </div>
  );
};

export default ExerciseList;