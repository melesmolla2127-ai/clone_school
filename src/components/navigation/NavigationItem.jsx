import { NavLink } from 'react-router-dom'
import './NavigationItem.css'

function NavigationItem({ to, label, icon: Icon, primary = false }) {
  const getClassName = ({ isActive }) =>
    [
      'app-nav__item',
      primary ? 'app-nav__item--primary' : '',
      isActive ? 'app-nav__item--active' : '',
    ]
      .filter(Boolean)
      .join(' ')

  return (
    <NavLink className={getClassName} to={to} aria-label={label} title={label}>
      <span className="app-nav__icon" aria-hidden="true">
        <Icon size={primary ? 24 : 20} strokeWidth={primary ? 2.3 : 2} />
      </span>
      <span className="app-nav__label">{label}</span>
    </NavLink>
  )
}

export default NavigationItem
