import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
axios.defaults.withCredentials = true;

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const navigate = useNavigate();
  const [theUser, setTheUser] = useState({});

  const storeToken = (token) => {
    localStorage.setItem('authToken',token)

    console.log(localStorage)
  }

  const getUserInfo = () => {
    const storedToken = localStorage.authToken
    axios
      .get("https://acts-api-production.up.railway.app/user/serialize", {
        headers: {Authorization: `Bearer ${storedToken}`}
      },{withCredentials: true})
      .then((response) => {
        setTheUser(response.data);
      })
      .catch((err) => {
        setTheUser({});
        console.log(err);
      });
      
  };

  useEffect(() => {
    getUserInfo();
  }, []);

  const removeToken = () => {                    // <== ADD
    // Upon logout, remove the token from the localStorage
    localStorage.removeItem("authToken");
  }

  const logout = () => {

    removeToken();

    getUserInfo();

  };

  return (
    // which states/functions we want as global variables. you have to pass the value in order for it to be available.
    <UserContext.Provider value={{ theUser, setTheUser, logout, getUserInfo, storeToken }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;

// To Create a Context
// 1. Create a context.jsx file, add all necessary boilerplate code and the states
// 2. Wrap your App with the contextProvider in App.js
// 3. Use useContext(contextName) method to get your state values in any component you want.
