export const displayCategoryName = (categoryFromAPI) => {
  const excludedCategories = ['neck'];

  if (excludedCategories.includes(categoryFromAPI)) {
    return null;
  }

  const categoryMapping = {
    waist: 'Abs',
    'lower legs': 'Legs',
    'upper legs': 'Legs',
    'lower arms': 'Arms',
    'upper arms': 'Arms',
    back: 'Back',
    chest: 'Chest',
    shoulders: 'Shoulders',
    cardio: 'Cardio',
  };

  return categoryMapping[categoryFromAPI] || categoryFromAPI;
};

export const capitalizeFirstLetter = (str) => {
  return str
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export const applyExerciseFiltersAndLimit = (exercises, query) => {
  const filteredExercises = exercises.filter((exercise) => {
    const lowerCaseQuery = query.toLowerCase();

    return (
      exercise.name.toLowerCase().includes(lowerCaseQuery) ||
      exercise.target.toLowerCase().includes(lowerCaseQuery) ||
      exercise.equipment.toLowerCase().includes(lowerCaseQuery) ||
      exercise.bodyPart.toLowerCase().includes(lowerCaseQuery)
    );
  });

  return filteredExercises.slice(0, 8);
};