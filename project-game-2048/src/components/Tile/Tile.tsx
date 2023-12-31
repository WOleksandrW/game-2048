import { useMemo } from 'react';

import { moveTilesDelay, distBetweenTiles } from '../../data';
import { TilePosType } from '../../types/TileTypes';

import styles from './Tile.module.scss';

interface TileProps {
  value?: number;
  color?: string;
  isNew?: boolean;
  movePos?: TilePosType;
}

export default function Tile(props: TileProps) {
  const className = useMemo(() => {
    let str = styles['tile'];
    if (props.isNew) str += ` ${styles['new']}`;
    return str;
  }, [props.isNew]);

  const styleMoveAnimation = useMemo(() => {
    if (props.movePos) {
      const { row, col } = props.movePos;
      const colPx = distBetweenTiles * col;
      const rowPx = distBetweenTiles * row;
      const colCalc = `calc(${col * 100 - 50}% + ${colPx}px)`;
      const rowCalc = `calc(${row * 100 - 50}% + ${rowPx}px)`;
      return {
        transform: `translate(${colCalc}, ${rowCalc})`,
        transition: `transform ${moveTilesDelay}s ease`
      };
    }
  }, [props.movePos]);

  return (
    <div className={styles['tile-block']}>
      {!!props.value && (
        <div
          className={className}
          style={{
            backgroundColor: props.color,
            ...styleMoveAnimation
          }}>
          {props.value}
        </div>
      )}
    </div>
  );
}
