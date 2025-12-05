import { useState } from 'react'

const SearchBar = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('')

  const handleSearch = () => {
    if (onSearch) {
      onSearch(searchTerm)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  return (
    <div className="search-bar">
      <input
        type="text"
        id="search-input"
        placeholder="Buscar productos..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyPress={handleKeyPress}
      />
      <button id="search-btn" onClick={handleSearch}>
        <i className="fa-solid fa-magnifying-glass"></i>
      </button>
    </div>
  )
}

export default SearchBar