import './card.scss'
import { RiCloseCircleLine } from 'react-icons/ri';
import { TiEdit } from 'react-icons/ti'

function Card(props) {

  const {data, removeRecipe, editRecipe} = props
  const ingredients = data.ingredients.split(',')
  const tags = (data.tags && data.tags.split(',')) || []
  return <div className='cardIcons'><div className='card' key={data.name}>
    <div className="container">
      <div className='icons'>
          <RiCloseCircleLine
            onClick={e => removeRecipe(e, data.name)}
            className='delete-icon'
          />
          <TiEdit
            onClick={e => editRecipe(e, data.name)}
            className='edit-icon'
          />
      </div>
      <h3><b>Title:</b></h3> 
      <p>{data.title}</p> 
      <h3><b>Name:</b></h3> 
      <p>{data.name}</p> 
      {data.ingredients && <h3><b>Ingredients:</b></h3> }
      {ingredients.map(ing => <p>{ing}</p> 
      )}
      {data.tags && <h3><b>Tags:</b></h3> }
      { tags.map((tag, index) => (
        <div className="tag-item" key={index}>
            <span className="text">{tag}</span>
        </div>
      ))}
    </div>
    </div>
  </div>
}

export default Card;
