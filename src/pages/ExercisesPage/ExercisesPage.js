import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SearchBar from '../../components/SearchBar/SearchBar';
import CategoryList from '../../components/CategoryList/CategoryList';
import ExerciseList from '../../components/ExerciseList/ExerciseList';
import { fetchAllExercises } from '../../utils/apiUtils';
import LoadingSpinner from '../../components/LoadingSpinner';
import './ExercisesPage.css'

const ExercisesPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [exercises, setExercises] = useState([])
  const [allExercises, setAllExercises] = useState([]);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllExercisesData();
    fetchCategories();
  }, []);

  const fetchAllExercisesData = async () => {
    const exercises = await fetchAllExercises();
    setAllExercises(exercises);
    setExercises(exercises.slice(0, 8)); // Initial display, you can customize this
    setLoading(false)
  };

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

  const applyFiltersAndLimit = (query) => {
    const filteredExercises = allExercises.filter((exercise) => {
      const lowerCaseQuery = query.toLowerCase();

      return (
        exercise.name.toLowerCase().includes(lowerCaseQuery) ||
        exercise.target.toLowerCase().includes(lowerCaseQuery) ||
        exercise.equipment.toLowerCase().includes(lowerCaseQuery) ||
        exercise.bodyPart.toLowerCase().includes(lowerCaseQuery)
      );
    });

    const displayedExercises = filteredExercises.slice(0, 8);
    setExercises(displayedExercises)
    return displayedExercises
  };

  const handleSearch = async (query) => {
    setSearchQuery(query);
    applyFiltersAndLimit(query)
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
          <ExerciseList
            exercises={exercises}
          />
        </div>
      </div>
    </div>
  );
};

export default ExercisesPage;