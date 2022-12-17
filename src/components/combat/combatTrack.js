import { useEffect, useState, useContext } from "react";
import {Link, useNavigate, useParams} from "react-router-dom";
import Button from 'react-bootstrap/Button';
import UserContext from "../../contexts/UserContext"
import axios from "axios"
import Select from 'react-select'
import React from 'react'


export default function CombatTracker(){

const { theUser, getUserInfo } = useContext(UserContext);  
const navigate = useNavigate();
const params = useParams();
const myRef = React.useRef(null)

/*
======================== STATES ======================
*/

const [combatDetail,setCombatDetail] = useState({
    monsterid:'',
    maximumHP:0,
    currentHP:0,
    monsterName:'',
    monsterSize:'',
    monsterType:'',
    monsterAlignment:'',
    monsterAC:'',
    monsterArmor:'',
    initiative:1,
    sort:0,
    activeCreature:0,
    multiplier:1,
})

const [monster, setMonster] = useState({
    actions: [],
    alignment: "",
    armor_class: 0,
    armor_desc: "",
    challenge_rating: "",
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

    const[combatMonsters, setCombatMonsters] = useState([{
        id:0,
        combatID:0,
        monsterID:'',
        maxHP:0,
        currentHP:0,
        monsterName:'',
        monsterSize:'',
        monsterType:'',
        monsterAlignment:'',
        monsterAC:0,
        monsterArmor:'',
        initiative:0,
        sort:0,
        activeCreature:0,
        healthMod:0
    }])

    const [loading, setLoading] = useState(false)
    const [monsters, setMonsters] = useState([])
    const [options, setOptions] = useState([{}])
    const [dictionary, setDictionary] = useState('')
    const [healthMods, setHealthMod] = useState('')
    const [deleteMode, setDeleteMode] = useState(false)
/*
======================== FUNCTIONS ======================
*/

const getMonstersStandard = () =>{
    if (dictionary !== 'standard') return
    axios
    .get("https://api.open5e.com/monsters/?limit=10", {
    })
    .then((response) => {
        setMonsters(response.data.results);
        setLoading(false);
    })
    .catch((err) => {
        console.log(err);
    });
}

const getMonstersCustom = () =>{
    if (dictionary !== 'custom') return
    axios
    .get("http://localhost:4000/monster/", {
    })
    .then((response) => {
        setMonsters(response.data);
        setLoading(false);
    })
    .catch((err) => {
        console.log(err);
    });
}

const addMonster = (event,action) => {

    if(combatDetail.multiplier === 0){
        alert(`Congrats, you created nothing. Good for you.
                Can we please leave the damn multipliar at 1 at least?`)
        return;
    }
    if(combatDetail.initiative > 50){
        alert(`Cmon, be honest, no way you got over a 50 initiative.`)
        return;
    }
    if(combatDetail.initiative === 0){
        alert('Alright processing... wait, is that a zero initiative?')
        alert(`uhhh... I mean... technically that's ok...`)
        alert(`but for real, like how? what monster can even roll that badly?`)
        alert(`Also, burn those dice! Them dice cursed for sure!`)
        alert(`Well, I guess we all have had our fair share of embarassing moments...`)
        alert(`Maybe it's not fair to throw away the dice just because of one bad roll you know?`)
        alert(`Yea! It was probably even a good laugh for you as a DM when they or you rolled it too`)
        alert(`Ahh... fun times... I havent slept in 24 hours developing this web app...`)
        alert(`But you know, it'll all be worth it once it's done! I'm so clooose`)
        alert(`OH RIGHT! Sorry about that, let me create that... uhh.. "zero initiative" creature for you.`)
        alert(`oh! and thank you for using my website! it means a lot! Hope your session goes great!`)
    }
    if(combatDetail.multiplier > 20){
        alert(`Multiplier can only be between 1-20. Plz... my poor server...`)
        setCombatDetail((x) => ({...x,multiplier:10}))
        return;
    }
    if(combatDetail.maximumHP && combatDetail.initiative && combatDetail.multiplier === ''  && combatDetail.monsterid){
        alert('Please fill in all fields before clicking "save"')
        return;
    }


    event.preventDefault();

    // fix this later plz

    axios
    .post("http://localhost:4000/combat/detail/add/"+params.id,
    {
        action:action,
        monsterID:combatDetail.monsterid,
        maxHP:combatDetail.maximumHP,
        currentHP:combatDetail.currentHP,
        monsterName:monster.name,
        monsterSize:monster.size,
        monsterType:monster.type,
        monsterAlignment:monster.alignment,
        monsterAC:monster.armor_class,
        monsterArmor:monster.armor_desc,
        multiplier:combatDetail.multiplier,
        initiative:combatDetail.initiative,
        activeCreature:combatDetail.activeCreature,
        sort:combatDetail.sort

    })
    .then((response) => {
        setCombatDetail((x)=>({...x,maximumHP:0,
                                    initiative:1,
                                    multiplier:1}))
        getCombatData();
        
    })
    .catch((err) => {
        console.log(err);
    });
    //*/    
}

const getMonDetStan = () =>{
    axios
    .get("https://api.open5e.com/monsters/"+combatDetail.monsterid, {
    })
    .then((response) => {
        setMonster(() => response.data);
    })
    .catch((err) => {
        console.log(err);
    });
}

const getMonDetCus = () =>{
    axios
    .get("http://localhost:4000/monster/"+combatDetail.monsterid, {
    })
    .then((response) => {
        setMonster(response.data);
    })
    .catch((err) => {
        console.log(err);
    });
}

const getCombatData = () =>{
    axios
    .get("http://localhost:4000/combat/detail/" + params.id, {
    })
    .then((response) => {
        setCombatMonsters(() => response.data)
    })
    .catch((err) => {
        console.log(err);
    });
}

const healthChanges = (event,id,healthMod,action) =>{

    event.preventDefault()
    
    axios
    .post("http://localhost:4000/combat/detail/health", {
            id: id,
            modifier: healthMod,
            action: action
    })
    .then((response) => {
        getCombatData();
        setHealthMod((x)=>({...x,[id]:''}))
    })
    .catch((err) => {
        console.log(err);
    });
    
}

const deleteDetail = (event,id) =>{

    event.preventDefault()
    
    axios
    .post("http://localhost:4000/combat/detail/delete/"+id, {
    })
    .then((response) => {
        getCombatData();
    })
    .catch((err) => {
        console.log(err);
    });
    
}

const deleteCombat = (event,id) =>{

    event.preventDefault()
    
    axios
    .post("http://localhost:4000/combat/delete/"+id, {
        user:theUser.id
    })
    .then((response) => {
        navigate('/combat');
        window.location.reload();
    })
    .catch((err) => {
        console.log(err);
    });
    
}

const heathModLogger = (e, thingToUpdate) => {
    setHealthMod({ ...healthMods, [thingToUpdate]: e.target.value });
    console.log(healthMods[thingToUpdate])
};


const updateCombatDetail = (e, thingToUpdate) => {
    setCombatDetail({ ...combatDetail, [thingToUpdate]: e.target.value });
};

const updateDictionary = (e) => {
    setDictionary(e.target.value );
};

const updateOptions = () => {
    setOptions([{}])

    if (dictionary === 'standard'){
        monsters.map((eachMonster) =>(
            setOptions(x => [...x, {value:eachMonster.slug, label:eachMonster.name}])))
    } else if (dictionary === 'custom'){
        monsters.map((eachMonster) =>(
            setOptions(x => [...x, {value:eachMonster.id, label:eachMonster.name}])
        ))
    }
    
}

const setMonsterID = (id) => {
    setCombatDetail((x) => ({...x,monsterid:id}))
}

const executeScroll = () => myRef.current.scrollIntoView()  

const setMonsterIDScroll = (event, id) => {
    let origin = event.srcElement || event.target;
if (origin.tagName && !origin.tagName.match(/button/i)){
    setCombatDetail((x) => ({...x,monsterid:id}))
    executeScroll();
} else {return true;}
}

/*
======================== USE EFFECTS ======================
*/

useEffect(() => {
    dictionary.toLocaleLowerCase() === 'standard' ? getMonstersStandard() :
    getMonstersCustom()
}, [dictionary])

useEffect(() => {
    updateOptions()
},[monsters])

useEffect(()=>{
    isNaN(combatDetail.monsterid) ? getMonDetStan() : getMonDetCus()
},[combatDetail.monsterid])

useEffect(()=>{
    setCombatDetail((x) => ({...x,maximumHP:monster.hit_points}))
},[monster.hit_points])

useEffect(() => {
    getCombatData()
},[])
/*
======================== HTML(JSX) ======================
*/

return (
<div id="createDetail">
    
    <div id="combatInfo">
        <div id="combatStats">
            <label>Current Round</label>
            {!deleteMode && <Button variant="danger" className="profileEditOptions" size="sm" onClick={() => setDeleteMode(true)} >Delete</Button>}
            {deleteMode && <Button variant="danger" className="profileEditOptions" size="sm" onClick={(event) => deleteCombat(event, params.id)} >Confirm Delete (THIS ACTION IS PERMANENT)</Button>}
        </div>
              <h1>Add Monsters</h1>
             {loading && (<h4>Loading...</h4>)}
        <div className="inputGrouping">
            <div className="inputField small">
                <label>Dictionary</label>
                <select onChange={(e) => {
                    updateDictionary(e);
                    }}>
                    <option selected disabled>Dictionary</option>
                    <option value="standard">Standard</option>
                    <option value="custom">Custom</option>
                    <option value="player">Player</option>
                </select>
            </div>

            <div className="inputField xmedium">
            <label>Select Monster</label>
                <Select
                    className="searchFilter"
                    defaultValue={''}
                    onChange={(part_id) => setMonsterID(part_id.value)}
                    options={options}
                />
            </div>

            <div className="inputField xsmall"> 
                <label>Max Hit Points</label>
                <input 
                    type="number"
                    value={combatDetail.maximumHP}
                    onChange={(e) => {
                    updateCombatDetail(e, "maximumHP");
                    }} />
            </div>

            <div className="inputField xsmall"> 
                <label>Initiative</label>
                <input 
                    type="number"
                    value={combatDetail.initiative}
                    onChange={(e) => {
                    updateCombatDetail(e, "initiative");
                    }} />
            </div>

            <div className="inputField xsmall"> 
                <label>Multiply</label>
                <input 
                    type="number"
                    value={combatDetail.multiplier}
                    onChange={(e) => {
                    updateCombatDetail(e, "multiplier");
                    }} />
            </div>
            <Button variant="success" className="profileEditOptions" size="lg" onClick={(event) => addMonster(event,'new')}>Add</Button>
        </div>
        <hr />

        <div ref={myRef} id="monsterSheet">
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
                {Array.isArray(monster.speed) && isNaN(combatDetail.monsterid) && dictionary === 'standard' &&(
                    monster.speed && (Object.entries(monster.speed).map((array)=>(
                        <p key={array[0]}>{array[0] === 'walk' ? '' : array[0]} {array[1]}ft.,  </p>
                )))
                )}

                {!isNaN(combatDetail.monsterid) && dictionary === 'custom' && Array.isArray(monster.speed) && ( 
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

            {monster.skills && monster.skills  && 
            <div className="property-line">
                <h4>Skills </h4>
            {isNaN(combatDetail.monsterid) && Array.isArray(monster.skills) && (
                Object.entries(monster.skills).map((array)=>(
                        <p key={array[0]}>{array[0]} +{array[1]}  </p>
                ))
            )}

            {!isNaN(combatDetail.monsterid) && Array.isArray(monster.skills) &&(
                monster.skills.map((array) => (
                <p key={array.id}>{array.name} +{array.modifier}  </p>
                ))
            )}
            </div> 
            }

            {monster.damage_vulnerabilities && 
            <div className="property-line">
                <h4>Damange Vulnerabilities </h4>
                <p>{monster.damage_vulnerabilities}</p>
            </div> 
            }

            {monster.damage_immunities && 
            <div className="property-line">
                <h4>Damage Immunities </h4>
                <p>{monster.damage_immunities}</p>
            </div> 
            }

            {monster.condition_immunities && 
            <div className="property-line">
                <h4>Condition Immunities </h4>
                <p>{monster.condition_immunities}</p>
            </div> 
            }

            {monster.senses  && 
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
            {monster.actions && (
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
<hr />
        <div className="monsterCard">
                {combatMonsters && combatMonsters.map((eachMonster)=>(
                    <div className="stat-block wide" onClick={(event) => setMonsterIDScroll(event, eachMonster.monsterID)}>
                    <p className="rowNum">{eachMonster.rowNum}</p>
                    <div className="section-left">
                        <div className="creature-heading">
                            <h1>{eachMonster.monsterName}</h1>
                            <h2>{eachMonster.monsterSize} {eachMonster.monsterType}, {eachMonster.monsterAlignment}</h2>
                        </div>  
                        <svg height="5" width="100%" className="tapered-rule">
                        <polyline points="0,0 400,2.5 0,5"></polyline>
                    </svg>
                        <div className="top-stats">
                            <div className="property-line first">
                                <h4>Armor Class </h4>
                                <p>{eachMonster.monsterAC} {eachMonster.monsterArmor}</p>
                            </div>  
                            <div className="property-line">
                                <h4>Hit Points </h4>
                                <p>{eachMonster.currentHP}</p>
                            </div>
                        </div>
                        <Button variant="success" className="profileEditOptions" size="sm" onClick={(event) => healthChanges(event, eachMonster.id,healthMods[eachMonster.id],'Heal')}>Heal</Button>
                        <input className="small" 
                                type="number"
                                onClick={'remove(this)'}
                                value={healthMods[eachMonster.id]}
                                onChange={(e) => {
                                heathModLogger(e, `${eachMonster.id}`);
                                }} />
                        <Button variant="danger" className="profileEditOptions" size="sm"onClick={(event) => healthChanges(event, eachMonster.id,healthMods[eachMonster.id],'Damage')}>Dmg</Button>
                    </div>
                        <Button variant="danger" className="profileEditOptions" size="sm" onClick={(event => deleteDetail(event, eachMonster.id))} >Delete</Button>
                    </div> 
                ))}
        </div>
</div>


    )
    }