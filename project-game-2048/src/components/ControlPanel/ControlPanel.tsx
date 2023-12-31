import { useEffect, useState } from 'react';
import { AnyAction, ThunkDispatch } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import { RootState } from '../../redux/store';
import { DirectionType, moveTiles, resetStates, saveGame } from '../../redux/boardSlice';
import { Button } from '../';

import { keysForBtn } from '../../data';

import {
  MdArrowDropDown,
  MdArrowDropUp,
  MdArrowLeft,
  MdArrowRight,
  MdOutlineRefresh,
  MdSave
} from 'react-icons/md';

import styles from './ControlPanel.module.scss';

export default function ControlPanel() {
  const dispatch: ThunkDispatch<RootState, undefined, AnyAction> = useDispatch();

  const [pressedBtn, setPressedBtn] = useState('');

  useEffect(() => {
    const miniHandler = (direction: DirectionType) => {
      setPressedBtn(direction);
      dispatch(moveTiles(direction));
    };

    const onKeyDownHandler = (event: KeyboardEvent) => {
      switch (true) {
        case keysForBtn['Top'].includes(event.code):
          miniHandler('Top');
          break;
        case keysForBtn['Left'].includes(event.code):
          miniHandler('Left');
          break;
        case keysForBtn['Right'].includes(event.code):
          miniHandler('Right');
          break;
        case keysForBtn['Bottom'].includes(event.code):
          miniHandler('Bottom');
          break;
      }
    };

    const onKeyUpHandler = (event: KeyboardEvent) => {
      const keys = [
        ...keysForBtn['Top'],
        ...keysForBtn['Left'],
        ...keysForBtn['Right'],
        ...keysForBtn['Bottom']
      ];
      if (keys.includes(event.code)) setPressedBtn('');
    };

    document.addEventListener('keydown', onKeyDownHandler);
    document.addEventListener('keyup', onKeyUpHandler);
    return () => {
      document.removeEventListener('keydown', onKeyDownHandler);
      document.removeEventListener('keyup', onKeyUpHandler);
    };
  }, [dispatch]);

  return (
    <div className={styles['control-panel']}>
      <div className={styles['btn-panel']}>
        <Button
          onClick={() => dispatch(moveTiles('Top'))}
          className={`${styles['btn']} ${styles['top']}`}
          btnType="square"
          isBtnPressed={pressedBtn === 'Top'}>
          <MdArrowDropUp />
        </Button>
        <Button
          onClick={() => dispatch(moveTiles('Left'))}
          className={`${styles['btn']} ${styles['left']}`}
          btnType="square"
          isBtnPressed={pressedBtn === 'Left'}>
          <MdArrowLeft />
        </Button>
        <Button
          onClick={() => dispatch(moveTiles('Right'))}
          className={`${styles['btn']} ${styles['right']}`}
          btnType="square"
          isBtnPressed={pressedBtn === 'Right'}>
          <MdArrowRight />
        </Button>
        <Button
          onClick={() => dispatch(moveTiles('Bottom'))}
          className={`${styles['btn']} ${styles['bottom']}`}
          btnType="square"
          isBtnPressed={pressedBtn === 'Bottom'}>
          <MdArrowDropDown />
        </Button>
      </div>
      <div className={styles['sub-block']}>
        <div className={styles['description']}>
          <p>You also can use:</p>
          <ul className={styles['list']}>
            <li>W, A, S, D</li>
            <li>Arrows</li>
          </ul>
        </div>
        <div className={styles['sub-btn-list']}>
          <Button onClick={() => dispatch(resetStates())} btnType="square">
            <MdOutlineRefresh />
          </Button>
          <Button onClick={() => dispatch(saveGame())} btnType="square">
            <MdSave />
          </Button>
        </div>
      </div>
    </div>
  );
}
