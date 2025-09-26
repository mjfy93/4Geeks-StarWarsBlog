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

            <div className="cardContainer">
                {items.map((item, index) => {
                    const itemId = item.url.split('/')?.pop();
                    const imageUrl = imageUrls[params.category][item.name];

                    return (
                        <div className="card">
                            <button className="cardButton buttonFavorite">★☆</button>
                            <Link key={index} className="cardCategories"
                                to={`/${category}/${itemId}`}
                                style={{ backgroundImage: `url(${imageUrl})` }}>
                                <button className="cardButton buttonName">

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