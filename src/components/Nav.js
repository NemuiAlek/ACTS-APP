import {useContext } from "react";
import {Link} from "react-router-dom";
import UserContext from "../contexts/UserContext";

import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';


export default function Navz(){
    const { theUser, logout } = useContext(UserContext);

    // if(location.pathname === '/'){
    //     return null
    // }

    return (
        <Navbar variant="dark" bg="dark" expand="sm">
          <Container fluid>
            <Navbar.Brand href="/">Home</Navbar.Brand>
            <Navbar.Toggle aria-controls="navbar" />
            <Navbar.Collapse id="navbar">
              <Nav className='m-auto'>

                <NavDropdown
                  id="monsterDropdown"
                  title="Monster"
                  menuVariant="dark"
                  className="navItem"
                >
                  <NavDropdown.Item as={Link} to={"/monster/standard"}>Standard</NavDropdown.Item>
                  <NavDropdown.Item as={Link} to={"/monster/custom"}>Custom</NavDropdown.Item>

                  {theUser.userName && (
                    <div>
                    <NavDropdown.Divider />
                    <NavDropdown.Item as={Link} to={"/monster/create-modify/new"}>Create</NavDropdown.Item>
                  </div>
                  )}

                  {!theUser.userName && (
                    <div>
                    <NavDropdown.Divider />
                    <NavDropdown.Item as={Link} to={"/login"}>Create</NavDropdown.Item>
                  </div>
                  )}

                </NavDropdown>

                <Nav.Item className="navItem">
                      <Nav.Link as={Link} to={"/combat"}>Combat</Nav.Link>
                </Nav.Item>

                {!theUser.userName &&(
                  <div>
                    <Nav.Item className="navItem">
                      <Nav.Link as={Link} to={"/login"}>Log In</Nav.Link>
                    </Nav.Item>
                </div>
                )}

                {!theUser.userName && (
                  <div>
                    <Nav.Item className="navItem">
                      <Nav.Link as={Link} to={"/signup"}>Sign Up</Nav.Link>
                    </Nav.Item>
                  </div>
                )}

                {theUser.userName &&(
                <NavDropdown
                  id="combatDropdown"
                  title={theUser.userName}
                  menuVariant="dark"
                  className="navItem"
                >
                  <NavDropdown.Item as={Link} to={"/profile/"+theUser.id}>Profile</NavDropdown.Item>
                  <NavDropdown.Item onClick={logout}>Log Out</NavDropdown.Item>

                </NavDropdown>
                )}

                <Nav.Link as={Link} to={"/about"}>About</Nav.Link>

              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      );

    }