import { useState, useEffect, Fragment } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

const List = ({ list, onRemoveItem, isLoaded }) => {
  return isLoaded ? (
    <ul>
      {list.map((item) => (
        <Item key={item.objectID} item={item} onRemoveItem={onRemoveItem} />
      ))}
    </ul>
  ) : (
    <p>Loading...</p>
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

const initialStories = [
  {
    title: 'React',
    url: 'https://reactjs.org/',
    author: 'Jordan Walke',
    num_comments: 3,
    points: 4,
    objectID: 0,
  },
  {
    title: 'Redux',
    url: 'https://redux.js.org/',
    author: 'Dan Abramov, Andrew Clark',
    num_comments: 2,
    points: 5,
    objectID: 1,
  },
]

const getAsyncStories = () =>
  new Promise((resolve) =>
    setTimeout(() => resolve(
      { data: { stories: initialStories } },
    ), 2000)
  )

const App = () => {
  const [stories, setStories] = useState([])
  const [isLoaded, setIsLoaded] = useState(false)
  const [isError, setIsError] = useState(false)
  
  useEffect(() => {
    getAsyncStories()
    .then((res) => {
      setStories(res.data.stories)
      setIsLoaded(true)
    })
    .catch(() => setIsError(true))
  }, [])

  const handleRemoveStory = (item) => {
    const newStories = stories.filter(
      (story) => story.objectID !== item.objectID
    )
    setStories(newStories)
  }

  const [searchTerm, setSearchTerm] = useStorageState('searchTerm', 'React')

  const handleSearch = (event) => {
    setSearchTerm(event.target.value)
  }

  const filteredStories = stories.filter((story) =>
    story.title.toLowerCase().includes(searchTerm.toLowerCase())
  )

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
      {isError && <p>Something went wrong ...</p>}
      <div>
        <List list={filteredStories} onRemoveItem={handleRemoveStory} isLoaded={isLoaded} />
      </div>
    </div>
  )
}

export default App
