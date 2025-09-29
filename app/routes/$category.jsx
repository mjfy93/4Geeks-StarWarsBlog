import { useLoaderData, Link, useParams } from "react-router"

import { imageUrls } from '../utils/images'
import {useFavorites} from '../store/FavoritesContext';


export async function loader({ params }) {
    const category = params.category;
    const response = await fetch(`https://swapi.tech/api/${category}`);
    const data = await response.json();
    return { category, items: data.results };
}

export default function Category() {
    const { category, items } = useLoaderData();
    const params = useParams();
    const {addFavorite, removeFavorite, isFavorite} = useFavorites()

    const handleFavoriteToggle = (item, itemId) => {
        const favoriteItem = {
            id: itemId,
            category,
            name: item.name,
            url: item.url
        };

        if (isFavorite(itemId, category)) {
            removeFavorite(itemId, category);
        } else {
            addFavorite(favoriteItem);
        }
    }


    return (
        <div id="containerCategories">
            <h1 >Your Favorite {category.charAt(0).toUpperCase() + category.slice(1)}</h1>

            <div className="cardContainer">
                {items.map((item, index) => {
                    const itemId = item.url.split('/')?.pop();
                    const imageUrl = imageUrls[params.category][item.name];
                    const isItemFavorite = isFavorite(itemId, category);

                    return (
                        <div className="card">
                            <button className="cardButton buttonFavorite" onClick={() => handleFavoriteToggle(item, itemId)}>{isItemFavorite ? "★" : "☆"}</button>
                            <Link key={index} className="cardCategories"
                                to={`/${category}/${itemId}`}
                                style={{ backgroundImage: `url(${imageUrl})` }}>
                                <button className="cardButton buttonName" >

                                    {item.name.split(" ").map(e => e.charAt(0).toUpperCase() + e.slice(1)).join(" ")}
                                </button>

                            </Link>
                        </div>

                    );
                })}
            </div>
        </div>

    );
}