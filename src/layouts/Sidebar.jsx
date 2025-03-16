import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import menuData from '../data/menuData.json';

const Sidebar = ({ userRole }) => {
    const location = useLocation();
    const path = location.pathname;

    const filteredMenu = menuData
        .map(section => ({
            ...section,
            items: section.items.filter(item => !item.roles || item.roles.includes(userRole))
        }))
        .filter(section => section.items.length > 0);

    return (
        <aside id="layout-menu" className="layout-menu menu-vertical menu bg-menu-theme">
            <div className="app-brand demo mt-3">
                <NavLink to="/" className="app-brand-link">
                    <span className="app-brand-logo demo">
                        <img src="/assets/img/logos/logo.png" style={{ width: '200px' }} alt="logo" aria-label='logo image' />
                    </span>
                </NavLink>
            </div>
            <ul className="menu-inner py-1">
                {filteredMenu.map(section => (
                    <React.Fragment key={section.header}>
                        {section.header && (
                            <li className="menu-header small text-uppercase">
                                <span className="menu-header-text">{section.header}</span>
                            </li>
                        )}
                        {section.items.map(item => (
                            <li li key={item.text} className={path == item.link ? "menu-item active" : "menu-item"}>
                                <NavLink to={item.link} className="menu-link">
                                    <i className={`menu-icon tf-icons ${item.icon}`}></i>
                                    <div>{item.text}</div>
                                </NavLink>
                            </li>
                        ))}
                    </React.Fragment>
                ))}
            </ul>
        </aside >
    );
};

export default Sidebar;
