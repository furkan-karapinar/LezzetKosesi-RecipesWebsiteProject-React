// src/contexts/GlobalContext.js
import { createContext, useState, useCallback, useContext } from 'react';
import { UserProvider } from './UserContext';
import { RecipeProvider } from './RecipeContext';
import { BlogProvider } from './BlogContext'; // BlogProvider'ı ekle


export const GlobalProvider = ({ children }) => {
  return (

      <UserProvider>
        <RecipeProvider>
          <BlogProvider>
            {children}
          </BlogProvider>
        </RecipeProvider>
      </UserProvider>
  );
};

export default GlobalProvider;
