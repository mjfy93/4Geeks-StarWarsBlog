import { useLoaderData, Link, useParams } from "react-router";
import { imageUrls } from "../utils/images";
import { descriptions } from "../utils/descriptions";
import { useFavorites } from '../store/FavoritesContext';

export async function loader({ params }) {
    const category = params.category
    const item = params.subcategory

    console.log(item);


    const response = await fetch(`https://swapi.tech/api/${category}/${item}`)
    const data = await response.json()

    return data.result.properties;



}




export default function Subcategory() {
    const loaderData = useLoaderData();
    const params = useParams();
    const imageUrl = imageUrls[params.category][loaderData.name];
    const description = descriptions[params.category][loaderData.name]
    const dataArray = Object.entries(loaderData).filter(
        ([key]) => !["created", "edited", "films", "starships", "url", "vehicles", "homeworld", "pilots"].includes(key)
    );
    const { addFavorite, removeFavorite, isFavorite } = useFavorites();

    const isItemFavorite = isFavorite(params.subcategory, params.category);

    const handleFavoriteToggle = () => {
        const favoriteItem = {
            id: params.subcategory,
            category: params.category,
            name: loaderData.name,
            url: `https://swapi.tech/api/${params.category}/${params.subcategory}`
        };

        if (isItemFavorite) {
            removeFavorite(params.subcategory, params.category);
        } else {
            addFavorite(favoriteItem);
        }
    };

    return (

        <div className="itemContainer">
            <Link to={`/${params.category}`} className="linkBack" >← Back to {params.category.charAt(0).toUpperCase() + params.category.slice(1)}</Link>
            <h1>{loaderData.name}
                <button
                    className="buttonToggleFavorite"
                    onClick={handleFavoriteToggle}
                >
                    {isItemFavorite ? 'Add to Favorites' : 'Remove From Favorites'}
                </button>
            </h1>

            <img src={imageUrl}
                alt={loaderData.name}
                className="imageItem"
            />

            <table className="tableInfo">
                <tbody >
                    {dataArray.map(([property, info], index) => (
                        <tr key={index}>
                            <td className="property"><strong>{property.charAt(0).toUpperCase() + property.slice(1).split("_").join(" ") + ": "}</strong></td>
                            <td className="information">{info.charAt(0).toUpperCase() + info.slice(1)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="description">
                <p>{description}</p>
            </div>
        </div>





    )
}