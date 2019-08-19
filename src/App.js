import React, { useEffect, useState } from 'react';
import './App.scss';
import Confetti from 'react-confetti'
import { animated, useSpring } from 'react-spring';
import { Header, Timer } from './components';
import { shuffle, flags, useGameState, createQuestions, useWindowSize } from './utils';

function App() {
  const [installPrompt, setPrompt] = useState(null);
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
  }, [dispatch]);
  
  useEffect(() => {
    window.addEventListener('beforeinstallprompt', (e) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setPrompt(e);
    });
    
  }, []);

  async function installApp() {
    if (installPrompt) {
      installPrompt.prompt();
      installPrompt.userChoice.then(function(choiceResult){
  
        if (choiceResult.outcome === 'accepted') {
        console.log('Your PWA has been installed');
      } else {
        console.log('User chose to not install your PWA');
      }
  
        setPrompt(null);
  
      });
  
  
    }
  }

  async function shareApp(title, text, url) {
    if (navigator.share) {
      navigator.share({
        title: 'Fun with Flags!',
        text: `Check out this new addictive game! My highest score is ${game.stats.highScore}`,
        url: "https://funflags.now.sh"
      }).then(() => {
        console.log('Thanks for sharing!');
      })
      .catch(err => {
        console.log(`Couldn't share because of`, err.message);
      });
    } else {
      console.log('web share not supported');
    }
  }

  const startGame = () => {
    dispatch({type: 'START_GAME'});
  }
  const showStats = () => {
    dispatch({ type: 'STATS' });
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
    shareApp('Fun With Flags', 'https://funflags.now.sh', '')
  }
  const shareScore = () => {
    shareApp('Fun With Flags', 'https://funflags.now.sh', '')
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

  const onStatsRender = () => {
    const total = game.stats.correctCount + game.stats.wrongCount;
    return (
      <div className="onStats" style={{textAlign: 'left'}}>
        <div>HIGH SCORE : {game.stats.highScore}</div>
        <div>TIMES PLAYED : {game.stats.timesPlayed}</div>
        <div>CORRECT : {(game.stats.correctCount / total * 100).toFixed(0)}%</div>
        <div>WRONG : {(game.stats.wrongCount / total * 100).toFixed(0)}%</div>
        <span>...</span>
        <button type="button" onClick={() => resetGame()}>GO BACK</button>
      </div>
    )
  }

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
        <button type="button" onClick={() => showStats()}>STATISTICS</button>
        <button type="button" onClick={() => shareGame()}>CHALLENGE YOUR FRIENDS</button>
        <button type="button" className="addToHomeScreen"onClick={() => installApp()}>DOWNLOAD THE APP</button>
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
      case 'stats':
        return onStatsRender();
      default:
        return (<div>UNHANDLED_STATUS</div>)
    }
  }

  if(game) {
    return (
      <animated.div className="App" style={{height, backgroundColor: bgAnim
        .interpolate({
          range: [0, 0.5, 1],
          output: ['white', answerColor, 'white']
        })}}>
        <Header scores={game.score} onCloseClick={() => {
          if (game.gameStatus === 'paused') {
            unpauseGame()
          } else if(game.gameStatus === 'active') {
            pauseGame()
          } else {
            resetGame()
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
