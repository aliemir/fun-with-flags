import React from 'react'
import styles from './styles/Timer.module.scss'
import {useSpring, animated} from 'react-spring';
 
const Timer = ({time, effect}) => {
  const progressValue = Math.floor((time / 150 * 100));
  
  const { effectAnim } = useSpring({ from: { effectAnim: 0 }, effectAnim: effect.state ? 1 : 0, config: { duration: 1000 } })
  const progAnim = useSpring({from: {width : `0%`}, to: {width: `${progressValue}%` }});
  return (
    <div className={styles['timer']}>
      <animated.div className={styles['progress']} style={{backgroundColor: effectAnim
            .interpolate({
              range: [0, 0.15, 0.85, 1],
              output: ['rgba(250,215,68, 0.2)', `rgba(${effect.color.r},${effect.color.g},${effect.color.b}, 0.3)`, `rgba(${effect.color.r},${effect.color.g},${effect.color.b}, 0.3)`, 'rgba(250,215,68,0.2)']
            })}}>
        <animated.div className={styles['progress-value']} style={{...progAnim, backgroundColor: effectAnim
            .interpolate({
              range: [0, 0.15, 0.85, 1],
              output: ['rgb(250,215,68)', `rgb(${effect.color.r},${effect.color.g},${effect.color.b})`, `rgb(${effect.color.r},${effect.color.g},${effect.color.b})`, 'rgb(250,215,68)']
            })
            .interpolate(effectAnim => `${effectAnim}`)}}></animated.div>
      </animated.div>
    </div>
  )
}

export default Timer