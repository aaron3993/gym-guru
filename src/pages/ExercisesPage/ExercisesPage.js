import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SearchBar from '../../components/SearchBar/SearchBar';
import CategoryList from '../../components/CategoryList/CategoryList';
import ExerciseList from '../../components/ExerciseList/ExerciseList';
import { fetchAllExercises } from '../../utils/apiUtils';
import { getAllWorkouts } from '../../utils/firestoreUtils';
import { applyExerciseFiltersAndLimit } from '../../utils/dataUtils';
import LoadingSpinner from '../../components/LoadingSpinner';
import './ExercisesPage.css'

const ExercisesPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [exercises, setExercises] = useState([])
  const [allExercises, setAllExercises] = useState([]);
  const [allWorkouts, setAllWorkouts] = useState([]);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllExercisesData();
    getAllWorkoutsData();
    fetchCategories();
    setLoading(false)
  }, []);

  const fetchAllExercisesData = async () => {
    const exercises = await fetchAllExercises();
    setAllExercises(exercises);
    setExercises(exercises.slice(0, 8)); // Initial display, you can customize this
  };

  const getAllWorkoutsData = async () => {
    const workouts = await getAllWorkouts();
    setAllWorkouts(workouts)
  }

  const fetchCategories = async () => {
    const options = {
      headers: {
        'X-RapidAPI-Key': process.env.REACT_APP_RAPID_API_KEY,
        'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com',
      },
    };
    
    try {
      const response = await axios.get('https://exercisedb.p.rapidapi.com/exercises/bodyPartList', options);
      const bodyparts = response.data;

      setAllExercises(bodyparts);
      console.log({bodyparts})
    } catch (error) {
      console.log(error)
    }
  }

  const handleSearch = async (query) => {
    setSearchQuery(query);
    const displayedExercises = applyExerciseFiltersAndLimit(allExercises, query)
    setExercises(displayedExercises)
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
  };

  if (isLoading) {
    return <LoadingSpinner />
  }

  return (
    <div className='exercises-container'>
      <SearchBar onSearch={handleSearch} />
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{ flex: 1 }}>
          {/* <CategoryList
            categories={['Category 1', 'Category 2', 'Category 3']}
            onSelectCategory={handleCategoryClick}
          /> */}
        </div>
        <div style={{ flex: 2 }}>
        <ExerciseList exercises={exercises} workouts={allWorkouts} isWorkoutDetailPage={false} />
        </div>
      </div>
    </div>
  );
};

export default ExercisesPage;