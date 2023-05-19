import React, { Component } from 'react';
import { Collapse, Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink } from 'reactstrap';
import { Link } from 'react-router-dom';
import './NavMenu.css';

export class NavMenu extends Component {
  static displayName = NavMenu.name;

  constructor(props) {
    super(props);

    this.toggleNavbar = this.toggleNavbar.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
    this.state = {
      collapsed: true,
      isLoggedIn: localStorage.getItem('username') !== null,
      userRole: 'Applicant'
    };
  }

  toggleNavbar() {
    this.setState({
      collapsed: !this.state.collapsed
    });
  }

  handleLogout() {
    localStorage.clear();
    window.location.href = '/login';
  }



  render() {
    const { isLoggedIn, userRole } = this.state;

    if (isLoggedIn) {
      return (

        <header>
          <Navbar className="ppm360-navbar navbar-expand-sm navbar-toggleable-sm ng-white border-bottom box-shadow mb-3" fixed='top' light>

            <NavbarBrand className="d-flex align-items-center ms-3" tag={Link} to="/">
              <img style={{ height: '18px' }} alt="PPM360" src={require('../images/ppm360_logo_dark.png')} />
            </NavbarBrand>

            <NavbarToggler onClick={this.toggleNavbar} className="mr-2" />
            <Collapse className="d-sm-inline-flex flex-sm-row-reverse" isOpen={!this.state.collapsed} navbar>
              <ul className="navbar-nav flex-grow">
                {userRole === 'Management' && (
                  <NavItem>
                    <NavLink tag={Link} className="text-dark" to="/">Dashboard</NavLink>
                  </NavItem>
                )}
                {userRole === 'Applicant' && (
                  <>
                    <NavItem>
                      <NavLink tag={Link} className="text-dark" to="/projects">Projektanträge</NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink tag={Link} className="text-dark" to="/requests">Requests</NavLink>
                    </NavItem>
                  </>

                )}
                {userRole === 'Approver' && (
                  <>
                    <NavItem>
                      <NavLink tag={Link} className="text-dark" to="/review">Review</NavLink>
                    </NavItem>
                  </>

                )}


                <NavItem className='navbar-user'>
                  Logged in as&nbsp;<b>{localStorage.getItem("username")}</b>
                </NavItem>
                <NavItem>
                  <NavLink tag={Link} className="text-dark" to="/login" onClick={this.handleLogout}>Logout</NavLink>
                </NavItem>
              </ul>
            </Collapse>
          </Navbar>
        </header>
      );
    }

    return (
      <header>
        <Navbar className="ppm360-navbar navbar-expand-sm navbar-toggleable-sm ng-white border-bottom box-shadow mb-3" fixed='top' light>

          <NavbarBrand className="d-flex align-items-center ms-3" tag={Link} to="/">
            <img style={{ height: '18px' }} alt="PPM360" src={require('../images/ppm360_logo_dark.png')} />
          </NavbarBrand>

          <NavbarToggler onClick={this.toggleNavbar} className="mr-2" />
          <Collapse className="d-sm-inline-flex flex-sm-row-reverse" isOpen={!this.state.collapsed} navbar>
            <ul className="navbar-nav flex-grow">
              {/** <NavItem>
                <NavLink tag={Link} className="text-dark" to="/">Dashboard</NavLink>
              </NavItem>*/}
            </ul>
          </Collapse>
        </Navbar>
      </header>

    );


  }
}
