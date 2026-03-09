import { Link, NavLink } from 'react-router-dom'
import styles from './Header.module.css'

export function Header() {
  return (
    <header className={styles.header}>
      <Link to="/" className={styles.logo}>
        Animal Sanctuary Directory
      </Link>
      <nav className={styles.nav}>
        <NavLink to="/" end className={({ isActive }) => (isActive ? styles.active : '')}>
          Map
        </NavLink>
        <NavLink to="/contact" className={({ isActive }) => (isActive ? styles.active : '')}>
          Contact
        </NavLink>
      </nav>
    </header>
  )
}
