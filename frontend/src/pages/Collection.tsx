import React, {
  useContext,
  useEffect,
  useState,
  type ReactElement,
} from "react";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/assets";
import Title from "../components/Title";
import ProductItem from "../components/ProductItem";
import { Search, X, Filter } from "lucide-react";

const Collection = (): ReactElement => {
  const { products } = useContext(ShopContext);
  const [cloths, setCloths] = useState<any[]>([]);
  const [category, setCategory] = useState<string[]>([]);
  const [subCategory, setSubCategory] = useState<string[]>([]);
  const [sortFilter, setSortFilter] = useState("relevant");
  const [searchQuery, setSearchQuery] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showFilter, setShowFilter] = useState(false);

  const categories = [
    { value: "all", label: "All Categories" },
    { value: "Men", label: "Men's Clothing" },
    { value: "Women", label: "Women's Clothing" },
    { value: "Kids", label: "Kid's Clothing" },
  ];

  const applyFilter = () => {
    let filtered = [...products];

    // Search & selected dropdown category
    if (searchQuery.trim()) {
      filtered = filtered.filter((item) => {
        const matchesQuery =
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (item.description &&
            item.description
              .toLowerCase()
              .includes(searchQuery.toLowerCase())) ||
          item.category.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory =
          selectedCategory === "all" || item.category === selectedCategory;

        return matchesQuery && matchesCategory;
      });
    } else if (selectedCategory !== "all") {
      filtered = filtered.filter((item) => item.category === selectedCategory);
    }

    // Sidebar filters
    if (category.length > 0) {
      filtered = filtered.filter((item) => category.includes(item.category));
    }

    if (subCategory.length > 0) {
      filtered = filtered.filter((item) =>
        subCategory.includes(item.subCategory)
      );
    }

    // Sorting
    if (sortFilter === "low-high") {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortFilter === "high-low") {
      filtered.sort((a, b) => b.price - a.price);
    }

    setCloths(filtered);
  };

  useEffect(() => {
    applyFilter();
  }, [
    products,
    category,
    subCategory,
    searchQuery,
    sortFilter,
    selectedCategory,
  ]);

  const toggleCategory = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCategory((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    );
  };

  const toggleSubCategory = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSubCategory((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      applyFilter();
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
  };

  return (
    <div className="mt-30 mr-20 ml-20 mb-30">
      {/* Search Header */}
      <div className="bg-white py-6 px-4 border-b border-gray-200">
        <div className="max-w-4xl mx-auto">
          <div className="relative flex items-center">
            {/* Category Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="flex items-center space-x-2 px-4 py-3 bg-gray-100 text-black border-r border-gray-300 rounded-l-lg hover:bg-gray-200 transition-colors duration-200"
              >
                <Filter className="w-5 h-5" />
                <span className="hidden sm:inline text-sm font-medium">
                  {
                    categories.find((cat) => cat.value === selectedCategory)
                      ?.label
                  }
                </span>
                <span className="sm:hidden text-sm font-medium">Filter</span>
              </button>

              {isFilterOpen && (
                <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                  {categories.map((cat) => (
                    <button
                      key={cat.value}
                      onClick={() => {
                        setSelectedCategory(cat.value);
                        setIsFilterOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                        selectedCategory === cat.value
                          ? "bg-black text-white"
                          : "text-gray-700"
                      }`}
                    >
                      {cat.label}
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
                onKeyDown={handleKeyDown}
                placeholder="Search for products, brands, or categories..."
                className="w-full px-4 py-3 bg-gray-100 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black focus:bg-white transition-all duration-200"
              />
              {searchQuery && (
                <button
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Search Button */}
            <button
              onClick={applyFilter}
              className="px-6 py-3 bg-black text-white rounded-r-lg hover:bg-gray-800 transition-colors duration-200 flex items-center justify-center group"
            >
              <Search className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
              <span className="hidden sm:inline ml-2 font-medium">Search</span>
            </button>
          </div>

          {/* Search Suggestions */}
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="text-sm text-gray-600">Popular searches:</span>
            {["Dresses", "Jeans", "Sneakers", "Jackets", "Accessories"].map(
              (term) => (
                <button
                  key={term}
                  onClick={() => setSearchQuery(term)}
                  className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full hover:bg-black hover:text-white"
                >
                  {term}
                </button>
              )
            )}
          </div>
        </div>
      </div>

      {/* Overlay for dropdown */}
      {isFilterOpen && (
        <div
          className="fixed inset-0 z-5"
          onClick={() => setIsFilterOpen(false)}
        />
      )}

      {/* Content */}
      <div className="flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10 border-t border-gray-200">
        {/* Sidebar Filters */}
        <div className="min-w-60">
          <p
            onClick={() => setShowFilter(!showFilter)}
            className="my-2 text-xl flex items-center cursor-pointer gap-2"
          >
            FILTERS
            <img
              src={assets.dropdown_icon}
              alt=""
              className={`h-3 sm:hidden ${showFilter ? "rotate-90" : ""}`}
            />
          </p>

          {/* Category Checkboxes */}
          <div
            className={`border border-gray-300 pl-5 py-3 mt-6 ${
              showFilter ? "" : "hidden"
            } sm:block`}
          >
            <p className="mb-3 text-sm font-medium">CATEGORIES</p>
            <div className="flex flex-col gap-2 text-sm font-light text-gray-700">
              {["Men", "Women", "Kids"].map((cat) => (
                <label key={cat} className="flex gap-2">
                  <input
                    type="checkbox"
                    className="w-3"
                    value={cat}
                    onChange={toggleCategory}
                    checked={category.includes(cat)}
                  />
                  {cat.toUpperCase()}
                </label>
              ))}
            </div>
          </div>

          {/* Subcategory Checkboxes */}
          <div
            className={`border border-gray-300 pl-5 py-3 mt-6 ${
              showFilter ? "" : "hidden"
            } sm:block`}
          >
            <p className="mb-3 text-sm font-medium">TYPE</p>
            <div className="flex flex-col gap-2 text-sm font-light text-gray-700">
              {["Topwear", "Bottomwear", "Winterwear"].map((type) => (
                <label key={type} className="flex gap-2">
                  <input
                    type="checkbox"
                    className="w-3"
                    value={type}
                    onChange={toggleSubCategory}
                    checked={subCategory.includes(type)}
                  />
                  {type.toUpperCase()}
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <div className="flex justify-between text-base sm:text-xl mb-4">
            <Title text1="ALL " text2="COLLECTIONS" />
            <select
              className="border-2 border-gray-300 text-sm px-2"
              value={sortFilter}
              onChange={(e) => setSortFilter(e.target.value)}
            >
              <option value="relevant">Sort by: Relevant</option>
              <option value="low-high">Sort by: Low to High</option>
              <option value="high-low">Sort by: High to Low</option>
            </select>
          </div>

          {/* Product Grid */}
          <div className="mr-10 ml-10 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6">
            {cloths.map((product: any, index: number) => (
              <ProductItem
                key={product._id || index}
                id={product._id}
                name={product.name}
                image={product.image}
                price={product.price}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Collection;
