import React from 'react'
import './CSS/Login_Signup.css'
const Signup = () => {
  return (
      <div className='loginsignuplogin'>
      <div className="loginsignup-containerlogin">
      <h2>ALREADY REGISTERED?</h2>
        <h2>ALREADY REGISTERED?</h2>
        <p>if you are already registered with Cartier, login here:  </p>
        <div className="loginsignup-fields">
          <p>Required field*</p>
          <input name='email'  type="email" placeholder='Email Address' />
          <p>Show</p>   
          <input name='password'  type="password" placeholder='Password' />
        </div> 
        <button >Continue</button>
        
        <p className="loginsignup-login">Forgot your password?  </p>
        <p className="loginsignup-login">Read the <span >Privacy Policy</span> for further information </p>
        <div className="loginsignup-agree">
          <input type="checkbox" name="" id="" />
          <p>By continue, i agree to the terms of use & privacy policy.</p>
        </div>
      </div>
      
    </div>
  )
}

export default Signup
