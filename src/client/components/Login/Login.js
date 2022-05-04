import { useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { useContext } from "react";
import { UserContext } from "../../../App";
import './Login.scss'

function Login(props) {

    const [password, setPassword] = useState('')
    const [username, setUsername] = useState('')
    const navigate = useNavigate()
    const location = useLocation()
    const { user, setUser } = useContext(UserContext);

    const handleChangePass = (e) => {
        setPassword(e.target.value)
    }

    const handleChangeUserName = (e) => {
        setUsername(e.target.value)
    }

    const onLogin = (e) => {
      e.preventDefault()
      fetch('/users', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({username, password})
        }).then(res => res.json())
        .then(res =>  {
          if(res.uuid) {
            window.localStorage.setItem('session', JSON.stringify({token: res.uuid, username: res.username}))
            setUser(true);
            window.location.reload()
            if (location.state?.from) {
              navigate(location.state.from);
            }
          }
        });
    }
    const renderForm = (
        <div className="form">
            <div className="input-container">
              <label>Username </label>
              <input type="text" onChange={handleChangeUserName} value={username} required className="loginInput"/>
            </div>
            <div className="input-container">
              <label>Password </label>
              <input type="password" onChange={handleChangePass} value={password} required className="loginInput"/>
            </div>
            <button onClick={onLogin} className='login-button'>
                Login
            </button>
        </div>
     );

     return renderForm
}

export default Login;