import React from 'react';

export interface IfProps {
    condition: boolean;
    children: React.ReactElement;
}

export const If = ({ condition, children }: IfProps): React.ReactElement => (condition ? children : <></>);
