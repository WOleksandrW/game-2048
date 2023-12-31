import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import {
  convertMatrix,
  getRandomNumber,
  isPossibleToMerge,
  complexMoveComp
} from '../functions/functions';
import { TilePosType } from '../types/TileTypes';

// Additional function
const checkNumber = (num: number) => {
  return typeof num !== 'number' || num < 0;
};

const checkFieldRow = (row: number[]) => {
  return !Array.isArray(row) || row.length !== 4 || row.some((tile) => checkNumber(tile));
};

const checkField = (matrix: number[][]) => {
  return !Array.isArray(matrix) || matrix.length !== 4 || matrix.some((row) => checkFieldRow(row));
};

export type DirectionType = 'Top' | 'Left' | 'Right' | 'Bottom';

interface IBoardSlice {
  field: number[][];
  newField: number[][];
  values: number[];
  score: number;
  record: number;
  isGameOver: boolean;
  isAfterLoading: boolean;
  areMoving: boolean;
  areMoved: boolean;
  movedTiles: { [key: string]: TilePosType };
  newTilePos?: TilePosType;
}

const initialState: IBoardSlice = {
  field: [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0]
  ],
  newField: [],
  values: [0, 2, 4],
  score: 0,
  record: 0,
  isGameOver: false,
  isAfterLoading: false,
  areMoving: false,
  areMoved: true,
  movedTiles: {}
};

export const boardSlice = createSlice({
  name: 'board',
  initialState,
  reducers: {
    resetStates: (state) => {
      state.field = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
      ];
      state.score = 0;
      state.areMoved = true;
      state.isGameOver = false;
    },
    loadGame: (state) => {
      try {
        const record = JSON.parse(localStorage.getItem('record') || '0');

        if (checkNumber(record)) {
          throw new Error('Record has invalid format');
        }

        state.record = record;
      } catch (error) {
        localStorage.removeItem('record');
      }

      try {
        const field: number[][] = JSON.parse(localStorage.getItem('field') || '');
        const score = JSON.parse(localStorage.getItem('score') || '');

        if (checkNumber(score)) {
          throw new Error('Score has invalid format');
        }
        if (checkField(field)) {
          throw new Error('Field has invalid format');
        }

        const tiles = field.reduce((acc, row) => acc.concat(row));
        while (tiles.some((tile) => tile >= state.values.length)) {
          state.values.push(Math.pow(2, state.values.length));
        }

        state.field = field;
        state.score = score;
        state.isAfterLoading = true;
      } catch (error) {
        localStorage.removeItem('field');
        localStorage.removeItem('score');
      }
    },
    saveGame: (state) => {
      localStorage.setItem('field', JSON.stringify(state.field));
      localStorage.setItem('score', JSON.stringify(state.score));
    },
    generateTile: (state) => {
      const possTiles: TilePosType[] = [];
      state.field.forEach((row, idxRow) => {
        row.forEach((tile, idxTile) => {
          if (tile === 0) possTiles.push({ row: idxRow, col: idxTile });
        });
      });

      state.newTilePos = possTiles[getRandomNumber(0, possTiles.length - 1)];
      if (state.newTilePos) {
        const random = getRandomNumber(0, 10);
        const tile = random > 8 ? 2 : 1;
        state.field[state.newTilePos.row][state.newTilePos.col] = tile;
        state.areMoved = false;
      } else {
        state.isGameOver = true;
      }
    },
    checkGameOver: (state) => {
      state.isGameOver = !isPossibleToMerge(state.field);
    },
    moveTiles: (state, action: PayloadAction<DirectionType>) => {
      if (!state.isGameOver && !state.areMoving) {
        state.newTilePos = undefined;
        state.isAfterLoading = false;
        state.movedTiles = {};

        let newField: number[][] = [];
        const mergedTiles: number[] = [];
        const movedTiles: { [key: string]: TilePosType } = {};

        switch (action.payload) {
          case 'Top':
            newField = convertMatrix(
              convertMatrix(state.field).map((row, idxRow) => {
                const { newRow, mergedTilesObj, movedTilesObj } = complexMoveComp(row);

                Object.keys(movedTilesObj).forEach((key) => {
                  const tKey = `${key}-${idxRow}`;
                  const tValue = movedTilesObj[+key] - +key;
                  if (tValue !== 0) movedTiles[tKey] = { row: tValue, col: 0 };
                });
                mergedTiles.push(...Object.values(mergedTilesObj));
                return newRow;
              })
            );
            break;
          case 'Left':
            newField = state.field.map((row, idxRow) => {
              const { newRow, mergedTilesObj, movedTilesObj } = complexMoveComp(row);

              Object.keys(movedTilesObj).forEach((key) => {
                const tKey = `${idxRow}-${key}`;
                const tValue = movedTilesObj[+key] - +key;
                if (tValue !== 0) movedTiles[tKey] = { row: 0, col: tValue };
              });
              mergedTiles.push(...Object.values(mergedTilesObj));
              return newRow;
            });
            break;
          case 'Right':
            newField = state.field.map((row, idxRow) => {
              const { newRow, mergedTilesObj, movedTilesObj } = complexMoveComp([...row].reverse());

              Object.keys(movedTilesObj).forEach((key) => {
                const tKey = `${idxRow}-${row.length - 1 - +key}`;
                const tValue = row.length - 1 - movedTilesObj[+key] - (row.length - 1 - +key);
                if (tValue !== 0) movedTiles[tKey] = { row: 0, col: tValue };
              });
              mergedTiles.push(...Object.values(mergedTilesObj));
              return [...newRow].reverse();
            });
            break;
          case 'Bottom':
            newField = convertMatrix(
              convertMatrix(state.field).map((row, idxRow) => {
                const { newRow, mergedTilesObj, movedTilesObj } = complexMoveComp(
                  [...row].reverse()
                );

                Object.keys(movedTilesObj).forEach((key) => {
                  const tKey = `${row.length - 1 - +key}-${idxRow}`;
                  const tValue = row.length - 1 - movedTilesObj[+key] - (row.length - 1 - +key);
                  if (tValue !== 0) movedTiles[tKey] = { row: tValue, col: 0 };
                });
                mergedTiles.push(...Object.values(mergedTilesObj));
                return [...newRow].reverse();
              })
            );
            break;
        }
        if (JSON.stringify(newField) !== JSON.stringify(state.field)) {
          state.areMoving = true;
          state.movedTiles = movedTiles;
          state.newField = newField;
        }
        if (mergedTiles.length > 0) {
          while (mergedTiles.some((tile) => tile >= state.values.length)) {
            state.values.push(Math.pow(2, state.values.length));
          }
          state.score += mergedTiles.reduce((acc, tile) => acc + state.values[tile], 0);
          if (state.score > state.record) {
            state.record = state.score;
            localStorage.setItem('record', JSON.stringify(state.record));
          }
        }
      }
    },
    setNewField: (state) => {
      state.movedTiles = {};
      state.field = state.newField;
      state.newField = [];
      state.areMoving = false;
      state.areMoved = true;
    }
  }
});

export const {
  resetStates,
  generateTile,
  moveTiles,
  checkGameOver,
  loadGame,
  saveGame,
  setNewField
} = boardSlice.actions;
export default boardSlice.reducer;
