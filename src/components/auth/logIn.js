import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import UserContext from "../../contexts/UserContext";
axios.defaults.withCredentials = true;


export default function LogIn() {
  const navigate = useNavigate();
const { storeToken } = useContext(UserContext);
  /*
======================== STATES ======================
*/
  const [formState, setFormState] = useState({
    username: "",
    password: "",
  });

  const [errorMessage, setMessage] = useState("");

  /*
======================== FUNCTIONS ======================
*/

  const updateInput = (e, thingToUpdate) => {
    setFormState({ ...formState, [thingToUpdate]: e.target.value });
  };

  const LoginSubmit = (event) => {
    event.preventDefault();

    axios
      .post(
        "https://acts-api-production.up.railway.app/user/login",
        {
          userName: formState.username,
          password: formState.password,
        },
        { withCredentials: true }
      )
      .then((msg) => {
        console.log(msg);
        if (msg.data.result === "Successfully logged in") {
          storeToken(msg.data.authToken)
          navigate("/");
          //window.location.reload();
          console.log(msg.data)
        } else {
          setMessage(msg.data.result);
          console.log(msg.data.result)
        }
      })
      .catch((err) => console.log(err));
  };

  /*
======================== USE EFFECTS ======================
*/
  useEffect(() => {
    console.log(errorMessage);
  }, [errorMessage]);

  /*
======================== HTML(JSX) ======================
*/

  return (
    <div id="profilePage">
      <div className="homePage profilePage">
        <div className="username">
          <h1>Log In Page</h1>

          <form>
            {<p>{errorMessage}</p>}
            <label>UserName/Email</label>
            <input
              id="usernameInput"
              type="text"
              value={formState.username}
              onChange={(e) => {
                updateInput(e, "username");
              }}
            ></input>

            <label>Password</label>
            <input
              type="password"
              id="passwordInput"
              value={formState.password}
              onChange={(e) => {
                updateInput(e, "password");
              }}
            ></input>

            <br></br>
            <br></br>

            <button onClick={LoginSubmit}>Submit</button>
          </form>
        </div>
      </div>
    </div>
  );
}
