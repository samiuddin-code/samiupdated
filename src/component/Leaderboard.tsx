import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface User {
  username: string;
  highScore: number;
}

const Leaderboard: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get<User[]>('http://159.89.104.127:3001/puzzle/leaderboard');
        setUsers(response.data);
      } catch (error) {
        setError('Failed to load leaderboard.');
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  return (
    <div className="leaderboard-container">
      {loading ? (
        <p>Loading leaderboard...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <div className="leaderboard">
          <h2>Leaderboard</h2>
          <ul>
            {users.map((user, index) => (
              <li key={index}>
                {user.username}: {user.highScore}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Leaderboard;
