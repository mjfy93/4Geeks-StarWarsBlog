import { useLoaderData, Link, useParams } from "react-router";
import { getImageUrl } from "../utils/images";


export async function loader({ params }) {
    const category = params.category
    const item = params.subcategory

    console.log(item);


    const response = await fetch(`https://swapi.tech/api/${category}/${item}`)
    const data = await response.json()

    return data.result;



}

export default function Subcategory() {
    const loaderData = useLoaderData();
    const params = useParams();
    const imageUrl = getImageUrl(category, itemId);




    return (

        <div id="itemContainer">
            <div id="itemHeader">
                <h1>{loaderData.properties.name || loaderData.properties.title}</h1>
                <Link to={`/${params.category}`} >← Back to {params.category.charAt(0).toUpperCase() + params.category.slice(1)}</Link>
            </div>
            <div id="itemContent">
                
                    <img src={imageUrl}
                        // alt={item.name || item.title}
                        id="imageCategories"
                    />
                
                <p>Test</p>
                <pre >{JSON.stringify(loaderData, null, 2)}</pre>

            </div>
        </div>

    )
}