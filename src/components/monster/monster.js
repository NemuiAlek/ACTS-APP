import { useEffect, useState, useContext } from "react";
import {Link, useNavigate, useParams} from "react-router-dom";
import axios from "axios"
import Table from 'react-bootstrap/Table';

export default function MonsterStandard(){

    const navigate = useNavigate();
    const params = useParams();
/*
======================== STATES ======================
*/
const [board, setBoard] = useState('standard')
const [monsters, setMonsters] = useState([])
const [search, setSearch] = useState('')
const [showAmt, setAmount] = useState('50')

/*
======================== FUNCTIONS ======================
*/

const getMonstersStandard = () =>{
    console.log(showAmt)
    axios
    .get("https://api.open5e.com/monsters/?limit="+showAmt+'&search='+search, {
    })
    .then((response) => {
        setMonsters(response.data.results);
    })
    .catch((err) => {
        console.log(err);
    });
}

const getMonstersCustom = () =>{
    axios
    .get("http://localhost:4000/monster/", {
    })
    .then((response) => {
        setMonsters(response.data);
        console.log(response.data);
    })
    .catch((err) => {
        console.log(err);
    });
}

const updateInput = (e) => {
    setSearch(e.target.value);
};

const searchMonsters = (event) => {
    event.key === 'Enter' ? getMonstersStandard() : console.log()
}

const updateShowAmt = (e) =>{
    e.target.value === 'All' ? setAmount(10000) : setAmount(e.target.value);
}

/*
======================== USE EFFECTS ======================
*/

useEffect(()=>{
    setBoard( () => params.id);
},[params.id])

useEffect(() => {
    params.id === 'standard' ? getMonstersStandard() :
    params.id === 'custom' ? getMonstersCustom() :
    getMonstersStandard()
    
}, [showAmt, board])

const getDetails = (id) => {
    navigate('/monster/detail/'+id)
}

/*
======================== HTML(JSX) ======================
*/
return (
    <div className="monsterPage">
        <div className="monsterListContainer">
        <h1>{params.id === 'custom' ? `Custom Monsters` : `Standard Monsters`}</h1>

        <div className="listFilters">
            <input
                type="text"
                placeholder="Search..."
                value={search}
                onKeyDown={searchMonsters}
		        onChange={(e) => {
		        updateInput(e);
		        }} />
        
        <label>Monsters per Page</label>
        {params.id === 'standard' && (
            <select onChange={updateShowAmt}>
            <option>50</option>
            <option>100</option>
            <option>200</option>
            <option>500</option>
            <option>1000</option>
            <option>All</option>
        </select>
        )}

        {params.id === 'custom' && (
            <select disabled>
            <option>All</option>
        </select>
        )}


        </div>

        <Table striped hover size="sm" className="monsterList">
            <thead>
                <tr className="monsterListHead">
                    <th>Name</th>
                    <th>Challenge Rating</th>
                    <th>Hit Points</th>
                    <th>Armor Class</th>
                    <th>Type</th>
                    <th>Size</th>
                    <th>Alignment</th>
                    <th>Legendary</th>
                </tr>
            </thead>
     
            <tbody>
        {monsters.map((eachMonster) => (
                <tr className="monsterContainer" key={eachMonster.slug === undefined ? eachMonster.id : eachMonster.slug} onClick={() => getDetails(eachMonster.slug === undefined ? eachMonster.id : eachMonster.slug)}>
                    <td>{eachMonster.name}</td>
                    <td>{eachMonster.challenge_rating}</td>
                    <td>{eachMonster.hit_points}</td>
                    <td>{eachMonster.armor_class}</td>
                    <td>{eachMonster.type}</td>
                    <td>{eachMonster.size}</td>
                    <td>{eachMonster.alignment}</td>
                    <td>{eachMonster.legendary_desc !== "" ? 'Legendary' : ''}</td>

                </tr>))
        } 
            </tbody>
        </Table>
    </div>
    </div>
    )
}