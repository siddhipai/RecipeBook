import React, { useEffect, useState } from 'react';
import './AddRecipeModal.scss'
import * as uString from 'underscore.string'

const AddRecipeModal = React.forwardRef(function AddRecipeModal(props, recipeRef) {
    const {dataToUpdate, isEdit} = props
    const [recName, setRecName] = useState('')
    const [iniName, setInitialName] = useState('')
    const [recTitle, setRecTitle] = useState('')
    const [error, setError] = useState({})
    const [recTags, setRecTags] = useState('')
    const [ingredients, setIngredients] = useState('')
    const [tags, setTags] = useState([])

    useEffect(() => {
        if(isEdit) {
            setRecTitle(dataToUpdate.title)
            setInitialName(dataToUpdate.name)
            setRecName(dataToUpdate.name)
            setIngredients(dataToUpdate.ingredients)
            const tags = (dataToUpdate.tags && dataToUpdate.tags.split(',')) || []
            setTags(tags)
            const tagsString = tags.join(',')
            setRecTags(tagsString)
        }
    }, [dataToUpdate, isEdit])

    const onModalCancel = () => {
        setError({})
        if(!isEdit) {
            setRecTitle('')
            setRecName('')
            setIngredients('')
        }
        recipeRef.current.style.display = 'none';
    }
    const handleChangeIngr = e => {
        const targetVal = e.target.value
        setIngredients(targetVal)
    }

    const handleChangeTitle = e => {
        setError({})
        if(!isEdit) {
            const name = slugify(e.target.value)
            setRecName(name)
        }
        setRecTitle(e.target.value)
    }
    const addIngredientsToStore = async (e) => {
        e.preventDefault()
        const session = window.localStorage.getItem('session')
        const parsed = JSON.parse(session)
        if(!recName || !recTitle || recTitle === '') {
            setError({message: 'Recipe needs a valid name'})
            return
        }
        if(isEdit) {
            fetch(`/updateRecipe`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({title: recTitle, ingredients: ingredients, tags: recTags, name: iniName, newName: recName})
                }).then(res => res.json())
                .then(res => {
                    setError({status: res.status, message: res.message})
                    if(res.status > 400) {
                    } else {
                        setTimeout(()=> {
                            window.location.reload()
                        }, 1000)
                    }
                })
        } else {
        fetch('/saverecipes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({title: recTitle, name: recName, tags: recTags, ingredients: ingredients, username: parsed.username})
            }).then(res => res.json())
            .then(res => {
                setError({status: res.status, message: res.message})
                if(res.status > 400) {
                } else {
                    setTimeout(()=> {
                        window.location.reload()
                    }, 1000)
                }

            })
        }
    }

    function slugify (text) {
        let allowedCharacters = 'a-zA-Z0-9_.\\-'
        const pattern = new RegExp(`[^${allowedCharacters}]+`, 'g')
        return uString.trim(
          uString
            .cleanDiacritics(text)
            .replace(pattern, '-')
            .toLowerCase(),
          '-'
        )
      }


    function handleKeyDown(e){
        if(e.key !== 'Enter') return
        const value = e.target.value
        if(!value.trim()) return
        const tagArr = [...tags]
        tagArr.push(value)
        setTags(tagArr)
        const tagsString = tagArr.join(',')
        setRecTags(tagsString)
    }

    function tagsToStr(tag, index){
        const filteredTags = tags.filter((item, ind) => item !== tag && ind !== index)
        setTags(filteredTags)
        const tagsString = filteredTags.join(',')
        setRecTags(tagsString)
    }

    return (
        <div id='newRecipe' ref={recipeRef} className='modal'>
            <div className='modal-content'>
                <span onClick={onModalCancel} className='close'>&times;</span>
                <form id='ingredient-form'>
                    <div className='formContainer'>
                        <div className='content'>
                            <label htmlFor='name'>Title:</label>
                            <input onChange={handleChangeTitle} type='text' step='any' value={recTitle} required placeholder='Enter title of recipe' />
                        </div>
                        <div className='content'>
                            <label htmlFor='name'>Name:</label>
                            <input disabled type='text' step='any' value={recName} required placeholder='Enter name of recipe'/>
                        </div>
                        <div className='content'>
                            <label htmlFor='ingredient'>Ingredients:</label>
                            <textarea rows="4" cols="50" onChange={handleChangeIngr} type='text' value={ingredients} required placeholder='Enter ingredients'/>
                        </div>
                        <div className="tags-input-container">
                            { tags.map((tag, index) => (
                                <div className="tag-item" key={index}>
                                    <span className="text">{tag}</span>
                                    <span className="close" onClick={() => tagsToStr(tag, index)}>&times;</span>
                                </div>
                            )) }
                            <input rows="4" cols="50" onKeyDown={handleKeyDown} type='text' placeholder='Enter Tags' onKeyPress={(e) => { e.key === 'Enter' && e.preventDefault(); }}/>
                            <label htmlFor='tag'>Press Enter to add tag</label>
                        </div>
                        <button onClick={addIngredientsToStore} className='save-button'>
                            Add
                        </button>
                    </div>
                </form>
                {error && <p style={{'color': error.status > 400 ? 'red' : 'green'}}>{error.message}</p>}
            </div>
        </div>
    )
});




export default AddRecipeModal;