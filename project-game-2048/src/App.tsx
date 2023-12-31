import { useEffect, useState } from 'react';
import { AnyAction, ThunkDispatch } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from './redux/store';
import { loadGame } from './redux/boardSlice';
import { Board, ControlPanel, PopupGameOver } from './components';

import styles from './App.module.scss';

function App() {
  const isGaveOver = useSelector((state: RootState) => state.boardSlice.isGameOver);
  const dispatch: ThunkDispatch<RootState, undefined, AnyAction> = useDispatch();

  const [showModal, setShowModal] = useState(false);

  useEffect(() => setShowModal(isGaveOver), [isGaveOver]);

  useEffect(() => {
    dispatch(loadGame());
  }, [dispatch]);

  return (
    <div className={styles['layout']}>
      <div className={styles['content']}>
        <Board />
        <ControlPanel />
      </div>
      {showModal && <PopupGameOver onClose={() => setShowModal(false)} />}
      <div className={styles['background']}>
        <div className={styles['skylines']}></div>
      </div>
    </div>
  );
}

export default App;
