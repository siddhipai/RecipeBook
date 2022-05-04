import './Banner.scss';
import React, { useRef, useContext } from 'react';
import AddRecipeModal from '../AddRecipeModal/AddRecipeModal';
import { UserContext } from '../../../App';

function Banner(props) {
  const recipeRef = useRef(null);
  const { user, setUser } = useContext(UserContext);
  const addSmoothie = e => {
    recipeRef.current.style.display = "block";
  };
  const session = JSON.parse(window.localStorage.getItem('session'))
  const username = session ? `${session.username}'s Smoothies` : 'Smoothie Recipebook'
  const logout = e => {
    setUser(false)
    window.localStorage.removeItem('session')
  };


    return <div className="header">
    <div className="Title">
      <h1 className="titleName">{`${username}`}</h1>
      {user &&  <button onClick={addSmoothie} className='recipe-button'>Add</button>}
    </div>
      {user && <button onClick={logout} className='logout-button'>Logout</button>}
    <AddRecipeModal ref={recipeRef} />
  </div>
}

export default Banner;