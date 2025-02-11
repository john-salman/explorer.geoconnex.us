import React from 'react';

type Props = {
    color: string;
};

const HorizontalLine: React.FC<Props> = ({ color = 'black' }) => (
    <svg height="10" width="30">
        <line x1="0" y1="5" x2="30" y2="5" stroke={color} strokeWidth="6" />
    </svg>
);

export default HorizontalLine;
