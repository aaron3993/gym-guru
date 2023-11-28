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
        cardio: 'Cardio'
    };
  
    return categoryMapping[categoryFromAPI] || categoryFromAPI;
  };