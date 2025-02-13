import { fireEvent, render, screen } from '@testing-library/react';
import CloseButton from '../CloseButton';

describe('Common Components: CloseButton', () => {
    test('renders the close button', () => {
        render(<CloseButton handleClick={() => {}} />);
        const buttonElement = screen.getByRole('button');
        expect(buttonElement).toBeInTheDocument();
    });

    test('calls handleClick when clicked', () => {
        const handleClick = jest.fn();
        render(<CloseButton handleClick={handleClick} />);
        const buttonElement = screen.getByRole('button');
        fireEvent.click(buttonElement);
        expect(handleClick).toHaveBeenCalledTimes(1);
    });

    test('renders the SVG icon', () => {
        render(<CloseButton handleClick={() => {}} />);
        const svgElement = screen.getByTestId('close-button-icon');
        expect(svgElement).toBeInTheDocument();
    });
});
