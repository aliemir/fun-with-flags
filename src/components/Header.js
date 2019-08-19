import React from 'react'
import styles from './styles/Header.module.scss';
import {Scores, CloseButton, Logo} from ".";

const Header = (props) => {
  return (
    <div className={styles.header}>
      <CloseButton onClickHandler={props.onCloseClick} />
      <Logo/>
      <Scores scores={props.scores}/>
    </div>
  )
}

export default Header
