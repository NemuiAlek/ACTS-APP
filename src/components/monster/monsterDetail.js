import { useEffect, useState, useContext } from "react";
import {Link, useNavigate, useParams} from "react-router-dom";
import axios from "axios"
import UserContext from "../../contexts/UserContext"


export default function MonsterStandard(){

    const { theUser, getUserInfo } = useContext(UserContext);  
    const navigate = useNavigate();
    const params = useParams()
/*
======================== STATES ======================
*/

const [monster, setMonster] = useState({
    actions: [],
    alignment: "",
    armor_class: 0,
    armor_desc: "",
    challenge_rating: "7",
    charisma: 0,
    charisma_save: null,
    condition_immunities: "",
    constitution: 0,
    constitution_save: null,
    damage_immunities: "",
    damage_resistances: "",
    damage_vulnerabilities: "",
    dexterity: 0,
    dexterity_save: null,
    document__license_url: "",
    document__slug: "",
    document__title: "",
    group: null,
    hit_dice: "",
    hit_points: 0,
    img_main: null,
    intelligence: 0,
    intelligence_save: null,
    languages: "",
    legendary_actions: "",
    legendary_desc: "",
    name: "N/A",
    perception: 0,
    reactions: "",
    senses: "",
    size: "",
    skills: [],
    slug: "",
    special_abilities:[],
    speed:[],
    spell_list: [],
    strength: 0,
    strength_save: null,
    subtype: "",
    type: "",
    wisdom: 0,
    wisdom_save: null,
    })
const [loading, setLoading] = useState(false)

/*
======================== FUNCTIONS ======================
*/

const getMonsterStandard = () =>{
    axios
    .get("https://api.open5e.com/monsters/" + params.id, {
    })
    .then((response) => {
        setMonster(() => response.data);
        setLoading(false);
        console.log(response.data);
    })
    .catch((err) => {
        console.log(err);
    });
}

const getMonsterCustom = () =>{
    axios
    .get("http://localhost:4000/monster/" + params.id, {
    })
    .then((response) => {
        setMonster(response.data);
        console.log(response.data)
    })
    .catch((err) => {
        console.log(err);
    });
}

const backBtn = (event) =>{
    event.preventDefault();
    isNaN(params.id) ? navigate('/monster/standard') : navigate('/monster/custom');
} 

const updateBtn = (event) =>{
    event.preventDefault();
    navigate('/Monster/create-modify/'+params.id)
}

/*
======================== USE EFFECTS ======================
*/

useEffect(() => {
    isNaN(params.id) ? getMonsterStandard() : getMonsterCustom();
}, [])


/*
======================== HTML(JSX) ======================
*/
    if(loading){
        return(<div>Loading...</div>)
    }
    
return (
<div id="monsterPage">

        <div id="monsterOptions">
            <button id="backBtn" onClick={backBtn}>Back to Monster Dictionary</button>
            {theUser !== undefined && !isNaN(params.id) &&  theUser.id === monster.CreatedBy && (
                <button id="updateBtn" onClick={updateBtn}>Update</button>
            )}
        </div>
        
    
    <link href="https://fonts.googleapis.com/css?family=Libre+Baskerville:700" rel="stylesheet" type="text/css" />
        <link href="https://fonts.googleapis.com/css?family=Noto+Sans:400,700,400italic,700italic" rel="stylesheet" type="text/css" />

        <div className="stat-block wide">
            <hr className="orange-border" />
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
                            monster.speed !== undefined && (Object.entries(monster.speed).map((array)=>(
                                <p key={array[0]}>{array[0] === 'walk' ? '' : array[0]} {array[1]}ft.,  </p>
                        )))
                        )}

                        {!isNaN(params.id) && monster.speed !== null && ( 
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
             
                    {(monster.strength_save !== null || monster.dexterity_save !== null || monster.constitution_save !== null ||
                     monster.intelligence_save !== null || monster.wisdom_save !== null || monster.charisma_save !== null) && (
                    <div className="property-line">
                        <h4>Saving Throws </h4>
                        <p>
                        {monster.strength_save !== null ? `Str +${monster.strength_save}  ` : ''}
                        {monster.dexterity_save !== null ? `Dex +${monster.dexterity_save}  ` : ''}
                        {monster.constitution_save !== null ? `Con +${monster.constitution_save}  ` : ''}
                        {monster.intelligence_save !== null ? `Int +${monster.intelligence_save}  ` : ''}
                        {monster.wisdom_save !== null ? `Wis +${monster.wisdom_save}  ` : ''}
                        {monster.charisma_save !== null ? `Cha +${monster.charisma_save}  ` : ''}
                        </p>
                    </div> 
                    )}

                    {monster.skills !== 0 && monster.skills !== undefined  && 
                    <div className="property-line">
                        <h4>Skills </h4>
                    {isNaN(params.id) && (
                        Object.entries(monster.skills).map((array)=>(
                                <p key={array[0]}>{array[0]} +{array[1]}  </p>
                        ))
                    )}

                    {!isNaN(params.id) && monster.skills !== null &&(
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
                
                {monster.special_abilities !== undefined && monster.special_abilities !== null && (
                <div>
                {monster.special_abilities.map((array) => (
                    <div key={array.name+'specialTopDiv'} className="property-block">
                    <h4 key={array.name+'specialTop'}>{array.name} {array.usage !== undefined ? '(' + array.usage.times+'/Day)' : ''}. </h4>
                    <p key={array.name+'special'}>{array.desc} </p>
                    </div> 
                ))}
                </div> 
                )}

                {monster.legendary_actions !== undefined && monster.legendary_actions !== null && monster.legendary_actions.length !== 0 &&
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
                    {monster.actions !== undefined && monster.actions !== null && (
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
)}