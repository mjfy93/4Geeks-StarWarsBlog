import { useLoaderData, Link, useParams } from "react-router";
import { imageUrls } from "../utils/images";


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
    const dataArray = Object.entries(loaderData).filter(
       ([key]) => ![ "created", "edited", "films"].includes(key)
    );
    console.log(dataArray);
    




    return (

        <div id="itemContainer">
            <div id="itemHeader">
                <h1>{loaderData.name || loaderData.title}</h1>
                <Link to={`/${params.category}`} >← Back to {params.category.charAt(0).toUpperCase() + params.category.slice(1)}</Link>
            </div>
             <div id="itemContent">
                    <img src={imageUrl}
                        alt={loaderData.name}
                        id="imageCategories"
                    />
                    {dataArray.map(([property, info], index)=>(

                        <div key={index}>
                            <span>{property}</span><span>{info}</span>
                        </div>

                    ))}
                
                
            </div>
        </div>
      

    )
}