import { createContext, useState, useEffect } from "react";
import {useNavigate} from "react-router-dom";
import axios from "axios";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
	const navigate = useNavigate();
	const [theUser, setTheUser] = useState({});

	const getUserInfo = () => {
		axios
			.get("http://localhost:4000/user/serialize", {
				withCredentials: true,
			})
			.then((response) => {
				setTheUser(response.data);
			})
			.catch((err) => {
				console.log(err);
			});
	};

	useEffect(() => {
		getUserInfo();
	}, []);

	const logout = () => {
		axios
			.post("http://localhost:4000/user/logout", {}, { withCredentials: true })
			.then((response) => {
				console.log(response.data);
				if (response.data.message === "successfully logged out")
					setTheUser(null);
					navigate("/");
					window.location.reload();
			})
			.catch((err) => {
				console.log(err);
			});
	};

	return (
		// which states/functions we want as global variables. you have to pass the value in order for it to be available.
		<UserContext.Provider
			value={{ theUser, setTheUser, logout, getUserInfo }}
		>
			{children}
		</UserContext.Provider>
	);
};

export default UserContext;

// To Create a Context
// 1. Create a context.jsx file, add all necessary boilerplate code and the states
// 2. Wrap your App with the contextProvider in App.js
// 3. Use useContext(contextName) method to get your state values in any component you want.
