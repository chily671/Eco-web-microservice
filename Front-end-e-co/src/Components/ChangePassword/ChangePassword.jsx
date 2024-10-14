import React, {useState} from 'react'
import './ChangePassword.css'

const ChangePassword = () => {
  const [formData,setFormData] = useState({
    oldpassword:"",
    newpassword:"",
  })

  const changeHandler = (e) =>{
    setFormData({...formData,[e.target.name]:e.target.value})
  }

  const changePassword = async () =>{
    console.log("changePassword Function Excuted",formData);
    let responseData;
    await fetch('/changepassword',{
      method:'POST',
      headers:{
        Accept:'application/form-data',
        'Content-Type':'application/json',
        'auth-token':`${localStorage.getItem('auth-token')}`,
      },
      body: JSON.stringify(formData),
    }).then((response)=> response.json()).then((data)=>responseData=data)

    if(responseData.success) {
      alert(responseData.message)
      window.location.replace("/profile/overview");
    }
    else {
      alert(responseData.message)
    }
  }

  return (
    <div className='accountsettings'>
      <h1 className='mainhead1'> Personal Information</h1>

      <div className='form'>
        <div className='form-group'>
          <label htmlFor='oldpass'>Old Password: </label>
          <input type='text' id='oldpass' name='oldpassword' onChange={changeHandler}></input>
        </div>

        <div className='form-group'>
          <label htmlFor='newpass'>New Password: </label>
          <input type='text' id='newpass' name='newpassword' onChange={changeHandler}></input>
        </div>
        
      </div>
      <button onClick={changePassword} className='save-button'>Change Password</button>
    </div>
  )
}

  export default ChangePassword