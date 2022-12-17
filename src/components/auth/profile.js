import { useEffect, useState, useContext } from "react";
import {Link, useNavigate} from "react-router-dom";
import UserContext from "../../contexts/UserContext";
import axios from "axios";

export default function Profile(){
    
    const { theUser, getUserInfo } = useContext(UserContext);   
    const navigate = useNavigate();

/*
======================== STATES ======================
*/
    const [userInfo, setUser] = useState({
        username:'',
        email:'',
        currentPass:'',
        newPass:'',
        confirmPass:'',
        wait: false
    });

    const [errorMessage, validate] = useState({
        validUsername:false,
        validEmail:false,
        validCurrentPass:false,
        validNewPass:false,
        validConfirm: false,
    });

    const [editMode, setEditMode] = useState(false);
    const [deleteMode, setDeleteMode] = useState(false);

/*
======================== FUNCTIONS ======================
*/

    const waitToLoad = () =>{
        setTimeout(() => {
            setUser((x) => ({...x, wait:true}))
        }, 1500);
    }

    const updateInput = (e, thingToUpdate) => {
        setUser({ ...userInfo, [thingToUpdate]: e.target.value });
    };

    const enableEdit = () =>{
        setEditMode(true)
    }

    const enableDelete = (event) =>{
        event.preventDefault();
            setDeleteMode(true)
    }

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
        if(userInfo.newPass === '' && userInfo.confirmPass === ''){
            validate((x) => ({...x, validConfirm: true}))
        }else if(userInfo.newPass === '' && userInfo.confirmPass !== '' || userInfo.newPass !== '' && userInfo.confirmPass === '' ){
            validate((x) => ({...x, validConfirm: false}))
        }else if(userInfo.confirmPass !== userInfo.newPass){
            validate((x) => ({...x, validConfirm: 'Passwords dont match!'}))
        }else if (userInfo.confirmPass === userInfo.newPass){
            validate((x) => ({...x, validConfirm: true}))
        }
    }

    const submitUpdateUser = (event) => {

        event.preventDefault();

            if (userInfo.username === ''){
                validate((x) => ({...x, validUsername: 'Username cannot be blank'}))
            }else {
                validate((x) => ({...x, validUsername: true}))
            }
        
            if (userInfo.email === ''){
                validate((x) => ({...x, validEmail: 'Email cannot be blank'}))
            }
            else if(!validation('Email', userInfo.email)){
                validate((x) => ({...x, validEmail: 'Invalid Email'}))
            } else {
                validate((x) => ({...x, validEmail: true }))
            }
        
            if ( userInfo.currentPass === '' && userInfo.newPass !== ''){
                validate((x) => ({...x, validCurrentPass: 'Password cannot be blank'}))
            }else {
                validate((x) => ({...x, validCurrentPass: true }))
            }

            if ( userInfo.newPass === '' && userInfo.currentPass !== ''){
                validate((x) => ({...x, validNewPass: 'Password cannot be blank'}))
            }
            else if(!validation('Pass', userInfo.newPass) && userInfo.newPass !== ''){
                validate((x) => ({...x, validNewPass: 'Password must be between 6-30 charcters and contain one upper case, one lower case and a number'}))
            }
             else {
                validate((x) => ({...x, validNewPass: true }))
            }
        
            validateConfirm()
            
            console.log(errorMessage)
            console.log(userInfo)
        };

    const deleteUser = (event) =>{
        event.preventDefault();

        if(userInfo.currentPass === ''){
            validate((x) => ({...x, validCurrentPass: 'Password cannot be blank'}))
        } else if (editMode === true && deleteMode === true){
            axios
                .post(
                    "http://localhost:4000/user/delete/"+theUser.id,
                    {
                        currentPass: userInfo.currentPass,
                    },
                    { withCredentials: true }
                )
                .then((result) => {
                    navigate('/');
                    window.location.reload();
                    alert(result.data);
                    
                })
                .catch((err) => {
                    console.log(err);
                    const errorMessage = err.response.data.message
                    if (errorMessage === 'Incorrect Password'){
                        validate((x) => ({...x, validCurrentPass: errorMessage}))
                    }
                    else if (errorMessage === 'No session found, please log in'){
                        alert(errorMessage)
                        navigate('/login')
                    } else {
                        alert(errorMessage)
                    }
                });
        }
    }
/*
======================== USE EFFECTS ======================
*/
    useEffect(() => {
        
        waitToLoad()

        if(theUser === null){
            return
        } else{
            setUser((x) => ({...x, username:theUser.userName}))
            setUser((x) => ({...x, email:theUser.email}))
        }

    }, [userInfo.wait])
    
    useEffect(()=>{    

        validateConfirm()
        
    },[userInfo.confirmPass,userInfo.newPass])


    useEffect(()=>{
        if(errorMessage.validUsername === true && errorMessage.validEmail === true &&
             errorMessage.validCurrentPass === true && errorMessage.validNewPass === true && errorMessage.validConfirm === true && editMode === true){
            axios
                .put(
                    "http://localhost:4000/user/update/"+theUser.id,
                    {
                        userName: userInfo.username,
                        email: userInfo.email,
                        currentPass: userInfo.currentPass,
                        newPass: userInfo.newPass,
                        confirmPass: userInfo.confirmPass,
                    },
                    { withCredentials: true }
                )
                .then(() => {
                    window.location.reload();
                })
                .catch((err) => {
                    console.log(err);
                    const errorMessage = err.response.data.message
                    if (errorMessage === 'Email ' + userInfo.email + ' is already registered'){
                        validate((x) => ({...x, validEmail: errorMessage}))
                    }
                    else if (errorMessage === 'Username ' + userInfo.username + ' is already registered'){
                        validate((x) => ({...x, validUser: errorMessage}))
                    }
                    else if (errorMessage === 'Current password is incorrect'){
                        validate((x) => ({...x, validCurrentPass: errorMessage}))
                    }
                    else if (errorMessage === 'No session found, please log in'){
                        alert(errorMessage)
                        navigate('/login')
                    } else {
                        alert(errorMessage)
                    }
                });
            }
    },[errorMessage])


/*
======================== HTML(JSX) ======================
*/
        return (
        
        <div id="profilePage">
            <div className="homePage profilePage">
        
            <h1>Profile</h1>
            
            <img className="profileImage" src={"/noImgProfile.png"} />
            <br />

            <form className="profileForm">
            {errorMessage.validUsername !== false && errorMessage.validUsername !== true  && (
                <p>{errorMessage.validUsername}</p>
            )}
            <label>Username</label>
            <input disabled={!editMode} 
                type="text"
                value={userInfo.username}
		        onChange={(e) => {
		        updateInput(e, "username");
		        }} />

            <br />
            {errorMessage.validEmail !== false && errorMessage.validEmail !== true && (
                <p>{errorMessage.validEmail}</p>
            )}
            <label>Email</label>
            <input disabled={!editMode} 
                type="text"
                value={userInfo.email}
		        onChange={(e) => {
		        updateInput(e, "email");
		        }} />

            <br />

            {!editMode && (
                <div>
                    <button onClick={enableEdit}>Edit</button>
                </div>
            )}


            {editMode && !deleteMode && (
                <div className="editMode">
                <h4>Update Password</h4>
                {errorMessage.validCurrentPass !== false && errorMessage.validCurrentPass !== true && (
                    <p>{errorMessage.validCurrentPass}</p>
                )}
                <label>Current Password</label>
                <input disabled={!editMode} 
                type="password"
                value={userInfo.currentPass}
		        onChange={(e) => {
		        updateInput(e, "currentPass");
		        }} />

                <br />
                {errorMessage.validNewPass !== false && errorMessage.validNewPass !== true && (
                    <p>{errorMessage.validNewPass}</p>
                )}
                <label>New Password</label>
                <input disabled={!editMode}
                type="password" 
                value={userInfo.newPass}
		        onChange={(e) => {
		        updateInput(e, "newPass");
		        }} />
                <br />

                {errorMessage.validConfirm !== false && errorMessage.validConfirm !== true && (
                    <p>{errorMessage.validConfirm}</p>
                )}
                <label>Confirm Password</label>
                <input disabled={!editMode} 
                type="password"
                value={userInfo.confirmPass}
		        onChange={(e) => {
		        updateInput(e, "confirmPass");
		        }} />
                <br />

                <button className="profileEditOptions" onClick={submitUpdateUser}>Update</button>
                <button className="profileEditOptions" onClick={enableDelete}>Delete Account</button>
                </div>
                
            )}

                {deleteMode && (
                    <div id="editMode">
                    <h4>DELETE ACCOUNT</h4>
                    <h5>THIS ACTION CANNOT BE REVERTED!</h5>
                    {errorMessage.validCurrentPass !== false && errorMessage.validCurrentPass !== true && (
                        <p>{errorMessage.validCurrentPass}</p>
                    )}
                    <label>Enter Password</label>
                    <input disabled={!editMode} 
                    type="password"
                    value={userInfo.currentPass}
                    onChange={(e) => {
                    updateInput(e, "currentPass");
                    }} />
                        <button className="profileEditOptions" id="finalDelete" onClick={deleteUser}>Delete Account</button>
                        <br />
                        <button className="profileEditOptions" onClick={window.location.reload}>Cancel</button>
                    </div>
                )}

            </form>
            
            </div>
    </div>
)}