import { Link } from 'react-router'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faJedi } from '@fortawesome/free-solid-svg-icons';


export default function Navbar() {
  return (
    <nav>
      <ul>
        <li>
          <Link to='/'><FontAwesomeIcon icon={faJedi} /></Link>
        </li>       
      </ul>
    </nav>
  )
}