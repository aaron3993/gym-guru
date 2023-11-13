import React, { useState, useEffect } from 'react';
import Table from '../Table/Table'; // Assume you have a Table component
import wgerApi from '../../api/wgerApi'; // Assuming you have a configured wgerApi instance

const ExerciseList = () => {
  const [exercises, setExercises] = useState([]);
  const [page, setPage] = useState(1);
  const limit = 5; // Number of items per page
  const [loading, setLoading] = useState(false);
  const [endOfData, setEndOfData] = useState(false);

  useEffect(() => {
    // Fetch exercises when the component mounts or when the page changes
    fetchExercises();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run whenever the page changes

  const fetchExercises = () => {
    if (loading || endOfData) return;

    setLoading(true);

    wgerApi
      .get(`/exercise/?page=${page}&limit=${limit}`)
      .then(response => {
        console.log('Exercises fetched:', response.data);

        // Update state to accumulate results
        setExercises(prevExercises => [...prevExercises, ...response.data.results]);

        // If the API response contains less than the expected number of items, it's the end of the data
        if (response.data.results.length < limit) {
          console.log('End of data reached');
          setEndOfData(true);
        } else {
          // Increment the page for the next API call
          setPage(prevPage => prevPage + 1);
        }
      })
      .catch(error => {
        console.error('Error fetching exercises:', error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handlePrevPage = () => {
    if (page > 1) {
      setPage(prevPage => prevPage - 1);
      setEndOfData(false); // Reset endOfData when navigating to the previous page
    }
  };

  const handleNextPage = () => {
    setPage(prevPage => prevPage + 1);
  };

  return (
    <div>
      <Table
        data={exercises}
        columns={['Name', 'Description', 'Equipment', 'Category']}
        rowKeys={['name', 'description', 'equipment', 'category']}
      />
      <div>
        <button onClick={handlePrevPage} disabled={page === 1 || loading}>
          Previous
        </button>
        <span> Page {page} </span>
        <button onClick={handleNextPage} disabled={loading}>
          Next
        </button>
      </div>
      {loading && <p>Loading...</p>}
      {endOfData && <p>End of data reached</p>}
    </div>
  );
};

export default ExerciseList;