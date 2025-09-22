import { Link, useLoaderData } from "react-router";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faJedi } from '@fortawesome/free-solid-svg-icons';
import '../styles/styles.css'



export async function loader() {
  const response = await fetch('https://swapi.tech/api')

  return response.json()
}


export default function Home() {
  const data = useLoaderData()
 console.log(data.result);
 
  
  const images = [
    "https://i.pinimg.com/736x/10/c6/ad/10c6add44b13d13bcaf326cd5c286818.jpg",
    "https://www.comicbasics.com/wp-content/uploads/2023/07/most-important-star-wars-planets.jpg",
    "https://geekculture.co/wp-content/uploads/2015/11/alongtimeago.jpg"
  ]
  const descriptions= [
    "Meet the amazing characters that have made millions of people, from all walks of life, fall in love with this amazing world.",
    "From frozen worlds, to infinite desserts, explore all your favorite planets and immerse yourself in this vast galaxy.",
    "The iconic Millennium Falcon and the infamous Death Star are only the beginning, there are so many other vehicles to discover."
  ]


  const categoriesInfo = Object.entries(data.result).filter(([category, url]) =>
    url.includes('people') || url.includes('planets') || url.includes('vehicles')
  );



  return (
    <div >
      
      <h1 className="text-warning fs-1 fw-bolder d-flex justify-content-center p-3 bs-light-text-emphasis"><Link to="/" className="my-link-style"><FontAwesomeIcon icon={faJedi} /></Link>Star Wars Blog - Get to know a Galaxy Far, Far Away</h1>
      <div className="d-grid">
        <p className="mx-3 text-warning fw-bold fs-3">STAR WARS fans, famously some of the most dedicated and passionate fans in the world, know that this is a diverse and complex universe. Save your favorites for later! </p>
        <nav className="navbar ">
          <div className="container-fluid d-flex justify-content-around">
            {categoriesInfo.map(([category, url], index) => (
     
                <div className="card" style={{ width: "18rem" }} key={index}>
                  <h5 className="card-title d-grid justify-content-center"></h5>
                  <img src={images[index]} className="card-img-top" style={{aspectRatio:"3/2", objectFit: "cover"}} />
                  <div className="card-body">
                    <p className="card-text">{descriptions[index]}</p>
                    <button className="button-light-emphasis border border-rounded ">

                    <Link
                      key={index}
                      to={`/${category}?url=${encodeURIComponent(url)}`} style={{ color: "black" }}>
                      Discover the {category.charAt(0).toUpperCase() + category.slice(1)}
                    </Link>
                    </button>
                  </div>
                </div>
            
            ))}
          </div>
        </nav>
      </div>
    </div>




  )
}