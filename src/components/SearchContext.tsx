import React, { createContext, useState, useContext } from 'react';

interface SearchContextType {
searchTerm: string;
setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
selectTipo: string;
setSelectTipo: React.Dispatch<React.SetStateAction<string>>;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

interface SearchProviderProps {
  children: React.ReactNode;
  }

export const SearchProvider: React.FC<SearchProviderProps> = ({ children }) => {
const [searchTerm, setSearchTerm] = useState('');
const [selectTipo, setSelectTipo] = useState('');

return (
  <SearchContext.Provider value={{ searchTerm, setSearchTerm, selectTipo, setSelectTipo }}>
    {children}
  </SearchContext.Provider>
);
};

export const useSearch = () => {
const context = useContext(SearchContext);
if (context === undefined) {
  throw new Error('useSearch must be used within a SearchProvider');
}
return context;
};