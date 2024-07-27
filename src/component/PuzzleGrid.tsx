import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Cell, PuzzleResponse, SubmitResponse } from '../types';
import './PuzzleGrid.css';

const PuzzleGrid: React.FC<{ difficulty: string }> = ({ difficulty }) => {
  const [grid, setGrid] = useState<Cell[][]>([]);
  const [selectedCells, setSelectedCells] = useState<{ row: number, col: number }[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [puzzleId, setPuzzleId] = useState<string | null>(null);
  const [startTime, setStartTime] = useState<number>(Date.now()); // Track start time

  const fetchPuzzle = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get<PuzzleResponse>(`http://159.89.104.127:3001/puzzle/generate?difficulty=${difficulty}`);
      if (response.data?.grid) {
        const puzzle = response.data.grid.map((row) =>
          row.map((value) => ({ value, isSelected: false }))
        );
        setGrid(puzzle);
        setPuzzleId(response.data._id);
        setStartTime(Date.now()); // Reset start time
      } else {
        setError('No puzzle available.');
      }
    } catch (error) {
      setError('Failed to load puzzle.');
    } finally {
      setLoading(false);
    }
  }, [difficulty]);

  useEffect(() => {
    fetchPuzzle();
  }, [fetchPuzzle]);

  const handleCellClick = (row: number, col: number) => {
    setGrid((prevGrid) => {
      const updatedGrid = prevGrid.map((r, rowIndex) =>
        rowIndex === row
          ? r.map((cell, colIndex) =>
              colIndex === col
                ? { ...cell, isSelected: !cell.isSelected }
                : cell
            )
          : r
      );

      const selected = updatedGrid.flatMap((r, rowIndex) =>
        r.map((cell, colIndex) =>
          cell.isSelected ? { row: rowIndex, col: colIndex } : null
        ).filter((cell): cell is { row: number, col: number } => cell !== null)
      );

      setSelectedCells(selected);
      return updatedGrid;
    });
  };

  const handleSubmit = async () => {
    if (!puzzleId) {
      alert('No puzzle available to submit.');
      return;
    }

    if (selectedCells.length % 2 !== 0) {
      alert('Please select pairs of cells.');
      return;
    }

    const pairs = [];
    for (let i = 0; i < selectedCells.length; i += 2) {
      pairs.push([selectedCells[i], selectedCells[i + 1]]);
    }

    const completionTime = Math.floor((Date.now() - startTime) / 1000); // Calculate completion time in seconds

    try {
      const response = await axios.post<SubmitResponse>('http://159.89.104.127:3001/puzzle/submit', {
        username: 'testUser',
        puzzleId: puzzleId,
        solution: pairs,
        completionTime // Include completion time in the request
      });

      if (response.data.success) {
        alert('Correct solution!');
      } else {
        alert('Incorrect solution.');
      }
    } catch (error) {
      console.error('Error submitting solution:', error);
      alert('Error submitting solution.');
    }
  };

  return (
    <div className="puzzle-container">
      {loading ? (
        <p>Loading puzzle...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <div className="puzzle-grid">
          {grid.length === 0 ? (
            <p>No puzzle available.</p>
          ) : (
            grid.map((row, rowIndex) => (
              <div key={rowIndex} className="puzzle-row">
                {row.map((cell, colIndex) => (
                  <div
                    key={colIndex}
                    onClick={() => handleCellClick(rowIndex, colIndex)}
                    className={`puzzle-cell ${cell.isSelected ? 'selected' : ''}`}
                  >
                    {cell.value}
                  </div>
                ))}
              </div>
            ))
          )}
          <button onClick={handleSubmit} className="submit-button">Submit Solution</button>
        </div>
      )}
    </div>
  );
};

export default PuzzleGrid;
