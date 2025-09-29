import { Link, useLoaderData } from "react-router";


export async function loader() {
  const response = await fetch('https://swapi.tech/api')

  return response.json()
}


export default function Home() {
  const data = useLoaderData()
 
  const images = [
    "https://i.pinimg.com/736x/10/c6/ad/10c6add44b13d13bcaf326cd5c286818.jpg",
    "https://www.comicbasics.com/wp-content/uploads/2023/07/most-important-star-wars-planets.jpg",
    "https://geekculture.co/wp-content/uploads/2015/11/alongtimeago.jpg"
  ];
  const descriptions= [
    "Meet the amazing characters that have made millions of people, from all walks of life, fall in love with this amazing world.",
    "From frozen worlds, to infinite desserts, explore all your favorite planets and immerse yourself in this vast galaxy.",
    "The iconic Millennium Falcon and the infamous Death Star are only the beginning, there are so many other vehicles to discover."
  ];


  const categoriesInfo = Object.entries(data.result).filter(([category, url]) =>
    url.includes('people') || url.includes('planets') || url.includes('vehicles')
  );



  return (
    <div className="containerHome" >
      <h1 className="header">STAR WARS Blog - Get to know a Galaxy Far, Far Away</h1>
      <div >
        <p>STAR WARS fans, famously some of the most dedicated and passionate fans in the world, know that this is a diverse and complex universe. Save your favorites for later! </p>
    
          <div className="categoriesHome">
            {categoriesInfo.map(([category, url], index) => (
     
                <div  key={index} className="cardHome">
                  
                  <img src={images[index]} className="imageHome" />
                  <div >
                    <p className="descriptionsHome">{descriptions[index]}</p>
                    <button className="buttonHome" >

                    <Link
                      key={index}
                      to={`/${category}`} 
                      className="buttonHome">
                      Discover the {category.charAt(0).toUpperCase() + category.slice(1)}
                    </Link>
                    </button>
                  </div>
                </div>
            
            ))}
          </div>
      
      </div>
    </div>




  )
}