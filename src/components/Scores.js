import React from 'react'
import styles from './styles/Scores.module.scss';
import {useSpring, animated} from 'react-spring';

const Scores = ({scores}) => {
  const {currentScore,highScore,scoreMultiplier} = scores;
  const activeScore = useSpring({ to: {number: currentScore}, from: { number: 0} })
  return (
    <div className={styles['score']}>
      <div className={styles['score-high']}>{highScore}</div>
      <animated.div className={styles['score-now']}>{activeScore.number.interpolate(val => Math.round(val))}</animated.div>
      <div className={styles['score-multiplier']}>{scoreMultiplier}x</div>
    </div>
  )
}

export default Scores
