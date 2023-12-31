import { useEffect } from 'react';
import { AnyAction, ThunkDispatch } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { generateTile, checkGameOver, setNewField } from '../../redux/boardSlice';
import { Tile } from '../';

import { colorsTile as colors, moveTilesDelay } from '../../data';

import styles from './Board.module.scss';

export default function Board() {
  const field = useSelector((state: RootState) => state.boardSlice.field);
  const values = useSelector((state: RootState) => state.boardSlice.values);
  const score = useSelector((state: RootState) => state.boardSlice.score);
  const record = useSelector((state: RootState) => state.boardSlice.record);
  const isAfterLoading = useSelector((state: RootState) => state.boardSlice.isAfterLoading);
  const isMoved = useSelector((state: RootState) => state.boardSlice.areMoved);
  const isMoving = useSelector((state: RootState) => state.boardSlice.areMoving);
  const movedTiles = useSelector((state: RootState) => state.boardSlice.movedTiles);
  const newTilePos = useSelector((state: RootState) => state.boardSlice.newTilePos);
  const dispatch: ThunkDispatch<RootState, undefined, AnyAction> = useDispatch();

  useEffect(() => {
    if (isMoving) {
      const timeoutId = setTimeout(() => {
        dispatch(setNewField());
      }, moveTilesDelay * 1000);

      return () => clearTimeout(timeoutId);
    }
  }, [dispatch, isMoving]);

  useEffect(() => {
    if (isMoved) {
      dispatch(generateTile());
    }
  }, [dispatch, isMoved]);

  useEffect(() => {
    if (!field.some((row) => row.some((tile) => tile === 0))) dispatch(checkGameOver());
  }, [dispatch, field]);

  return (
    <div className={styles['board']}>
      <div className={styles['header']}>
        <h3 className={styles['title']}>2048</h3>
        <div className={styles['info-block']}>
          <p className={styles['info']}>
            <span className={styles['subtitle']}>score:</span>
            <span className={styles['value']}>{score}</span>
          </p>
          <p className={styles['info']}>
            <span className={styles['subtitle']}>record:</span>
            <span className={styles['value']}>{record}</span>
          </p>
        </div>
      </div>
      <div className={styles['field']}>
        {field.map((row, idxRow) =>
          row.map((tile, idxTile) => (
            <Tile
              key={`${idxRow}-${idxTile}`}
              value={values[tile]}
              color={colors[tile - 1] ?? colors[colors.length - 1]}
              isNew={
                isAfterLoading ||
                (newTilePos && idxRow === newTilePos.row && idxTile === newTilePos.col)
              }
              movePos={movedTiles[`${idxRow}-${idxTile}`]}
            />
          ))
        )}
      </div>
    </div>
  );
}
