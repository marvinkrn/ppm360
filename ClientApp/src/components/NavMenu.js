import React, { Component } from 'react';
import { Collapse, Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink } from 'reactstrap';
import { Link } from 'react-router-dom';
import './NavMenu.css';
import InitialsAvatar from './misc/InitialsAvatar';
import jwt_decode from 'jwt-decode';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFile, faFileCircleCheck, faGauge, faGaugeHigh, faRotateRight } from '@fortawesome/free-solid-svg-icons';

export class NavMenu extends Component {
  static displayName = NavMenu.name;

  constructor(props) {
    super(props);

    this.toggleNavbar = this.toggleNavbar.bind(this);
    this.handleOutsideClick = this.handleOutsideClick.bind(this);

    const token = localStorage.getItem('token');
    let userRole = '';

    if (token) {
      const decoded = jwt_decode(token);
      userRole = decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
    }

    this.state = {
      collapsed: true,
      isLoggedIn: localStorage.getItem('username') !== null,
      userRole: userRole
    };
  }
  componentDidMount() {
    document.addEventListener('click', this.handleOutsideClick);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.handleOutsideClick);
  }

  toggleNavbar() {
    this.setState(prevState => ({
      collapsed: !prevState.collapsed
    }));
  }

  handleOutsideClick(event) {
    const navbar = document.querySelector('.ppm360-navbar');
    const isNavbarClicked = navbar && navbar.contains(event.target);

    if (!isNavbarClicked && !this.state.collapsed) {
      this.setState({ collapsed: true });
    }
  }

  render() {
    const { isLoggedIn, userRole } = this.state;
    const isNavbarCollapsed = this.state.collapsed;

    if (isLoggedIn) {
      return (

        <header>
          <Navbar className="ppm360-navbar navbar-collapse-sm navbar-toggleable-sm ng-white border-bottom box-shadow mb-3" fixed='top' light>
            <div className='ppm360-navbar-brand-wrapper'>
              <NavbarToggler onClick={this.toggleNavbar} />

              <NavbarBrand className="d-flex align-items-center ms-3" tag={Link} to="/">
                <picture>
                  {/**<source
    srcset={require('../images/ppm360_logo_light.png')}
    media="(prefers-color-scheme: dark)"
/>**/}
                  <img style={{ height: '18px', display: 'flex', alignContent: 'center' }}
                    src={require('../images/ppm360_logo_dark.png')}
                    alt="PPM360"
                  />
                </picture>
              </NavbarBrand>
            </div>



            <Collapse isOpen={!this.state.collapsed} className='' navbar>
              <ul className="navbar-nav flex-grow">

                {userRole === 'Applicant' | userRole === 'Approver' | userRole === 'Management' && (
                  <>
                    <NavItem>

                      <NavLink tag={Link} className="navbar-item" to="/projects"><FontAwesomeIcon className='navbar-item-icon' icon={faFile} />Meine Projektanträge</NavLink>
                    </NavItem>
                  </>

                )}

                {userRole === 'Approver' && (
                  <>
                    <NavItem>
                      <NavLink tag={Link} className="navbar-item" to="/approve"><FontAwesomeIcon className='navbar-item-icon' icon={faFileCircleCheck} />Projektanträge genehmigen</NavLink>
                    </NavItem>
                  </>

                )}

                {userRole === 'Management' && (
                  <NavItem>
                    <NavLink tag={Link} className="navbar-item" to="/dashboard"><FontAwesomeIcon className='navbar-item-icon' icon={faGaugeHigh} />Management Dashboard</NavLink>
                  </NavItem>
                )}

              </ul>
            </Collapse>
            <InitialsAvatar name={localStorage.getItem("username")} />
          </Navbar>

        </header>
      );
    }

    return (
      <header>
        <Navbar className="ppm360-navbar ng-white border-bottom box-shadow mb-3" fixed='top' light>

          <NavbarBrand className="d-flex align-items-center ms-3" tag={Link} to="/">
            <picture>
              {/**<source
                srcset={require('../images/ppm360_logo_light.png')}
                media="(prefers-color-scheme: dark)"
    />**/}
              <img style={{ height: '18px', display: 'flex', alignContent: 'center' }}
                src={require('../images/ppm360_logo_dark.png')}
                alt="PPM360"
              />
            </picture>
          </NavbarBrand>



          <ul className="navbar-nav flex-grow">
            {/** <NavItem>
                <NavLink tag={Link} className="text-dark" to="/">Dashboard</NavLink>
              </NavItem>*/}
          </ul>

        </Navbar>
      </header>

    );


  }
}
