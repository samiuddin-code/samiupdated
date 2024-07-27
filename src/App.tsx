import React, { useState, useEffect } from 'react';
import PuzzleGrid from './component/PuzzleGrid';
import Leaderboard from './component/Leaderboard';

const App: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [difficulty, setDifficulty] = useState('easy');

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div>
      <h1>Puzzle Game</h1>
      <div>
        <Leaderboard/>
        <label>
          Difficulty:
          <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </label>
      </div>
      <div>Time Left: {timeLeft} seconds</div>
      <PuzzleGrid difficulty={difficulty} />
    </div>
  );
};

export default App;
