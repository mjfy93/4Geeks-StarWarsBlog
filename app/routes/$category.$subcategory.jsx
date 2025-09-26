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
function isLink(str) {
    const urlRegex = /^(https?:\/\/|www\.)\S+/i;
    return urlRegex.test(str);

}



export default function Subcategory() {
    const loaderData = useLoaderData();
    const params = useParams();
    const imageUrl = imageUrls[params.category][loaderData.name];
    const dataArray = Object.entries(loaderData).filter(
        ([key]) => !["created", "edited", "films", "starships", "url", "vehicles", "home_world", "pilots"].includes(key)
    );

    return (

        <div className="itemContainer">
            <div className="itemHeader">
                <h1>{loaderData.name}</h1>
                <Link to={`/${params.category}`} >← Back to {params.category.charAt(0).toUpperCase() + params.category.slice(1)}</Link>
            </div>
            <div className="itemContent">
                <img src={imageUrl}
                    alt={loaderData.name}
                    className="imageCategories"
                />
                <div>

                    <table className="tableInfo">
                        {dataArray.map(([property, info], index) => (
                            <tbody key = { index }>
                                <tr>
                                    <td>{property.charAt(0).toUpperCase() + property.slice(1).split("_").join(" ") + ": "}</td>
                                    <td>{info.charAt(0).toUpperCase() + info.slice(1)}</td>        
                                </tr>
                            </tbody>
                        ))}
                    </table>
                </div>

            </div>
        </div>


    )
}