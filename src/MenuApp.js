import React, { useState, useEffect } from "react";
import "./App.css";
import bannerImage from "./Picture/wawamenubanner.jpg";

const API_URL = "https://apex.oracle.com/pls/apex/wia2001_dbs_sb/foodapi/food"; // Your API endpoint

export default function MenuApp() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [foodItems, setFoodItems] = useState([]); 
  const [selectedFood, setSelectedFood] = useState(null);
  const [categories, setCategories] = useState(["All"]); // Default category list

  // Fetch food data from API
  useEffect(() => {
    fetch(API_URL)
      .then(response => response.json())
      .then(data => {
        if (data.items) {
          setFoodItems(data.items);
          
          // Extract unique category names from food data
          const uniqueCategories = ["All", ...new Set(data.items.map(item => item.category_name))];
          setCategories(uniqueCategories);
        } else {
          console.error("Invalid API response format:", data);
        }
      })
      .catch(error => console.error("Error fetching food data:", error));
  }, []);

  // Filter food items by category
  const filteredFood = selectedCategory === "All"
    ? foodItems
    : foodItems.filter(item => item.category_name === selectedCategory);

  return (
    <div className="container">
      {selectedFood ? (
        <div className="food-details">
          <button onClick={() => setSelectedFood(null)} className="back-button">⬅ Back</button>
          <img src={`data:image/png;base64,${selectedFood.food_image}`} alt={selectedFood.food_name} className="food-image" />
          <h2 className="food-title">{selectedFood.food_name}</h2>
          <p className="food-code">Code: {selectedFood.food_id}</p>
          <p className="food-description">{selectedFood.food_desp}</p>
          <p className="food-category">Category: {selectedFood.category_name}</p>
          <p className="food-price">Price: RM {selectedFood.price}</p>
        </div>
      ) : (
        <div className="menu">
          <img src={bannerImage} alt="Menu Banner" className="banner" />
          <div className="category-container">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`category-button ${selectedCategory === category ? "active" : ""}`}
              >
                {category}
              </button>
            ))}
          </div>
          <div className="food-grid">
            {filteredFood.map(item => (
              <div key={item.food_id} className="food-item" onClick={() => setSelectedFood(item)}>
                <img src={`data:image/png;base64,${item.food_image}`} alt={item.food_name} className="food-thumb" />
                <p className="food-name">{item.food_name}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
