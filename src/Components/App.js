import React, { useState } from 'react';
import Game from './Game';

const App = () => {
  const [gameId, setGameId] = useState(1);
  const reset = () => {
    setGameId(prev => prev + 1);
  }
  return <Game 
    key={gameId} 
    randomNumberCount={6} 
    initialSeconds={10} 
    onPlayAgain={reset} />;
};

export default App;