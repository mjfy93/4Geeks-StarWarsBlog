import { useLoaderData, Link, useParams } from "react-router"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faJedi } from '@fortawesome/free-solid-svg-icons';
import { imageUrls } from '../utils/images'



export async function loader({ params }) {
    const category = params.category;
    const response = await fetch(`https://swapi.tech/api/${category}`);
    const data = await response.json();
    return { category, items: data.results };
}

export default function Category() {
    const { category, items } = useLoaderData();
    const params = useParams();
    



    return (
        <div id="containerCategories">
            <h1 >Your Favorite {category.charAt(0).toUpperCase() + category.slice(1)}</h1>
            <div id="itemsCategories">
                    {items.map((item, index) => {
                        const itemId = item.url.split('/')?.pop();
                        const imageUrl = imageUrls[params.category][item.name];
                    
                        
                        return (
                            <div key={index} id="cardCategories">
                                    <img src={imageUrl}
                                        alt={item.name}
                                        id="imageCategories"
                                    />
                                    <button id="buttonCategories" >
                                        <Link to={`/${category}/${itemId}`}
                                        id="linkCategories">
                                            {item.name.split(" ").map(e => e.charAt(0).toUpperCase() + e.slice(1) ).join(" ")}
                                        </Link>
                                    </button>
                                </div>
                        );
                    })}
                </div>
            </div>
    );
}