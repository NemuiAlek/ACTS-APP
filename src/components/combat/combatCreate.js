import { useEffect, useState, useContext } from "react";
import {Link, useNavigate, useParams} from "react-router-dom";
import Button from 'react-bootstrap/Button';
import UserContext from "../../contexts/UserContext"
import axios from "axios"
import Table from 'react-bootstrap/Table';

export default function CombatTracker(){

const { theUser, getUserInfo } = useContext(UserContext);  
const navigate = useNavigate();

/*
======================== STATES ======================
*/

const [combat,setCombat] = useState({
    id:'',
    name: '',
    desc: '',
    round: 0,
    roundUpdate:false
})
const [savedCombats, setSaved] = useState([{
    id:0,
    name:'',
    desc:'',
    currentRound:'',
    createdDate:'',
    modifiedDate:''
}])

const [updateMode, setUpdateMode] = useState(false)
const [waitToLoad, activateLoad] = useState(false)

setTimeout(() => {
    activateLoad(true)
}, 1000);

/*
======================== FUNCTIONS ======================
*/
const createBtn = (event, action) => {

    event.preventDefault();

    // fix this later plz
    combat.name = combat.name.replace(/'/g,"''")
    combat.desc = combat.desc.replace(/'/g,"''")
    console.log(combat)

    axios
    .post("http://localhost:4000/combat/create-update/"+action,
    {
        userID: theUser.id ? theUser.id : 'Guest',
        data: combat
    })
    .then((response) => {
        updateMode ? getSavedCombats() : navigate('/combattrack/'+response.data.id);
        setCombat({...combat,id:0,
                            name:'',
                            desc:''})
        setUpdateMode(false)
    })
    .catch((err) => {
        console.log(err);
    });
    //*/    
}

const getSavedCombats = () =>{
    axios
    .get("http://localhost:4000/combat/"+(theUser.id ? theUser.id : 'Guest'), {
    })
    .then((response) => {
        setSaved(response.data);
        console.log(response.data);
    })
    .catch((err) => {
        console.log(err);
    });
}


const updateInput = (e, thingToUpdate) => {
    setCombat({ ...combat, [thingToUpdate]: e.target.value });
};

const updateField = (id, name, desc) =>{
    setCombat({...combat,id:id,
                         name:name,
                         desc:desc})
}

/*
======================== USE EFFECTS ======================
*/

useEffect(() => {
    getSavedCombats()
}, [waitToLoad])

/*
======================== HTML(JSX) ======================
*/

return (
<div id="createCombat">
    
    <div id="combatInfo">
    <div id="topInfo">
            <h5>{theUser ? 'Logged in as '+theUser.userName+' (Combat will be saved after each round)' : 'GUEST MODE: (Combat will be lost after 24hr. Please sign up to save combat permanently.)'}</h5>
            {theUser && !updateMode && <Button variant="secondary" className="profileEditOptions"  onClick={() => setUpdateMode(true)}>Update</Button>}
            {theUser && updateMode && <label>Update mode activated. Click on any combate from the list to update then click save.</label>}
    </div>

            <h1>New Encounter</h1>
            <h4>{theUser.name}</h4>

        <div className="inputGrouping top">
            <div className="inputField medium">
                <label>Encouter Name</label>
                <textarea 
                    className="form-control medium"
                    value={combat.name}
                    onChange={(e) => {
                    updateInput(e, "name");
                    }} /> 
            </div>

            <div className="inputField large">
                <label>Encounter Description</label>
                <textarea 
                    className="form-control large"
                    value={combat.desc}
                    onChange={(e) => {
                    updateInput(e, "desc");
                    }} /> 
            </div>

            <Button variant="success" className="profileEditOptions" size="lg" onClick={(event) => updateMode ? createBtn(event,'update') : createBtn(event,'new')}>Save</Button>
        </div>
    </div>

    <div id="savedCombats">
    <Table striped hover size="sm" className="monsterList">
            <thead>
                <tr className="combatListHead">
                    <th>Name</th>
                    <th>Description</th>
                    <th>Current Round</th>
                    <th>Date Created</th>
                    <th>Last Played</th>
                </tr>
            </thead>
     
            <tbody>
        {Array.isArray(savedCombats) && savedCombats.map((combat) => (
                <tr key={combat.id} onClick={() => {if(!updateMode){ navigate('/combattrack/'+combat.id)}else{updateField(combat.id, combat.name, combat.desc)}}}>
                    <td>{combat.name}</td>
                    <td className="large">{combat.desc}</td>
                    <td className="small">{combat.currentRound}</td>
                    <td className="small">{combat.createdDate}</td>
                    <td className="small">{combat.modifiedDate}</td>
                </tr>))
        } 
            </tbody>
        </Table>
    </div>

</div>
    )
    }