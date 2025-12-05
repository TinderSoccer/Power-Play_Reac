import React from 'react'
import TopBar from './TopBar'
import Logo from './Logo'
import SearchBar from './SearchBar'
import UserActions from './UserActions'

const Header = ({ cartCount, onCartClick, user, onLogout, onSearch, favoritesCount, onFavoritesClick, onOrdersClick, onLoginClick, onStoresClick, onSignupClick, onAccountClick }) => {
  return (
    <header>
      <TopBar
        onStoresClick={onStoresClick}
        onSignupClick={onSignupClick}
        onLoginClick={onLoginClick}
        onAccountClick={onAccountClick}
      />

      <div className="top-bar">
        <Logo />
        <SearchBar onSearch={onSearch} />
        <UserActions
          cartCount={cartCount}
          onCartClick={onCartClick}
          user={user}
          onLogout={onLogout}
          favoritesCount={favoritesCount}
          onFavoritesClick={onFavoritesClick}
          onOrdersClick={onOrdersClick}
          onLoginClick={onLoginClick}
        />
      </div>
    </header>
  )
}

export default Header