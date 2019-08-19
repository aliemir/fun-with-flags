import React from 'react'
import styles from './styles/Logo.module.scss'

const Logo = () => {
  return (
    <div className={styles.logo}>
    <div className={styles["logo-background"]}></div>   
    <div className={styles["logo-text"]}>
    <span className={styles["logo-text-fun"]}>FUN</span>
    <span className={styles["logo-text-with"]}>with</span>
    <span className={styles["logo-text-flags"]}>FLAGS</span>
    </div>
  </div>
  )
}

export default Logo
