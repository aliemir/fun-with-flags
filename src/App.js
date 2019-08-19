import React, { useEffect, useState } from 'react';
import './App.scss';
import Confetti from 'react-confetti'
import { animated, useSpring } from 'react-spring';
import { Header, Timer } from './components';
import { shuffle, flags, useGameState, createQuestions, useWindowSize } from './utils';

function App() {
  const [questions, setQuestions] = useState([...flags]);
  const { width, height } = useWindowSize();
  const [answerE, toggleAnswerE] = useState(0);
  const [answerColor, setAnswerColor] = useState('rgb(22,168,22)');
  const { bgAnim } = useSpring({ from: { bgAnim: 0 }, bgAnim: answerE ? 1 : 0, config: { duration: 750 } })
  const correctColor = 'rgb(22,168,22)';
  const wrongColor = 'rgb(239,84,84)';

  const [game, dispatch] = useGameState();

  useEffect(() => {
    setQuestions(shuffle(createQuestions([...flags])));
    dispatch({type:'INIT_GAME'});
  },[dispatch]);

  const startGame = () => {
    dispatch({type: 'START_GAME'});
  }
  const pauseGame = () => {
    dispatch({type: 'PAUSE_GAME'});
  }
  const unpauseGame = () => {
    dispatch({type: 'UNPAUSE_GAME'});
  }
  const resetGame = () => {
    setQuestions(shuffle(createQuestions([...flags])));
    dispatch({type: 'RESET_GAME'});
  }
  const shareGame = () => {
    console.log('share game');
  }
  const shareScore = () => {
    console.log('share score');
  }
  const checkAnswer = (e) => {
    const answer = e;
    if (answer === true) {
      setAnswerColor(correctColor);
      toggleAnswerE(!answerE);
      dispatch({type: 'CORRECT'});
    } else {
      setAnswerColor(wrongColor);
      toggleAnswerE(!answerE);
      dispatch({ type: 'WRONG' });
    }
  }

  const renderQuestion = (qIndex) => {
    const qItem = questions[qIndex];
    return (
      <div style={{ textAlign: 'center' }}>
        <div className="flag">{qItem.flag}</div>
        <div className="choices">
          {qItem.choices.map(choice => {
            return (<button type="button" key={choice.name} onClick={() => checkAnswer(choice.correct)}>{choice.name}</button>)
          })}
        </div>
      </div>
    );
  }

  const onPlayRender = () => {
    return (
      <div className="onPlay">
        <div style={{ textAlign: 'center' }}>
          {renderQuestion(game.counter.question)}
        </div>
      </div>
    )
  };

  const onPauseRender = () => {
    return (
      <div className="onPause">
        PAUSED!
        <span>...</span>
        <button type="button" onClick={() => unpauseGame()}>RESUME</button>
        <button type="button" onClick={() => resetGame()}>RESTART</button>
      </div>
    )
  };

  const onOverRender = () => {
    return (
      <div className="onOver">
        {game.gameOverType === 'newHighScore' ? <Confetti width={width} height={height} /> : ''}
        {game.gameOverType === 'newHighScore' ? 'NEW HIGH SCORE!' : 'GAME OVER!'}
        <span>...</span>
        <button type="button" onClick={() => resetGame()}>PLAY AGAIN</button>
        <button type="button" onClick={() => shareScore()}>SHARE WITH FRIENDS</button>
      </div>
    )
  }

  const onStartRender = () => {
    return (
      <div className="onStart">
        <button type="button" onClick={() => startGame()}>START GAME</button>
        <button type="button" disabled onClick={() => startGame()}>STATISTICS</button>
        <button type="button" disabled onClick={() => shareGame()}>CHALLENGE YOUR FRIENDS</button>
      </div>
    )
  }

  const renderPage = (status) => {
    switch (status) {
      case 'zero':
        return onStartRender();
      case 'active':
        return onPlayRender();
      case 'over':
        return onOverRender();
      case 'paused':
        return onPauseRender();
      default:
        return (<div>UNHANDLED_STATUS</div>)
    }
  }

  if(game) {
    return (
      <animated.div className="App" style={{backgroundColor: bgAnim
        .interpolate({
          range: [0, 0.5, 1],
          output: ['white', answerColor, 'white']
        })}}>
        <Header scores={game.score} onCloseClick={() => {
          if (game.gameStatus === 'paused') {
            unpauseGame()
          } else {
            pauseGame()
          }
        }} />
        <Timer time={game.time} effect={game.timeEffect}/>
        <div className="container">
          {renderPage(game.gameStatus)}
        </div>
        <div className="ads">
          advertisement
        </div>
      </animated.div>
    );
  } 
    return (<div className="Loading">...</div>);
  

}

export default App;
