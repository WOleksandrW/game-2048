import { AnyAction, ThunkDispatch } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { resetStates } from '../../redux/boardSlice';
import { Button } from '../';

import styles from './PopupGameOver.module.scss';

interface PopupGameOverProps {
  onClose: () => void;
}

export default function PopupGameOver(props: PopupGameOverProps) {
  const score = useSelector((state: RootState) => state.boardSlice.score);
  const record = useSelector((state: RootState) => state.boardSlice.record);
  const dispatch: ThunkDispatch<RootState, undefined, AnyAction> = useDispatch();

  return (
    <>
      <div className={styles['popup']}>
        <h3 className={styles['title']}>Game Over</h3>
        {score >= record ? <p>New record: {score}</p> : <p>Your score: {score}</p>}
        <p>Do you want to restart game?</p>
        <div className={styles['btn-list']}>
          <Button className={styles['btn']} onClick={() => dispatch(resetStates())}>
            OK
          </Button>
          <Button className={styles['btn']} onClick={props.onClose}>
            Cancel
          </Button>
        </div>
        {score >= record && (
          <>
            <div className={`${styles['confetti']} ${styles['left']}`}></div>
            <div className={`${styles['confetti']} ${styles['right']}`}></div>
          </>
        )}
      </div>
      <div className={styles['popup-background']} onClick={props.onClose}></div>
    </>
  );
}
