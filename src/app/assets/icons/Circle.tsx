import React from 'react';

type Props = {
    color: string;
};

const Circle: React.FC<Props> = ({ color = 'black' }) => (
    <svg height="30" width="30">
        <circle cx="15" cy="15" r="10" fill={color} />
    </svg>
);

export default Circle;
