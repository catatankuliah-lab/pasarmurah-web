import getGreetingMessage from '../utils/greetingHandler';
import { useLocation } from 'react-router-dom';
import menuData from '../data/menuData.json';

const Navbar = () => {
  let selectedMenuText = "Dashboard";
  const location = useLocation();
  const userRole = localStorage.getItem('id_role');
  const currentPath = location.pathname.split('/').filter(Boolean).pop();

  const filteredMenu = menuData
    .map(section => ({
      ...section,
      items: section.items.filter(item => !item.roles || item.roles.includes(userRole))
    }))
    .filter(section => section.items.length > 0);

  const foundItem = filteredMenu
    .flatMap(section => section.items)
    .find(item => item.link && item.link.includes(currentPath));

  if (foundItem) {
    selectedMenuText = foundItem.text;
  } else {
    selectedMenuText = "";
  }

  return (
    <nav
      className="d-sm-none layout-navbar container-xxl navbar navbar-expand-xl navbar-detached align-items-center bg-navbar-theme"
      id="layout-navbar">
      <div className="layout-menu-toggle navbar-nav align-items-xl-center me-3 me-xl-0 d-xl-none">
        <a aria-label='toggle for sidebar' className="nav-item nav-link px-0 me-xl-4" href="#">
          <i className="bx bx-menu bx-sm"></i>
        </a>
      </div>

      <div className="navbar-nav-right d-flex align-items-center fw-bold" id="navbar-collapse">
        {selectedMenuText}
      </div>
    </nav>
  );
}
export default Navbar;
