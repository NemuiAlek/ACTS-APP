import { useEffect, useState, useContext } from "react";
import {Link, useNavigate} from "react-router-dom";
import axios from "axios";
import Captcha from '../../API/captcha';

const linkStyle = {
    textDecoration: "none",
    color: 'black',
    'fontWeight': 'bold',
};

export default function SignUp(){

    const navigate = useNavigate();
/*
======================== STATES ======================
*/
	const [formState, setFormState] = useState({
		username: "",
        email: "",
		password: "",
        confirmPassword: "",
	});

    const [errorMessage, validate] = useState({
        validUsername:false,
        validEmail:false,
        validPass:false,
        validConfirm: false,
    })

/*
const captchaCall = x =>{
    Captcha('https://www.google.com/recaptcha/api.js');
}
*/

/*
======================== FUNCTIONS ======================
*/

const validation = (type,str) => {

    let req

if (type === 'Pass'){
    req = /^(?=.*[a-z])(?=.*[A-Z]).{6,30}$/;
} else if (type === 'Email'){
    req = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
}

    if(str.match(req)){
        return true
    } else {
        return false
    }    

}

const validateConfirm = () =>{
    if(formState.password === '' || formState.confirmPassword === ''){
        validate((x) => ({...x, validConfirm: false}))
    }else if(formState.confirmPassword !== formState.password){
        validate((x) => ({...x, validConfirm: 'Passwords dont match!'}))
    }else if (formState.confirmPassword === formState.password){
        validate((x) => ({...x, validConfirm: true}))
    }
}

const updateInput = (e, thingToUpdate) => {
    setFormState({ ...formState, [thingToUpdate]: e.target.value });
};

const submitSignupForm = (event) => {

    event.preventDefault();

    axios
    .post(
        "http://localhost:4000/user/validate",
        {
            userName: formState.username,
            email: formState.email,
        },{withCredentials: true}
    )
    .then((msg) => {
    
        if (formState.username === ''){
            validate((x) => ({...x, validUsername: 'Username cannot be blank'}))
        }else if(msg.data === 'Username already in use.'){
                validate((x) => ({...x, validUsername: msg.data}))
        }else {
            validate((x) => ({...x, validUsername: true}))
        }
    
        if (formState.email === ''){
            validate((x) => ({...x, validEmail: 'Email cannot be blank'}))
        }else if(msg.data === 'Email already in use.'){
            validate((x) => ({...x, validEmail: msg.data}))
        }else if(!validation('Email', formState.email)){
            validate((x) => ({...x, validEmail: 'Invalid Email'}))
        } else {
            validate((x) => ({...x, validEmail: true }))
        }
    
        if ( formState.password === ''){
            validate((x) => ({...x, validPass: 'Password cannot be blank'}))
        }
        else if(!validation('Pass', formState.password)){
            validate((x) => ({...x, validPass: 'Password must be between 6-30 charcters and contain one upper case, one lower case and a number'}))
        } else {
            validate((x) => ({...x, validPass: true }))
        }
    
        validateConfirm()
        
    })
    .catch((err) => {
        console.log(err);
    });


};

/*
======================== USE EFFECTS ======================
*/

useEffect(()=>{    

validateConfirm()

},[formState.confirmPassword, formState.password])

useEffect(()=>{
    if(errorMessage.validUsername === true && errorMessage.validEmail === true && errorMessage.validPass === true && errorMessage.validConfirm === true){
        axios
            .post(
                "http://localhost:4000/user/signup",
                {
                    userName: formState.username,
                    email: formState.email,
                    password: formState.password,
                    confirmPassword: formState.confirmPassword,
                    role: 'admin'
                },
                { withCredentials: true }
            )
            .then((response) => {
                console.log(response)//getUserInfo();
                navigate("/login")
            })
            .catch((err) => {
                console.log(err);
            });
        }
},[errorMessage])

/*
======================== HTML(JSX) ======================
*/
    return (
        <div id="profilePage">
            <div className="homePage profilePage">
    
        <h1>Sign Up</h1>

        <div className="username">
            <form>

                <br />
                {errorMessage.validUsername !== false && (
                    <p>{errorMessage.validUsername}</p>
                )}
                <label>UserName</label>
                <input id="usernameInput"
                type="text"
                value={formState.username}
                onChange={(e) => {
                updateInput(e, "username");
                }}></input>

                <br />
                {errorMessage.validEmail !== false && (
                    <p>{errorMessage.validEmail}</p>
                )}
                <label>Email</label>
                <input id="emailInput"
                type="text"
                value={formState.email}
                onChange={(e) => {
                updateInput(e, "email");
                }}></input>

                <br />
                {errorMessage.validPass !== false && (
                    <p>{errorMessage.validPass}</p>
                )}
                <label>Password</label>
                <input 
                type="password" id="passwordInput"
                value={formState.password}
                onChange={(e) => {
                updateInput(e, "password");
                }}></input>

                <br />
                {errorMessage.validConfirm !== false && (
                    <p>{errorMessage.validConfirm}</p>
                )}
                <label>Confirm Password</label>
                <input id="confirmPasswordInput"
                type="password"
                value={formState.confirmPassword}
                onChange={(e) => {
                updateInput(e, "confirmPassword");
                }}></input>

                <br/>
                
                <button onClick={submitSignupForm}>Submit</button>
            </form>
        </div>
    </div>
</div>
    )
    }