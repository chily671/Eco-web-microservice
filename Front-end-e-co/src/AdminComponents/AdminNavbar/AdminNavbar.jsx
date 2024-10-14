import React from 'react'
import './AdminNavbar.css'
import navlogo from '../Assets/nav-logo.svg'
import navProfile from '../Assets/nav-profile.svg'
import { Link } from 'react-router-dom'
import { AuthenticationContext } from '../../Context/AuthenticationContext'

const AdminNavbar = () => {

  const {setAuthToken, setIsAdmin} = React.useContext(AuthenticationContext);

  const Logout = () => {
    setAuthToken(null);
    setIsAdmin(false);
    localStorage.removeItem('auth-token');
    window.location.replace("/");
  }

  return (
    <div className='admin-navbar'>
        <Link to='/'><img src={navlogo} alt="" className="admin-nav-logo" /></Link>
        <Link to='/addproduct'><img src={navProfile} className='admin-nav-profile' alt="" /></Link>
        {localStorage.getItem('auth-token')
        ? <button className='logout-button' onClick={() => { Logout()}}>Logout</button> 
      :<Link to='/login'><button>Login</button></Link>}
    </div>
  )
}

export default AdminNavbar