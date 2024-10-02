import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useRestaurant } from '../context/RestaurantContext';
import axios from 'axios';
import '../css/ViewMenu.css';

const ViewMenu = () => {
    const { id: menuId } = useParams(); // Menu ID from the URL
    const { restaurantId } = useRestaurant();
    const [menuTitle, setMenuTitle] = useState('');
    const [foodItems, setFoodItems] = useState([]);
    const [error, setError] = useState('');

    // Log the menuId and restaurantId
    console.log('Menu ID from URL:', menuId);
    console.log('Restaurant ID from context:', restaurantId);

    useEffect(() => {
        const fetchMenuData = async () => {
            const access_token = localStorage.getItem('access_token');
            try {
                const menuResponse = await axios.get(`http://127.0.0.1:8000/menu/menus/${menuId}/`, {
                    headers: {
                        Authorization: `Bearer ${access_token}`,
                    },
                });
                
                console.log('Menu Response:', menuResponse.data); // Log the response data
                
                setMenuTitle(menuResponse.data.title);
                setFoodItems(menuResponse.data.food_items);
            } catch (error) {
                console.error('Error fetching menu data:', error);
                setError('Failed to load menu details.');
            }
        };

        fetchMenuData();
    }, [menuId, restaurantId]);

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
                            <p>Type: {item.food_type}</p>
                            <p>Price: ₹{Number(item.price).toFixed(2)}</p>
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

