import { Link } from "react-router";
import { useFavorites } from '../store/FavoritesContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';


export default function Favorites() {
    const { favorites, removeFavorite } = useFavorites();

    if (favorites.length === 0) {
        return (
            <div className="faveContainer">
                <h1 className="faveHeader">Your Favorites</h1>
                <p>No favorites yet! Start exploring to add some.</p>
                <Link to="/" className="linkBack">← Back to Home</Link>
            </div>
        );
    }

    const groupedFavorites = favorites.reduce((acc, fav) => {
        if (!acc[fav.category]) acc[fav.category] = [];
        acc[fav.category].push(fav);

        return acc;
    }, {});

    return (
        <div className="faveContainer">
            {/* <h1 className="faveHeader">Your Favorites</h1> */}
            <div className="faveCategories">
                {Object.entries(groupedFavorites).map(([category, items]) => (
                    <div key={category} >
                        <h2 className="faveHeader">{category.charAt(0).toUpperCase() + category.slice(1)}</h2>
                        {items.map(item => (
                            <div key={`${item.category}-${item.id}`} className="favorites">
                                <Link to={`/${item.category}/${item.id}`}>
                                    {item.name}
                                </Link>
                                <button
                                    className="removeFaveButton"
                                    onClick={() => removeFavorite(item.id, item.category)}
                                >
                                   <FontAwesomeIcon icon={faTrash} />
                                </button>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
}