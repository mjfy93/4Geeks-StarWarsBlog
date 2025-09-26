import { Link } from 'react-router'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faJedi } from '@fortawesome/free-solid-svg-icons';


export default function Navbar() {
  return (
    <nav>
     
          <Link to='/' id='homeLink'><FontAwesomeIcon icon={faJedi} id='jediIcon'/></Link>
          <span>Favorites</span>
        
    </nav>
  )
}