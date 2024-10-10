import { useState, useEffect, useReducer, useCallback } from 'react'
import './App.css'

const API_ENDPOINT = 'https://hn.algolia.com/api/v1/search?query=';

const App = () => {
  const [searchTerm, setSearchTerm] = useStorageState('searchTerm', 'React')

  const [stories, dispatchStories] = useReducer(
    storiesReducer,
    { data: [], isLoading: false, isError: false, searchTerm }
  )

  // useCallback is used to memoize functions in React, preventing unnecessary re-creations of functions on re - renders.
  const handleFetchStories = useCallback(() => {
    if (!searchTerm) return;
    console.log("handleFetchStories called")
    dispatchStories({ type: "STORIES_FETCH_INIT" })

    fetch(`${API_ENDPOINT}${searchTerm}`)
      .then(resp => resp.json())
      .then(res => dispatchStories({ type: "STORIES_FETCH_SUCCESS", payload: res.hits }))
      .catch(() => dispatchStories({ type: "STORIES_FETCH_FAILURE" }))
  }, [searchTerm]);


  useEffect(handleFetchStories, [handleFetchStories])

  const handleRemoveStory = (item) => {
    dispatchStories({
      type: "REMOVE_STORY",
      payload: item
    })
  }


  const handleSearch = (event) => {
    setSearchTerm(event.target.value)
  }

  // const filteredStories = stories.data.filter((story) =>
  //   story.title.toLowerCase().includes(searchTerm.toLowerCase())
  // )

  return (
    <div>
      <h1>My Hacker Stories</h1>
      <InputWithLabel
        label="Search"
        id="search"
        value={searchTerm}
        onInputChange={handleSearch}
        type="text"
      >
        <strong>Search: </strong>
      </InputWithLabel>
      <hr />
      {stories.isError && <p>Something went wrong ...</p>}
      <div>
        <List list={stories.data} onRemoveItem={handleRemoveStory} isLoading={stories.isLoading} />
      </div>
    </div>
  )
}


const List = ({ list, onRemoveItem, isLoading }) => {
  return isLoading ? (
    <p>Loading...</p>
  ) : (
    <ul>
      {list.map((item) => (
        <Item key={item.objectID} item={item} onRemoveItem={onRemoveItem} />
      ))}
    </ul>
  )
}

const Item = ({ item, onRemoveItem }) => (
  <li>
    <span>
      <a href={item.url}>{item.title}</a>
    </span>
    <span>{item.author}</span>
    <span>{item.num_comments}</span>
    <span>{item.points}</span>
    <span>
      <button type="button" onClick={() => onRemoveItem(item)}>
        Dismiss
      </button>
    </span>
  </li>
)


const useStorageState = (key, initState) => {
  const [value, setValue] = useState(localStorage.getItem(key) || initState)

  useEffect(() => {
    console.log('useStorageState called')
    localStorage.setItem(key, value)
  }, [value])

  return [value, setValue]
}

const InputWithLabel = ({
  id,
  label,
  value,
  type = 'text',
  onInputChange,
  children,
}) => (
  <div>
    <label htmlFor={label}>{children}</label>
    <input
      id={id}
      type={type}
      onChange={onInputChange}
      value={value}
      autoFocus
    />
  </div>
)


const storiesReducer = (state, action) => {
  switch (action.type) {
    case "STORIES_FETCH_INIT":
      return {
        ...state,
        isLoading: true,
        isError: false
      };
    case "STORIES_FETCH_SUCCESS":
      return {
        ...state,
        isLoading: false,
        data: action.payload
      };
    case "STORIES_FETCH_FAILURE":
      return {
        ...state,
        isLoading: false,
        isError: true
      };
    case "REMOVE_STORY":
      return {
        ...state,
        data: state.data.filter(story => action.payload.objectID !== story.objectID)
      };
    default:
      throw new Error();
  }
}

export default App

