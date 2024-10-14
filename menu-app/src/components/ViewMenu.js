import React, { useEffect, useState } from 'react'; 
import { useParams, useNavigate } from 'react-router-dom'; // Import useNavigate for redirection
import { useRestaurant } from '../context/RestaurantContext';
import axios from 'axios';
import '../css/ViewMenu.css'; // Custom CSS for styling
import { useAuth } from '../provider/authProvider'; // Import useAuth for token management

const ViewMenu = () => {
    const { id: menuId } = useParams();
    const { restaurantId } = useRestaurant();
    const [menuTitle, setMenuTitle] = useState('');
    const [foodItems, setFoodItems] = useState([]);
    const [error, setError] = useState('');
    const navigate = useNavigate(); // Initialize the navigate function
    const { token } = useAuth(); // Get the token from AuthContext

    // Fetch menu data
    useEffect(() => {
        const fetchMenuData = async () => {
            if (!token) {
                setError('No access token found. Redirecting to 404 page.');
                navigate('/nun'); // Redirect to 404 if token is missing
                return;
            }

            try {
                const menuResponse = await axios.get(`http://127.0.0.1:8000/menu/menus/${menuId}/`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setMenuTitle(menuResponse.data.title);
                setFoodItems(menuResponse.data.food_items);
            } catch (error) {
                setError('Failed to load menu details.');
            }
        };

        fetchMenuData();
    }, [menuId, restaurantId, navigate]); // Add navigate to dependencies

    // Group food items by their food type
    const groupedFoodItems = foodItems.reduce((acc, item) => {
        acc[item.food_type] = acc[item.food_type] || [];
        acc[item.food_type].push(item);
        return acc;
    }, {});

    if (error) {
        return <div className="alert alert-danger text-center">{error}</div>;
    }

    return (
        <div className="container mt-4 menu-background">
            <div className="menu-header text-center mb-3">
                <h1 className="cinzel-title text-primary">{menuTitle || 'Menu'}</h1>
                <p className="cinzel-subtitle text-muted">Discover our delicious offerings</p>
            </div>

            {/* Render each section for food type */}
            {Object.keys(groupedFoodItems).map((foodType, index) => (
                <div key={index} className="food-section mb-5">
                    <h2 className="cinzel-subheader mb-3">{foodType}</h2>
                    {groupedFoodItems[foodType].map((item) => (
                        <div key={item.id} className="food-item mb-4">
                            <div className="food-item-content">
                                {/* Food details */}
                                <div className="food-details">
                                    <h5 className="cinzel-item-name">{item.name}</h5>
                                    <p className="cinzel-item-description">{item.fd_description}</p>
                                    <p className="cinzel-item-price text-success fw-bold">
                                        ₹{Number(item.price).toFixed(2)}
                                    </p>
                                    <p className="cinzel-item-veg-or-non-veg">
                                        {item.veg_or_non_veg === 'non_veg' ? 'Non-Vegetarian' : 'Vegetarian'}
                                    </p>
                                    {item.special && <span className="cinzel-item-special">🌟 Special</span>}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
};

export default ViewMenu;
