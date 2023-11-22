import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SearchBar from '../../components/SearchBar/Searchbar';
import CategoryList from '../../components/CategoryList/CategoryList'; // Adjust the import path as needed
import CardList from '../../components/CardList/CardList'; // Adjust the import path as needed

const ExercisePage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
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
      params: {limit: '9'},
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


  const handleSearch = (query) => {
    setSearchQuery(query);
    // Perform search based on the query
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    // Perform search based on the selected category
  };

  // Example data for exercises
  const exerciseData = [
    { id: 1, name: 'Exercise 1' },
    { id: 2, name: 'Exercise 2' },
    // Add more exercise items as needed
  ];

  // Example data for categories
  const categoryData = ['Category 1', 'Category 2', 'Category 3'];

  return (
    <div>
      <SearchBar onSearch={handleSearch} />
      <div style={{ display: 'flex' }}>
        <div style={{ flex: 1 }}>
          <CategoryList
            categories={categoryData}
            onSelectCategory={handleCategoryClick}
          />
        </div>
        <div style={{ flex: 2 }}>
          <CardList items={exerciseData} /> {/* Using CardList component */}
        </div>
      </div>
    </div>
  );
};

export default ExercisePage;