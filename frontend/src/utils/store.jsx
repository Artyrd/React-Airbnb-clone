import React from 'react'

export const StoreContext = React.createContext(null)

const store = ({ children }) => {
  const [token, setToken] = React.useState(localStorage.getItem('token'))
  const [email, setEmail] = React.useState(localStorage.getItem('email'))
  // const [tvShows, setTvShows] = React.useState([])

  const store = {
    token: [token, setToken],
    email: [email, setEmail],
    // tvShows: [tvShows, setTvShows],
  }

  return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
}

export default store;
