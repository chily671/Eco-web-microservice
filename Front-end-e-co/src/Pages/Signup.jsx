import React from 'react'
import './CSS/Login_Signup.css'
const Signup = () => {
  return (
      <div className='loginsignup'>
      <div className="loginsignup-container">
        <p>if you are already registered with Cartier, login here:  </p>
        <div className="loginsignup-fields">
          <p >Required field*</p>
          <p className='label'>Title*</p>
          <div className="option">

          <input type="radio" id='mr'name='mr' value='mr'/>
          <label for="mr">Mr</label>

          <input type="radio" id='mrs'name='mrs' value='mrs'/>
          <label for="mrs">Mrs</label>

          <input type="radio" id='miss'name='miss' value='miss'/>
          <label for="miss">Miss</label>

          <input type="radio" id='mx'name='mx' value='mx'/>
          <label for="mx">Mx</label>
          </div>

          <input name='fname'  type="text" placeholder='First Name*' />
          
          <input name='lname'  type="text" placeholder='Last Name*' />
          <p className='label'>Day of Birth</p>   
          <select id="myDropdown">
                <option value="#">Ngày</option>
                <option value="option2">Option 2</option>
                <option value="option3">Option 3</option>
            </select>
            <input name='email'  type="email" placeholder='Email Address*' />
            <input name='email'  type="email" placeholder='Confirm Email*' />
            <ul>
                <li>No repetition of more than two characters</li>
                <li>One lowercase character</li>
                <li>One uppercase character</li>
                <li>At least 1 allowed special character(s) from ~!@#$%^&*,-/+=</li>
                <li>8 characters minimum</li>
            </ul>
          <input name='password'  type="password" placeholder='Password*' />
          <input name='password'  type="password" placeholder='Confirm  Password*' />
        </div> 
        <button >Continue</button>
        
        <p className="loginsignup-login">Forgot your password?  </p>
        <p className="loginsignup-login">Read the <span >Privacy Policy</span> for further information </p>
        <div className="loginsignup-agree">
          <input type="checkbox" name="" id="" />
          <p>I would also like to receive marketing information about Cartier's 
            products or services.

We may send you this information by email, text message, 
phone, or postal mail. We may also use your information to
 deliver personalized messages or advertisements on social 
 media or other digital platforms. You may request that we 
 stop marketing to you at any time.</p>
        </div>
      </div>
      
    </div>
  )
}

export default Signup
 