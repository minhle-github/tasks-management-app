import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './Home.module.scss';
import logo from './logo.png';
import landingImg from './landingImg.png';
import CountUp from 'react-countup';
import { FaBars, FaTimes } from 'react-icons/fa';

const Home = () => {
  const navigate = useNavigate();
  const [barsClicked, setBarsClicked] = useState(false);
  
  const menuButtonClicked = () => {
    setBarsClicked(prev => !prev);
  }

  return (
    <div className={styles.home}>
      <header className={styles.header}>
        <img src={logo} className={styles.logo} alt="logo" />
        <nav className={`${styles.navbar}  ${barsClicked ? styles.navbarMobile : ''}`}>
          <ul className={`${styles.nav} ${barsClicked ? styles.navMobile : ''}`}>
            <li className={styles.navItem}><Link to="/" className={styles.navLink}>About</Link></li>
            <li className={styles.navItem}><Link to="/" className={styles.navLink}>Service</Link></li>
            <li className={styles.navItem}><Link to="/" className={styles.navLink}>Contact</Link></li>
          </ul>
          <div className={styles.navbarButtons}>
            <button className={`${styles.navbarBtn} btnDark`} onClick={() => navigate('/login')}>Sign In</button>
            <button className={`${styles.navbarBtn} btnFancySecondary`} onClick={() => navigate('/register')}>Sign Up</button>
          </div>
        </nav>
        {barsClicked ? <FaTimes className={styles.menuButton} onClick={menuButtonClicked} /> : <FaBars className={styles.menuButton} onClick={menuButtonClicked} />}
        
      </header>
      <section className={styles.main}>
        <article className={styles.hero}>
          <h2 className={styles.heroHeader}>Productivity is a key of success</h2>
          <p className={styles.heroContent}>Having trouble with a huge amount of tasks? Let our app help you to manage your work.</p>
          <button className={`${styles.heroBtn} btnFancySecondary`} onClick={() => navigate('/register')}>Get Started</button>
        </article>
        <img src={landingImg} className={styles.landingImg} alt="landing image" />
      </section>
      <section className={styles.stats}>
        <div className={styles.stat}>
          <h1 className={styles.statNumber}><CountUp end={280201} duration={2}/></h1>
          <p className={styles.statText}>users registered</p>
        </div>
        <div className={styles.stat}>
          <h1 className={styles.statNumber}><CountUp end={69} duration={2}/>%</h1>
          <p className={styles.statText}>recommended</p>
        </div>
      </section>
      <footer className={styles.footer}>
        <p>&copy; 2022. Made with stress!</p>
      </footer>
    </div>
  )
}

export default Home