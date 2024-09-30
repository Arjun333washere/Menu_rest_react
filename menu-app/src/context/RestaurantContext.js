// context/RestaurantContext.js
import React, { createContext, useContext, useState } from 'react';

const RestaurantContext = createContext();

export const RestaurantProvider = ({ children }) => {
  const [restaurantId, setRestaurantId] = useState(null);
  return (
    <RestaurantContext.Provider value={{ restaurantId, setRestaurantId }}>
      {children}
    </RestaurantContext.Provider>
  );
};

export const useRestaurant = () => useContext(RestaurantContext);
