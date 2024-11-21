'use client';

import { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
}

function ExpenseListItem({ children, onClick, className }: Props) {
  const classString =
    className && className.trim().length ? ` ${className}` : '';

  return (
    <li
      className={`flex justify-between items-center rounded-md border-b p-6 hover:bg-slate-100${classString}`}
      onClick={onClick}
    >
      {children}
    </li>
  );
}

export default ExpenseListItem;
