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
  ]


  const categoriesInfo = Object.entries(data.result).filter(([category, url]) =>
    url.includes('people') || url.includes('planets') || url.includes('vehicles')
  );



  return (
    <div >

      <h1 className="text-light d-flex justify-content-center">Star Wars Blog - Get to know a Galaxy Far, Far Away</h1>
      <div className="d-grid">
        <nav className="navbar ">
          <div className="container-fluid d-flex">
            {categoriesInfo.map(([category, url], index) => (
     
                <div className="card" style={{ width: "18rem;" }} key={index}>
                  <h5 className="card-title">{category.toLocaleUpperCase()}</h5>
                  <img src={images[index]} className="card-img-top" style={{aspectRatio:"3/2", objectFit: "cover"}} />
                  <div className="card-body">
                    <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card’s content.</p>
                    <button className="button-light-emphasis">

                    <Link
                      key={index}
                      to={`/${category}?url=${encodeURIComponent(url)}`}>
                      {category.toLocaleUpperCase()}
                    </Link>
                    </button>
                  </div>
                </div>
            
            ))}
          </div>
        </nav>
      </div>
      <p>Star wars is a movie</p>
    </div>




  )
}