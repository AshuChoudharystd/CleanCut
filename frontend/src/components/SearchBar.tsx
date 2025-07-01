import React, { useState } from 'react';
import { Search, X, Filter } from 'lucide-react';

const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'Men', label: "Men's Clothing" },
    { value: 'Women', label: "Women's Clothing" },
    { value: 'Kids', label: "Kid's Clothing"},
  ];

  const handleSearch = () => {
    if (searchQuery.trim()) {
      console.log('Searching for:', searchQuery, 'in category:', selectedCategory);
      // Add your search logic here
    }
  };

  const handleKeyPress = (e:React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  return (
    <div className="bg-white py-6 px-4 border-b border-gray-200">
      <div className="max-w-4xl mx-auto">
        {/* Main Search Bar */}
        <div className="relative flex items-center">
          {/* Category Filter */}
          <div className="relative">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="flex items-center space-x-2 px-4 py-3 bg-gray-100 text-black border-r border-gray-300 rounded-l-lg hover:bg-gray-200 transition-colors duration-200"
            >
              <Filter className="w-5 h-5" />
              <span className="hidden sm:inline text-sm font-medium">
                {categories.find(cat => cat.value === selectedCategory)?.label || 'All Categories'}
              </span>
              <span className="sm:hidden text-sm font-medium">Filter</span>
            </button>

            {/* Category Dropdown */}
            {isFilterOpen && (
              <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                {categories.map((category) => (
                  <button
                    key={category.value}
                    onClick={() => {
                      setSelectedCategory(category.value);
                      setIsFilterOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition-colors ${
                      selectedCategory === category.value 
                        ? 'bg-black text-white' 
                        : 'text-gray-700'
                    } ${category.value === categories[0].value ? 'rounded-t-lg' : ''} ${
                      category.value === categories[categories.length - 1].value ? 'rounded-b-lg' : ''
                    }`}
                  >
                    {category.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Search Input */}
          <div className="flex-1 relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Search for products, brands, or categories..."
              className="w-full px-4 py-3 bg-gray-100 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black focus:bg-white transition-all duration-200"
            />
            
            {/* Clear Button */}
            {searchQuery && (
              <button
                onClick={clearSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Search Button */}
          <button
            onClick={handleSearch}
            className="px-6 py-3 bg-black text-white rounded-r-lg hover:bg-gray-800 transition-colors duration-200 flex items-center justify-center group"
          >
            <Search className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
            <span className="hidden sm:inline ml-2 font-medium">Search</span>
          </button>
        </div>

        {/* Search Suggestions/Quick Links */}
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="text-sm text-gray-600">Popular searches:</span>
          {['Dresses', 'Jeans', 'Sneakers', 'Jackets', 'Accessories'].map((term, index) => (
            <button
              key={index}
              onClick={() => setSearchQuery(term)}
              className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full hover:bg-black hover:text-white transition-colors duration-200"
            >
              {term}
            </button>
          ))}
        </div>
      </div>

      {/* Overlay for dropdown */}
      {isFilterOpen && (
        <div
          className="fixed inset-0 z-5"
          onClick={() => setIsFilterOpen(false)}
        />
      )}
    </div>
  );
};

export default SearchBar;
