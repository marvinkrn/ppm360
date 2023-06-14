import React, { useCallback, useEffect, useRef, useState } from 'react';
import './InitialsAvatar.css';

export function getInitials(name) {
    const [firstName, lastName] = name.split(' ');

    if (firstName && lastName)
        return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();

    return `${firstName.charAt(0)}${firstName.charAt(1)}`.toUpperCase();
}

const InitialsAvatar = ({ name }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef(null);

    const handleMenuToggle = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    // On logout, clear the localStorage (username & token) and return back to /login
    const handleLogout = () => {
        localStorage.clear();
        window.location.href = '/login';
    };

    // CloseOpenMenu is used when clicking outside of the menu to close it
    const closeOpenMenu = useCallback((e) => {
        if (menuRef.current && isMenuOpen && !menuRef.current.contains(e.target)) {
            setIsMenuOpen(false);
        }
    }, [isMenuOpen]);

    useEffect(() => {
        // Add EventListener for mousedown when clicking outside of the menu
        document.addEventListener('mousedown', closeOpenMenu);
        return () => {
            document.removeEventListener('mousedown', closeOpenMenu);
        };
    }, [closeOpenMenu]);

    return (
        <>
            <div className="initials-avatar-wrapper">
                <div aria-label={name} role="img" className={`initials-avatar ${isMenuOpen ? 'open' : ''}`}>
                    <div className="avatar-content" onClick={handleMenuToggle}>
                        {getInitials(name)}
                    </div>
                </div>

                {isMenuOpen && (
                    <ul className="menuModal" ref={menuRef}>
                        <li className="menuItem menuInfo">
                            Angemeldet als&nbsp;<b>{localStorage.getItem("username")}</b>
                        </li>
                        <li onClick={handleLogout}>
                            <a href="/login" className="menuItem menuLink" onClick={handleLogout}>
                                Abmelden
                            </a>
                        </li>
                    </ul>
                )}
            </div>
        </>
    );
};

export default InitialsAvatar;
