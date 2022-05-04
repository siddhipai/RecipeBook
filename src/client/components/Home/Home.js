import '../style.scss'

import React, { useState, useEffect, useRef} from 'react';
import Fuse from "fuse.js";
import Card from '../Card/Card'
import AddRecipeModal from '../AddRecipeModal/AddRecipeModal';
import ConfirmationModal from '../ConfirmationModal/ConfirmationModal';
import './Home.scss'

function AddRecipe(props) {
  const [isEdit, setIsEdit] = useState(false)
  const [data, setData] = useState([])
  const [searchQuery, setQuery] = useState('')
  const [initialData, setInitialData] = useState([])
  const [dataToUpdate, setDataToUpdate] = useState({})
  const recipeRef = useRef(null);
  const confirmationRef = useRef(null);
  const [recTDelete, setRecToDel] =  useState('')


  useEffect(() => {
    const session = window.localStorage.getItem('session')
    const parsed = JSON.parse(session)
    fetch(`/recipes/?username=${parsed.username}`)
      .then(response => response.json())
      .then(data => {
        setData(data.recipes)
        setInitialData(data.recipes)
      });
  }, []);
  
  const handleChange = e => {
    const query = e.target.value
    setQuery(query)
    const fuse = new Fuse(data, {keys: [
      'name',
      'ingredients',
      'tags',
      'title'
    ]});
    const result = fuse.search(query).map((res) => res.item);
    setData(result)
    if(query === '') {
      setData(initialData)
    }
  };

  const removeRecipe = (e, name) => {
    e.preventDefault();
    setRecToDel(name)
    confirmationRef.current.style.display = "block";
  };

  const editRecipe = (e, name) => {
    e.preventDefault();
    setIsEdit(true)
    for(let data of initialData) {
      if(data.name === name) {
        setDataToUpdate(data)
      }
    }
    recipeRef.current.style.display = "block";
  };

  return (
    <>
      <form>
        <input onChange={handleChange} className='search' type="text" placeholder="Search.." name="search" id="query" value={searchQuery}/>
      </form>
      {data && data.length === 0 && <h1 style={{"color": '#fff', "text-align": "center"}}>You don't have any Recipes</h1>}
      <div className='cardContainer'>
      {data.map(entry => {
        return <Card key={entry.name} data={entry} removeRecipe={removeRecipe} editRecipe={editRecipe}/>
      })}
      </div>
      <ConfirmationModal ref={confirmationRef} item={recTDelete} />
      <AddRecipeModal ref={recipeRef} isEdit={isEdit} dataToUpdate={dataToUpdate}/>
    </>)
}

export default AddRecipe;
