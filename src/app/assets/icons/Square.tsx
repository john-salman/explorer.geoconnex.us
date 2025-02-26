import React from 'react';

type Props = {
    color: string;
};

const FilledSquare: React.FC<Props> = ({ color = 'black' }) => (
    <svg height="30" width="30">
        <rect width="30" height="30" fill={color} />
    </svg>
);

export default FilledSquare;
