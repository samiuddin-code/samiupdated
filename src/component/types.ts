// src/types.ts

export interface Cell {
    value: number | null;
    isSelected: boolean;
  }
  
  export interface PuzzleResponse {
    grid: number[][];
    difficulty: string;
    _id: string;
    __v: number;
  }
  
  export interface SubmitResponse {
    success: boolean;
  }
  
  export interface SubmitRequestBody {
    username: string;
    puzzleId: string;
    solution: number[][][]; // Array of pairs of coordinates
  }
  