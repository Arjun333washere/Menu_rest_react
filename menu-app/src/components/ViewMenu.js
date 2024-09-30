import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';  // Use useParams to access the menu id
import '../css/ViewMenu.css';  // Import your CSS file

const ViewMenu = () => {
    const { id } = useParams();  // Access the menu id from the URL
    const [foodItems, setFoodItems] = useState([]);
    const [menuTitle, setMenuTitle] = useState("");
    const [error, setError] = useState('');

    const fetchMenu = useCallback(async () => {
        try {
            const response = await fetch(`http://localhost:8000/menu/menus/${id}/`);  // Use the id from the URL

            if (!response.ok) {
                throw new Error('Failed to fetch menu');
            }

            const data = await response.json();
            setFoodItems(data.food_items || []);
            setMenuTitle(data.title || "Untitled Menu");
        } catch (error) {
            console.error('Error fetching menu:', error);
            setError('Failed to load menu.');
        }
    }, [id]);

    useEffect(() => {
        if (id) {
            fetchMenu();
        }
    }, [id, fetchMenu]);

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="menu-container">
            <h1>{menuTitle}</h1>
            <ul className="food-list">
                {foodItems.length > 0 ? (
                    foodItems.map(item => (
                        <li key={item.id} className="food-item">
                            <h3>{item.name}</h3>
                            <p>{item.description}</p>
                            <p>Type: {item.type}</p>
                            <p>Price: ₹{Number(item.price).toFixed(2)}</p> {/* Handle price safely */}
                        </li>
                    ))
                ) : (
                    <li>No food items available.</li>
                )}
            </ul>
        </div>
    );
};

export default ViewMenu;
