import { useLoaderData, Link } from "react-router"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faJedi } from '@fortawesome/free-solid-svg-icons';
import { getImageUrl } from '../utils/images'



export async function loader({ params }) {
    const category = params.category;
    const response = await fetch(`https://swapi.tech/api/${category}`);
    const data = await response.json();
    return { category, items: data.results };
}

export default function Category() {
    const { category, items } = useLoaderData();
    



    return (
        <div id="containerCategories">
            <h1 >Your Favorite {category.charAt(0).toUpperCase() + category.slice(1)}</h1>
            <div id="itemsCategories">
                    {items.map((item, index) => {
                        const itemId = item.url.split('/')?.pop();
                        const imageUrl = getImageUrl(category, itemId);
                        return (
                            <div key={index} id="cardCategories">
                                    <img src={imageUrl}
                                        alt={item.name || item.title}
                                        id="imageCategories"
                                    />
                                    <button id="buttonCategories" >
                                        <Link to={`/${category}/${itemId}`}
                                        id="linkCategories">
                                            {item.name || item.title}
                                        </Link>
                                    </button>
                                </div>

                        );
                    })}
                </div>
            </div>
    );
}