import React from 'react'
import styles from './styles/CloseButton.module.scss';

const CloseButton = ({onClickHandler}) => {
  return (
    <div className={styles.closeButton}>
      <span onClick={onClickHandler} className={styles.times}>=</span>
    </div>
  )
}

export default CloseButton
