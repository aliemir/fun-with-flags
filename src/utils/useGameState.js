import { useReducer } from 'react';
import { useLocalStorage, useInterval, calcMultiplier } from ".";

const useGameState = () => {
  const [highScore, setHighScore] = useLocalStorage('gameHighScore', 0);

  const [game, dispatch ] = useReducer((state,action) => {
    switch(action.type) {
      default :
        console.log('UNHANDLED_TYPE', action.type);
      break;
      case 'DECREMENT_TIME': 
        return {
          ...state,
          time: state.time -2
        }
      case 'INIT_GAME':
        return {
          time: 155,
          isRunning: false,
          gameStatus: 'zero',
          timeEffect: {state: 0, color: {r: 250, g: 215, b: 68}},
          score: {currentScore: 0, scoreMultiplier: 1, highScore, streak: 0},
          counter: {question: 0, correct: 0, wrong: 0}
        };
      case 'START_GAME': 
        return {
          ...state,
          isRunning: true,
          gameStatus: 'active'
        }
      case 'RESET_GAME':
          return {
            time: 155,
            isRunning: false,
            gameStatus: 'zero',
            timeEffect: {state: 0, color: {r: 250, g: 215, b: 68}},
            score: {currentScore: 0, scoreMultiplier: 1, highScore, streak: 0},
            counter: {question: 0, correct: 0, wrong: 0}
          };
      case 'PAUSE_GAME':
          return {
            ...state,
            isRunning: false,
            gameStatus: 'paused'
          }
      case 'UNPAUSE_GAME':
          return {
            ...state,
            isRunning: true,
            gameStatus: 'active'
          }
      case 'GAME_OVER':
          if(highScore < state.score.currentScore) {
            setHighScore(state.score.currentScore);
            return {
              ...state,
              isRunning: false,
              gameStatus: 'over',
              gameOverType: 'newHighScore'
            };
          } 
            return {
              ...state,
              isRunning: false,
              gameStatus: 'over',
              gameOverType: 'timeOver'
            }
        
      case 'CORRECT':
        return {
          ...state,
          time: (state.time + 20 > 150 ? 150 : state.time + 20),
          timeEffect: {state: !state.timeEffect.state, color: {r:22, g: 168, b: 22}},
          score: { ...state.score, currentScore: state.score.currentScore + (10 * state.score.scoreMultiplier), streak: state.score.streak + 1, scoreMultiplier: calcMultiplier(state.score.streak, state.score.scoreMultiplier) },
          counter: {question: state.counter.question+1, correct: state.counter.correct+1, wrong: state.counter.wrong}
        }
      case 'WRONG':
        return {
          ...state,
          time: state.time - 30,
          timeEffect: {state: !state.timeEffect.state, color: {r: 239, g: 84, b: 84}},
          score: { ...state.score, scoreMultiplier: 1, streak: 0 },
          counter: {question: state.counter.question+1, correct: state.counter.correct, wrong: state.counter.wrong+1}
        }
    }
  });

    useInterval(() => {
      if(game.time <= 0 ) {
        dispatch({type: 'GAME_OVER'});
      } else {
        dispatch({type: 'DECREMENT_TIME'})
      }
    },game && game.isRunning ? 200 : null);


  
  return [game, dispatch];
};

export default useGameState;