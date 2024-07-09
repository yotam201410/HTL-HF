import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export const Navbar = () => {
    const [currentQuery, setCurrentQuery] = useState('');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [user, setCurrentUser] = useState({ first_name: "hi", last_name: "bye" });
    const navigate = useNavigate();
    const dropdownRef = useRef(null);

    const handleSearch = (e) => {
        e.preventDefault();
        navigate(`/products?search=${currentQuery}`);
    };

    const handleLogout = () => {
        console.log("logout");
        setCurrentUser(null);
    };

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setIsDropdownOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <Link to="/" className="navbar-brand">Home</Link>
            <Link to="/cart" className="nav-link">Cart</Link>

            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent"
                aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>

            <div className="collapse navbar-collapse" id="navbarSupportedContent">
                <form className="form-inline ml-auto" onSubmit={handleSearch}>
                    <input
                        className="form-control mr-sm-2"
                        type="search"
                        value={currentQuery}
                        onChange={(e) => setCurrentQuery(e.target.value)}
                        placeholder="Search for product"
                        aria-label="Search"
                    />
                    <button className="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button>
                </form>

                <ul className="navbar-nav ml-auto" ref={dropdownRef}>
                    {user ? (
                        <li className={`nav-item dropdown ${isDropdownOpen ? 'show' : ''}`}>
                            <a className="nav-link dropdown-toggle" href="#" role="button" onClick={toggleDropdown} aria-haspopup="true"
                                aria-expanded={isDropdownOpen}>
                                {`${user.first_name} ${user.last_name}`}
                            </a>
                            <div className={`dropdown-menu dropdown-menu-right ${isDropdownOpen ? 'show' : ''}`}>
                                <Link to="/profile" className="dropdown-item">Edit Profile</Link>
                                <Link to="/orders" className="dropdown-item">Orders</Link>
                                <Link to="/addresses" className="dropdown-item">Addresses</Link>
                                <a className="dropdown-item" onClick={handleLogout} href="/">Logout</a>
                            </div>
                        </li>
                    ) : (
                        <>
                            <li>
                                <Link to="/login" className="nav-link">Login</Link>
                            </li>
                            <li>
                                <Link to="/register" className="nav-link">Register</Link>
                            </li>
                        </>
                    )}
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;
