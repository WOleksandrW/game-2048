import { ReactNode, useMemo } from 'react';

import styles from './Button.module.scss';

interface ButtonProps {
  onClick?: () => void;
  children?: ReactNode;
  className?: string;
  btnType?: 'square';
  isBtnPressed?: boolean;
}

export default function Button(props: ButtonProps) {
  const { children, className, btnType, isBtnPressed, ...rest } = props;

  const classNameElem = useMemo(() => {
    let str = styles['button'];
    if (btnType) str += ` ${styles[btnType]}`;
    if (className) str += ` ${className}`;
    if (isBtnPressed) str += ` ${styles['pressed']}`;
    return str;
  }, [className, btnType, isBtnPressed]);

  return (
    <button className={classNameElem} {...rest}>
      {children}
    </button>
  );
}
