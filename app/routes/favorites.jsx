import { Link } from "react-router";
import { useFavorites } from '../store/FavoritesContext';

export default function Favorites() {
    const { favorites, removeFavorite } = useFavorites();

    if (favorites.length === 0) {
        return (
            <div>
                <h1>Your Favorites</h1>
                <p>No favorites yet! Start exploring to add some.</p>
                <Link to="/">← Back to Home</Link>
            </div>
        );
    }

    const groupedFavorites = favorites.reduce((acc, fav) => {
        if (!acc[fav.category]) acc[fav.category] = [];
        acc[fav.category].push(fav);
        return acc;
    }, {});

    return (
        <div>
            <h1>Your Favorites</h1>
            {Object.entries(groupedFavorites).map(([category, items]) => (
                <div key={category}>
                    <h2>{category.charAt(0).toUpperCase() + category.slice(1)}</h2>
                    {items.map(item => (
                        <div key={`${item.category}-${item.id}`} className="favorites">
                            <Link to={`/${item.category}/${item.id}`}>
                                {item.name}
                            </Link>
                            <button
                                className="favoritesButton"
                                onClick={() => removeFavorite(item.id, item.category)}
                            >
                                Remove
                            </button>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
}