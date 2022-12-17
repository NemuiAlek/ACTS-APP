import { useEffect, useState, useContext } from "react";
import {Link, useNavigate, useParams} from "react-router-dom";
import axios from "axios"
import UserContext from "../../contexts/UserContext"
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';


export default function MonsterStandard(){

    const { theUser, getUserInfo } = useContext(UserContext);  
    const navigate = useNavigate();
    const params = useParams()
/*
======================== STATES ======================
*/

const [monster, setMonster] = useState({
    id:0,
    actions: [],
    alignment: "",
    armor_class: 0,
    armor_desc: "",
    challenge_rating: "0",
    charisma: 10,
    charisma_save: '',
    condition_immunities: "",
    constitution: 10,
    constitution_save: '',
    damage_immunities: "",
    damage_resistances: "",
    damage_vulnerabilities: "",
    dexterity: 10,
    dexterity_save: '',
    document__license_url: "",
    document__slug: "",
    document__title: "",
    hit_dice: "",
    hit_points: 0,
    intelligence: 10,
    intelligence_save: '',
    languages: "",
    legendary_actions: [],
    legendary_desc: "",
    name: "New Monster",
    perception: 0,
    reactions: "",
    senses: "",
    size: "",
    skills: [],
    skillsInputName:'',
    skillsInputDesc:'',
    slug: "",
    special_abilities:[],
    special_abilitiesInputName:'',
    special_abilitiesInputDesc:'',
    speed:[],
    speedInputName:'',
    speedInputDesc:0,
    spell_list: [],
    strength: 10,
    strength_save: '',
    subtype: "",
    type: "",
    wisdom: 10,
    wisdom_save: '',
    CreatedBy:0
})
const [newID, setForm] = useState(false)
const [arrayID, setArray] = useState({
    speed:0,
    skills:0,
    special_abilities:0,
    actions:0,
    legendary_actions:0
})
const[deleteMode,setDeleteMode] = useState({
    active:false,
    password:'',
    errorMsg:''
})


/*
======================== FUNCTIONS ======================
*/

const updateInput = (e, thingToUpdate) => {
    setMonster({ ...monster, [thingToUpdate]: e.target.value });
};

const enterPass = (e, thingToUpdate) => {
    setDeleteMode({ ...deleteMode, [thingToUpdate]: e.target.value });
};

const getMonster = () =>{
    axios
    .get("http://localhost:4000/monster/" + params.id, {
    })
    .then((response) => {
        setMonster(response.data);
    })
    .catch((err) => {
        console.log(err);
    });
}

const submitBtn = (event) => {

    event.preventDefault();

    // fix this later plz
    monster.name = monster.name.replace(/'/g,"''")
    monster.type = monster.type.replace(/'/g,"''")
    monster.alignment = monster.alignment.replace(/'/g,"''")
    monster.damage_vulnerabilities = monster.damage_vulnerabilities.replace(/'/g,"''")
    monster.damage_resistances = monster.damage_resistances.replace(/'/g,"''")
    monster.damage_immunities = monster.damage_immunities.replace(/'/g,"''")
    monster.condition_immunities = monster.condition_immunities.replace(/'/g,"''")
    monster.senses = monster.senses.replace(/'/g,"''")
    monster.languages = monster.languages.replace(/'/g,"''")

    console.log(monster, params.id)
    ///*
    axios
    .post("http://localhost:4000/monster/create-update/" + params.id, 
    {
        userID: theUser.id,
        data: monster
    })
    .then((response) => {
        if(params.id === 'new'){
            navigate('/monster/create-modify/'+response.data.id)
        } else{
            window.location.reload();
        }

    })
    .catch((err) => {
        console.log(err);
    });
    //*/    
}



const deleteMonster = () =>{

    console.log(theUser.id)

    axios
    .post("http://localhost:4000/monster/delete/" + params.id, {
        id:theUser.id,
        password:deleteMode.password
    })
    .then((response) => {
        console.log(response);
        navigate('/monster/custom');
        window.location.reload();;
    })
    .catch((err) => {
        console.log(err);
        const errorMessage = err.response.data.message
        if (errorMessage === 'Incorrect Password'){
            setDeleteMode((x) => ({...x, errorMsg: errorMessage}))
        }
        else if (errorMessage === 'No session found, please log in'){
            alert(errorMessage)
            navigate('/login')
        } else {
            alert(errorMessage)
        }
    });
}

const upadateArray = (array, id, name, modifier) => {
    setArray((x) => ({...x,[array]: id}))
    setMonster((x) => ({...x,[array+'InputName']: name,
                             [array+'InputDesc']: modifier
                        }));
}

const submitArray = (event, array) => {
    event.preventDefault();
    axios
    .post("http://localhost:4000/monster/create-update-array/" + arrayID[array].toString(), 
    {
        monsterID:params.id,
        arrayName: array,
        name: monster[array+'InputName'].replace(/'/g,"''''"),
        modifier: monster[array+'InputDesc'].replace(/'/g,"''''")
        
    })
    .then((response) => {
        setArray((x) => ({...x,[array]: 0}))
        setMonster((x) => ({...x,[array+'InputName']: ''}));
        setMonster((x) => ({...x,[array+'InputDesc']: ''}));
        getMonster();
    })
    .catch((err) => {
        console.log(err);
    });
}

const deleteArray = (event, array) => {
    event.preventDefault();
    axios
    .post("http://localhost:4000/monster/delete-array/" + arrayID[array].toString(), 
    {
        monsterID:params.id,
        arrayName: array
    })
    .then((response) => {
        setArray((x) => ({...x,[array]: 0}))
        setMonster((x) => ({...x,[array+'InputName']: ''}));
        setMonster((x) => ({...x,[array+'InputDesc']: ''}));
        getMonster();
    })
    .catch((err) => {
        console.log(err);
    });

}

/*
======================== USE EFFECTS ======================
*/

useEffect(() => {
    if(params.id === 'new'){
        setForm(true);
        return
    } else {
        getMonster();
        console.log(monster)
    }
}, [])

/*
======================== HTML(JSX) ======================
*/

if(deleteMode.active){
    return (
        <div id="deleteMonster">
            <div className="infoBox">
            <h1>WARNING - THIS WILL PERMANENTLY DELETE THE MONSTER</h1>
            <h2>Enter current password below if you are sure you want to delete.</h2>
            {deleteMode.errorMsg !== '' && <h5>Invalid Password</h5>}
            <input 
                    type="password"
                    value={deleteMode.password}
                    onChange={(e) => {
                    enterPass(e, "password");
                    }} />
            </div>
            {theUser && <Button variant="danger" className="profileEditOptions" onClick={deleteMonster}>Delete</Button>}
        </div>
    )
}

if(theUser){    return ( 

<div id="creatUpdatePage">

    <div id="updateCreatePage">

    <div id="monsterInput">
        <form>
        <div className="inputGrouping top">
            <div className="inputField large">
                <label>Name</label>
                <textarea 
                    className="form-control small"
                    value={monster.name}
                    onChange={(e) => {
                    updateInput(e, "name");
                    }} /> 
            </div>
            <div className="inputField small">
                <label>Size</label>
                <select onChange={(e) => {
                    updateInput(e, "size");
                    }}>
                    <option selected disabled value={monster.size} hidden>{monster.size}</option>
                    <option value="Tiny">Tiny</option>
                    <option value="Small">Small</option>
                    <option value="Medium">Medium</option>
                    <option value="Large">Large</option>
                    <option value="Huge">Huge</option>
                    <option value="Garantaun">Gargantuan</option>
                </select>
            </div>
            <div className="inputField small">   
                <label>Type</label>
                <textarea 
                    className="form-control small"
                    value={monster.type}
                    onChange={(e) => {
                    updateInput(e, "type");
                    }} />
            </div>
            <div className="inputField medium">  
                <label>Alignment</label>
                <textarea 
                    className="form-control small"
                    value={monster.alignment}
                    onChange={(e) => {
                    updateInput(e, "alignment");
                    }} />
            </div>
        </div>
        <hr />
        <div className="inputGrouping">
            <div className="inputField xsmall">  
                <label>Armor Class</label>
                <input 
                    type="number"
                    value={monster.armor_class}
                    onChange={(e) => {
                    updateInput(e, "armor_class");
                    }} /> 
            </div>
                
            <div className="inputField xsmall"> 
                <label>Hit Points</label>
                <input 
                    type="number"
                    value={monster.hit_points}
                    onChange={(e) => {
                    updateInput(e, "hit_points");
                    }} />
            </div>

            <div className="inputField medium"> 
                <label>Hit Points (rolled)</label>
                <input 
                    type="text"
                    value={monster.hit_dice}
                    onChange={(e) => {
                    updateInput(e, "hit_dice");
                    }} />
            </div>
        </div>
        <hr />
        <div className="inputGrouping">
            <div className="inputField xsmall"> 
                <label>Strength</label>
                <input 
                    type="number"
                    value={monster.strength}
                    onChange={(e) => {
                    updateInput(e, "strength");
                    }} />
            </div>
            <div className="inputField xsmall"> 
                <label>Dexterity</label>
                <input 
                    type="number"
                    value={monster.dexterity}
                    onChange={(e) => {
                    updateInput(e, "dexterity");
                    }} /> 
            </div>
            <div className="inputField xsmall"> 
                <label>Constitution</label>
                <input 
                    type="number"
                    value={monster.constitution}
                    onChange={(e) => {
                    updateInput(e, "constitution");
                    }} /> 
            </div>
            <div className="inputField xsmall"> 
                <label>Inteligence</label>
                <input 
                    type="number"
                    value={monster.intelligence}
                    onChange={(e) => {
                    updateInput(e, "intelligence");
                    }} /> 
            </div>
            <div className="inputField xsmall"> 
                <label>Wisdom</label>
                <input 
                    type="number"
                    value={monster.wisdom}
                    onChange={(e) => {
                    updateInput(e, "wisdom");
                    }} />
            </div>
            <div className="inputField xsmall"> 
                <label>Charisma</label>
                <input 
                    type="number"
                    value={monster.charisma}
                    onChange={(e) => {
                    updateInput(e, "charisma");
                    }} /> 
            </div>
        </div>
        <hr />
        <div className="inputGrouping">
            <div className="inputField xsmall"> 
                <label>Str Save</label>
                <input 
                    type="number"
                    value={monster.strength_save}
                    onChange={(e) => {
                    updateInput(e, "strength_save");
                    }} />
            </div>
            <div className="inputField xsmall"> 
                <label>Dex Save</label>
                <input 
                    type="number"
                    value={monster.dexterity_save}
                    onChange={(e) => {
                    updateInput(e, "dexterity_save");
                    }} /> 
            </div>
            <div className="inputField xsmall"> 
                <label>Con Save</label>
                <input 
                    type="number"
                    value={monster.constitution_save}
                    onChange={(e) => {
                    updateInput(e, "constitution_save");
                    }} /> 
            </div>
            <div className="inputField xsmall"> 
                <label>Int Save</label>
                <input 
                    type="number"
                    value={monster.intelligence_save}
                    onChange={(e) => {
                    updateInput(e, "intelligence_save");
                    }} /> 
            </div>
            <div className="inputField xsmall"> 
                <label>Wis Save</label>
                <input 
                    type="number"
                    value={monster.wisdom_save}
                    onChange={(e) => {
                    updateInput(e, "wisdom_save");
                    }} />
            </div>
            <div className="inputField xsmall"> 
                <label>Cha Save</label>
                <input 
                    type="number"
                    value={monster.charisma_save}
                    onChange={(e) => {
                    updateInput(e, "charisma_save");
                    }} /> 
            </div>
        </div>
        <hr />
        <div className="inputGrouping">
            <div className="inputField xmedium">
                <label>Damage Vulnerabilities</label>
                <textarea 
                    className="form-control small"
                    value={monster.damage_vulnerabilities}
                    onChange={(e) => {
                    updateInput(e, "damage_vulnerabilities");
                    }} /> 
            </div>
            <div className="inputField xmedium">
                <label>Damage Resistances</label>
                <textarea 
                    className="form-control small"
                    value={monster.damage_resistances}
                    onChange={(e) => {
                    updateInput(e, "damage_resistances");
                    }} />
            </div>
            <div className="inputField xmedium">   
                <label>Damage Immunities</label>
                <textarea 
                    className="form-control small"
                    value={monster.damage_immunities}
                    onChange={(e) => {
                    updateInput(e, "damage_immunities");
                    }} />
            </div>
            <div className="inputField xmedium">  
                <label>Condition Immunities</label>
                <textarea 
                    className="form-control small"
                    value={monster.condition_immunities}
                    onChange={(e) => {
                    updateInput(e, "condition_immunities");
                    }} />
            </div>
        </div>
        <hr />
            
        <div className="inputGrouping"> 
            <div className="inputField large"> 
                <label>Senses</label>
                <textarea
                 className="form-control medium"
                    value={monster.senses}
                    onChange={(e) => {
                    updateInput(e, "senses");
                    }} />
            </div>               
            <div className="inputField large"> 
                <label>Languages</label>
                <textarea 
                    className="form-control small"
                    value={monster.languages}
                    onChange={(e) => {
                    updateInput(e, "languages");
                    }} />
            </div> 
            <div className="inputField medium"> 
                <label>Challenge Rating</label>
                <input 
                    type="number"
                    value={monster.challenge_rating}
                    onChange={(e) => {
                    updateInput(e, "challenge_rating");
                    }} />
            </div>
        </div>
        <hr />
    </form>


 {params.id !== 'new' && (
<div id="arrayInputs">
    <div id="speedInput">
    <form>
    <div className="inputGrouping"> 
            <div className="inputField large"> 
                <label>Speed Type</label>
                <textarea 
                    className="form-control small"
                    value={monster.speedInputName}
                    onChange={(e) => {
                    updateInput(e, "speedInputName");
                    }} />
            </div>               
            <div className="inputField large"> 
                <label>Movement (feet)</label>
                <input
                    type="number"
                    value={monster.speedInputDesc}
                    onChange={(e) => {
                    updateInput(e, "speedInputDesc");
                    }} />
            </div> 
            <div className="inputField xsmall"> 
                    {theUser && arrayID.speed === 0 && (<Button variant="success" className="profileEditOptions" onClick={(event) => submitArray(event, 'speed')}>Add</Button>)}
                    {theUser && arrayID.speed !== 0 && (<Button variant="success" className="profileEditOptions" onClick={(event) => submitArray(event, 'speed')}>Update</Button>)}
            </div>
            <div className="inputField xsmall"> 
                    {theUser && (<Button variant="danger" className="profileEditOptions" onClick={(event) => deleteArray(event, 'speed')}>Delete</Button>)}
            </div>  
    </div>
    <br />
     </form>
{monster.speed && (
    <div className="inputGrouping inputArray">
    <Table className="table" striped hover size="sm">
            <thead>
                <tr className="monsterListHead">
                    <th>ID</th>
                    <th>Speed Type</th>
                    <th>Movement (feet)</th>
                </tr>
            </thead>
     
            <tbody>
        {monster.speed.map((attribute) => (
                <tr key={attribute.id} onClick={() => upadateArray('speed',attribute.id, attribute.name, attribute.modifier)}>
                    <td>{attribute.id}</td>
                    <td>{attribute.name}</td>
                    <td>{attribute.modifier}</td>
                </tr>))
        } 
            </tbody>
        </Table>
    </div>
)}
    <hr />
    </div>

    <div id="skillInput">
    <form>
    <div className="inputGrouping"> 
            <div className="inputField large"> 
                <label>Skill Name</label>
                <textarea 
                    className="form-control small"
                    value={monster.skillsInputName}
                    onChange={(e) => {
                    updateInput(e, "skillsInputName");
                    }} />
            </div>               
            <div className="inputField large"> 
                <label>Skill Modifier</label>
                <input 
                    type="number"
                    value={monster.skillsInputDesc}
                    onChange={(e) => {
                    updateInput(e, "skillsInputDesc");
                    }} />
            </div> 
            <div className="inputField xsmall"> 
                    {theUser && arrayID.skills === 0 && <Button variant="success" className="profileEditOptions" onClick={(event) => submitArray(event, 'skills')}>Add</Button>}
                    {theUser && arrayID.skills !== 0 && <Button variant="success" className="profileEditOptions" onClick={(event) => submitArray(event, 'skills')}>Update</Button>}
            </div>
            <div className="inputField xsmall"> 
                    {theUser && <Button variant="danger" className="profileEditOptions" onClick={(event) => deleteArray(event, 'skills')}>Delete</Button>}
            </div>  
    </div>
    <br />
    </form>
    {monster.skills && (
    <div className="inputGrouping inputArray">
    <Table className="table" striped hover size="sm">
            <thead>
                <tr className="monsterListHead">
                    <th>ID</th>
                    <th>Skill Name</th>
                    <th>Skill Modifier</th>
                </tr>
            </thead>
     
            <tbody>
        {monster.skills.map((attribute) => (
                <tr key={attribute.id} onClick={() => upadateArray('skills',attribute.id, attribute.name, attribute.modifier)}>
                    <td>{attribute.id}</td>
                    <td>{attribute.name}</td>
                    <td>{attribute.modifier}</td>
                </tr>))
        } 
            </tbody>
        </Table>
    </div>
    )}
    <hr />
    </div>

    <div id="special_abilitiesInput">
    <form>
    <div className="inputGrouping"> 
            <div className="inputField large"> 
                <label>Special Ability</label>
                <textarea 
                    className="form-control small"
                    value={monster.special_abilitiesInputName}
                    onChange={(e) => {
                    updateInput(e, "special_abilitiesInputName");
                    }} />
            </div>               
            <div className="inputField large"> 
                <label>Special Ability Description</label>
                <textarea 
                    className="form-control large"
                    value={monster.special_abilitiesInputDesc}
                    onChange={(e) => {
                    updateInput(e, "special_abilitiesInputDesc");
                    }} />
            </div> 
            <div className="inputField xsmall"> 
                    {theUser && arrayID.special_abilities === 0 && <Button variant="success" className="profileEditOptions" onClick={(event) => submitArray(event, 'special_abilities')}>Add</Button>}
                    {theUser && arrayID.special_abilities !== 0 && <Button variant="success" className="profileEditOptions" onClick={(event) => submitArray(event, 'special_abilities')}>Update</Button>}
            </div>
            <div className="inputField xsmall"> 
                    {theUser && <Button variant="danger" className="profileEditOptions" onClick={(event) => deleteArray(event, 'special_abilities')}>Delete</Button>}
            </div>  
    </div>
    <br />
    </form>
    {monster.special_abilities && (
    <div className="inputGrouping inputArray">
    <Table className="table" striped hover size="sm">
            <thead>
                <tr className="monsterListHead">
                    <th>ID</th>
                    <th>Special Ability</th>
                    <th>Special Ability Description</th>
                </tr>
            </thead>
     
            <tbody>
        {monster.special_abilities.map((attribute) => (
                <tr key={attribute.id} onClick={() => upadateArray('special_abilities',attribute.id, attribute.name, attribute.desc)}>
                    <td>{attribute.id}</td>
                    <td className="medium">{attribute.name}</td>
                    <td>{attribute.desc}</td>
                </tr>))
        } 
            </tbody>
        </Table>
    </div>
    )}
    <hr />
    </div>
    
    <div id="legendary_actionsInput">
    <form>
    <div className="inputGrouping"> 
            <div className="inputField large"> 
                <label>Legendary Action</label>
                <textarea 
                    className="form-control small"
                    value={monster.legendary_actionsInputName}
                    onChange={(e) => {
                    updateInput(e, "legendary_actionsInputName");
                    }} />
            </div>               
            <div className="inputField large"> 
                <label>Legendary Action Description</label>
                <textarea 
                    className="form-control large"
                    value={monster.legendary_actionsInputDesc}
                    onChange={(e) => {
                    updateInput(e, "legendary_actionsInputDesc");
                    }} />
            </div> 
            <div className="inputField xsmall"> 
                    {theUser && arrayID.legendary_actions === 0 && <Button variant="success" className="profileEditOptions" onClick={(event) => submitArray(event, 'legendary_actions')}>Add</Button>}
                    {theUser && arrayID.legendary_actions !== 0 && <Button variant="success" className="profileEditOptions" onClick={(event) => submitArray(event, 'legendary_actions')}>Update</Button>}
            </div>
            <div className="inputField xsmall"> 
                    {theUser && <Button variant="danger" className="profileEditOptions" onClick={(event) => deleteArray(event, 'legendary_actions')}>Delete</Button>}
            </div>  
    </div>
    <br />
    </form>
    {monster.legendary_actions && (
    <div className="inputGrouping inputArray">
    <Table className="table" striped hover size="sm">
            <thead>
                <tr className="monsterListHead">
                    <th>ID</th>
                    <th>Legendary Action</th>
                    <th>Legendary Action Description</th>
                </tr>
            </thead>
     
            <tbody>
        {monster.legendary_actions.map((attribute) => (
                <tr key={attribute.id} onClick={() => upadateArray('legendary_actions',attribute.id, attribute.name, attribute.desc)}>
                    <td>{attribute.id}</td>
                    <td className="medium">{attribute.name}</td>
                    <td>{attribute.desc}</td>
                </tr>))
        } 
            </tbody>
        </Table>
    </div>
    )}
    <hr />
    </div>

    <div id="actionsInput">
    <form>
    <div className="inputGrouping"> 
            <div className="inputField large"> 
                <label>Action Name</label>
                <textarea 
                    className="form-control small"
                    value={monster.actionsInputName}
                    onChange={(e) => {
                    updateInput(e, "actionsInputName");
                    }} />
            </div>               
            <div className="inputField large"> 
                <label>Action Description</label>
                <textarea 
                    className="form-control large"
                    value={monster.actionsInputDesc}
                    onChange={(e) => {
                    updateInput(e, "actionsInputDesc");
                    }} />
            </div> 
            <div className="inputField xsmall"> 
                    {theUser && arrayID.actions === 0 && <Button variant="success" className="profileEditOptions" onClick={(event) => submitArray(event, 'actions')}>Add</Button>}
                    {theUser && arrayID.actions !== 0 && <Button variant="success" className="profileEditOptions" onClick={(event) => submitArray(event, 'actions')}>Update</Button>}
            </div>
            <div className="inputField xsmall"> 
                    {theUser && <Button variant="danger" className="profileEditOptions" onClick={(event) => deleteArray(event, 'actions')}>Delete</Button>}
            </div>  
    </div>
    <br />
    </form>
    {monster.actions && (
    <div className="inputGrouping inputArray">
    <Table className="table" striped hover size="sm">
            <thead>
                <tr className="monsterListHead">
                    <th>ID</th>
                    <th>Special Ability Name</th>
                    <th>Special Ability Description</th>
                </tr>
            </thead>
     
            <tbody>
        {monster.actions.map((attribute) => (
                <tr key={attribute.id} onClick={() => upadateArray('actions',attribute.id, attribute.name, attribute.desc)}>
                    <td>{attribute.id}</td>
                    <td className="medium">{attribute.name}</td>
                    <td>{attribute.desc}</td>
                </tr>))
        } 
            </tbody>
        </Table>
    </div>
    )}
    <hr />
    </div>

</div>
)} 

{theUser && newID && (
        <div>
            <Button variant="success" className="profileEditOptions" size="lg" onClick={submitBtn}>Save</Button>
        </div>
        )}
        
        {theUser && !newID && (
        <div>
            <Button variant="success" className="profileEditOptions" size="lg" onClick={submitBtn}>Save</Button>
            <Button variant="danger" className="profileEditOptions" onClick={() => setDeleteMode((x) => ({...x,active:true}))}>Delete</Button>
        </div>
        )}

</div> 




<div id="monsterSheet">
<link href="https://fonts.googleapis.com/css?family=Libre+Baskerville:700" rel="stylesheet" type="text/css" />
<link href="https://fonts.googleapis.com/css?family=Noto+Sans:400,700,400italic,700italic" rel="stylesheet" type="text/css" />

<div className="stat-block wide">
    <div className="section-left">
        <div className="creature-heading">
            <h1>{monster.name}</h1>
            <h2>{monster.size} {monster.type}, {monster.alignment}</h2>
        </div>  
        <svg height="5" width="100%" className="tapered-rule">
        <polyline points="0,0 400,2.5 0,5"></polyline>
    </svg>
        <div className="top-stats">
            <div className="property-line first">
                <h4>Armor Class </h4>
                <p>{monster.armor_class} {monster.armor_desc}</p>
            </div>  
            <div className="property-line">
                <h4>Hit Points </h4>
                <p>{monster.hit_points} ({monster.hit_dice})</p>
            </div>  
            <div className="property-line last">
                <h4>Speed </h4>
                {isNaN(params.id) &&(
                    monster.speed && (Object.entries(monster.speed).map((array)=>(
                        <p key={array[0]}>{array[0] === 'walk' ? '' : array[0]} {array[1]}ft.,  </p>
                )))
                )}

                {!isNaN(params.id) && monster.speed && ( 
                    monster.speed.map((array) => (
                    <p key={array.id}>{array.name === 'walk' ? '' : array.name} {array.modifier}ft., </p>
                    ))
                )}

            </div>  
            <svg height="5" width="100%" className="tapered-rule">
        <polyline points="0,0 400,2.5 0,5"></polyline>
    </svg>
            <div className="abilities">
                <div className="ability-strength">
                    <h4>STR</h4>
                    <p>{monster.strength} ({Math.floor((monster.strength-10)/2) >= 0 ? `+${Math.floor((monster.strength-10)/2)}` : Math.floor((monster.strength-10)/2)})</p>
                </div>  
                <div className="ability-dexterity">
                    <h4>DEX</h4>
                    <p>{monster.dexterity} ({Math.floor((monster.dexterity-10)/2) >= 0 ? `+${Math.floor((monster.dexterity-10)/2)}` : Math.floor((monster.dexterity-10)/2)})</p>
                </div>  
                <div className="ability-constitution">
                    <h4>CON</h4>
                    <p>{monster.constitution} ({Math.floor((monster.constitution-10)/2) >= 0 ? `+${Math.floor((monster.constitution-10)/2)}` : Math.floor((monster.constitution-10)/2)})</p>
                </div>  
                <div className="ability-intelligence">
                    <h4>INT</h4>
                    <p>{monster.intelligence} ({Math.floor((monster.intelligence-10)/2) >= 0 ? `+${Math.floor((monster.intelligence-10)/2)}` : Math.floor((monster.intelligence-10)/2)})</p>
                </div>  
                <div className="ability-wisdom">
                    <h4>WIS</h4>
                    <p>{monster.wisdom} ({Math.floor((monster.wisdom-10)/2) >= 0 ? `+${Math.floor((monster.wisdom-10)/2)}` : Math.floor((monster.wisdom-10)/2)})</p>
                </div>  
                <div className="ability-charisma">
                    <h4>CHA</h4>
                    <p>{monster.charisma} ({Math.floor((monster.charisma-10)/2) >= 0 ? `+${Math.floor((monster.charisma-10)/2)}` : Math.floor((monster.charisma-10)/2)})</p>
                </div>  
            </div> 
<svg height="5" width="100%" className="tapered-rule">
        <polyline points="0,0 400,2.5 0,5"></polyline>
    </svg>
                
            <h6 />
     
            {(monster.strength_save || monster.dexterity_save || monster.constitution_save ||
             monster.intelligence_save || monster.wisdom_save || monster.charisma_save) && (
            <div className="property-line">
                <h4>Saving Throws </h4>
                <p>
                {monster.strength_save ? `Str +${monster.strength_save}  ` : ''}
                {monster.dexterity_save ? `Dex +${monster.dexterity_save}  ` : ''}
                {monster.constitution_save ? `Con +${monster.constitution_save}  ` : ''}
                {monster.intelligence_save ? `Int +${monster.intelligence_save}  ` : ''}
                {monster.wisdom_save ? `Wis +${monster.wisdom_save}  ` : ''}
                {monster.charisma_save ? `Cha +${monster.charisma_save}  ` : ''}
                </p>
            </div> 
            )}

            {monster.skills !== 0 && monster.skills  && 
            <div className="property-line">
                <h4>Skills </h4>
            {isNaN(params.id) && (
                Object.entries(monster.skills).map((array)=>(
                        <p key={array[0]}>{array[0]} +{array[1]}  </p>
                ))
            )}

            {!isNaN(params.id) && monster.skills &&(
                monster.skills.map((array) => (
                <p key={array.id}>{array.name} +{array.modifier}  </p>
                ))
            )}
            </div> 
            }

            {monster.damage_vulnerabilities.length !== 0 && 
            <div className="property-line">
                <h4>Damange Vulnerabilities </h4>
                <p>{monster.damage_vulnerabilities}</p>
            </div> 
            }

            {monster.damage_immunities.length !== 0 && 
            <div className="property-line">
                <h4>Damage Immunities </h4>
                <p>{monster.damage_immunities}</p>
            </div> 
            }

            {monster.condition_immunities.length !== 0 && 
            <div className="property-line">
                <h4>Condition Immunities </h4>
                <p>{monster.condition_immunities}</p>
            </div> 
            }

            {monster.senses.length !== 0 && 
            <div className="property-line">
                <h4>Senses </h4>
                <p>{monster.senses}</p>
            </div> 
            } 

            <div className="property-line">
                <h4>Languages </h4>
                <p>{monster.languages}</p>
            </div> 
               
            <div className="property-line last">
                <h4>Challenge </h4>
                <p>{monster.challenge_rating}</p>
            </div>  
        </div>  
        <svg height="5" width="100%" className="tapered-rule">
        <polyline points="0,0 400,2.5 0,5"></polyline>
    </svg>
        
        {monster.special_abilities && monster.special_abilities && (
        <div>
        {monster.special_abilities.map((array) => (
            <div key={array.name+'specialTopDiv'} className="property-block">
            <h4 key={array.name+'specialTop'}>{array.name} {array.usage ? '(' + array.usage.times+'/Day)' : ''}. </h4>
            <p key={array.name+'special'}>{array.desc} </p>
            </div> 
        ))}
        </div> 
        )}

        {monster.legendary_actions && monster.legendary_actions && monster.legendary_actions.length !== 0 &&
        <div className="actions">
            <h3>Legendary Actions</h3> 
            <h6 />
            {monster.legendary_desc}
            {monster.legendary_actions.map((array) => (
            <div key={array.name+'specialTopDiv'} className="property-block">
            <h4 key={array.name+'specialTop'}>{array.name}. </h4>
            <p key={array.name+'special'}>{array.desc} </p>
            </div> 
            )) } 
        </div>
    }

    </div>  
    <div className="section-right">
        <div className="actions">
            <h3>Actions</h3>
            {monster.actions && monster.actions && (
            <div>
            {monster.actions.map((array) => (
            <div key={array.name+'specialTopDiv'} className="property-block">
            <h4 key={array.name+'specialTop'}>{array.name}. </h4>
            <p key={array.name+'special'}>{array.desc} </p>
            </div> 
            )) }
            </div>)}
        </div>

    <div>  
    <hr className="orange-border bottom" />
    <br />
    </div>
    </div>  
</div>
</div>
</div>
</div>
    )}}