import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SearchBar from '../../components/SearchBar/SearchBar';
import CategoryList from '../../components/CategoryList/CategoryList';
import ExerciseList from '../../components/ExerciseList/ExerciseList';
import './ExercisePage.css'

const ExercisePage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [exercises, setExercises] = useState([])
  const [loading, setLoading] = useState(false);
  const [endOfData, setEndOfData] = useState(false);

  useEffect(() => {
    fetchExercises();
  }, []);

  const fetchExercises = async () => {
    if (loading || endOfData) return;

    setLoading(true);

    const options = {
      method: 'GET',
      url: 'https://exercisedb.p.rapidapi.com/exercises',
      params: {limit: '8'},
      headers: {
        'X-RapidAPI-Key': process.env.REACT_APP_RAPID_API_KEY,
        'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com'
      }
    };
    
    try {
      const response = await axios.request(options);
      console.log(response.data);
      setExercises(response.data)
    } catch (error) {
      console.error(error);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    // Perform search based on the query
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    // Perform search based on the selected category
  };

  return (
    <div className='exercise-container'>
      <SearchBar onSearch={handleSearch} />
      <div style={{ display: 'flex' }}>
        <div style={{ flex: 1 }}>
          {/* <CategoryList
            categories={['Category 1', 'Category 2', 'Category 3']}
            onSelectCategory={handleCategoryClick}
          /> */}
        </div>
        <div style={{ flex: 2 }}>
          <ExerciseList
            exercises={exercises}
            onItemClick={(exercise) => console.log(exercise)}
          />
        </div>
      </div>
    </div>
  );
};

export default ExercisePage;