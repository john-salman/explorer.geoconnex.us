import { fireEvent, render, screen } from '@testing-library/react';
import IconButton from '../IconButton';
import MapIcon from '@/app/assets/icons/MapIcon';

describe('Common Components: IconButton', () => {
    test('renders the button with children', () => {
        render(<IconButton handleClick={() => {}}>Icon</IconButton>);
        const buttonElement = screen.getByRole('button');
        expect(buttonElement).toBeInTheDocument();
        expect(buttonElement).toHaveTextContent('Icon');
    });

    test('renders the button with svg', () => {
        render(
            <IconButton handleClick={() => {}}>
                <MapIcon />
            </IconButton>
        );
        const buttonElement = screen.getByRole('button');
        const svgElement = screen.getByTestId('map-icon');
        expect(buttonElement).toBeInTheDocument();
        expect(svgElement).toBeInTheDocument();
    });

    test('calls handleClick when clicked', () => {
        const handleClick = jest.fn();
        render(<IconButton handleClick={handleClick}>Icon</IconButton>);
        const buttonElement = screen.getByRole('button');
        fireEvent.click(buttonElement);
        expect(handleClick).toHaveBeenCalledTimes(1);
    });

    test('does not call handleClick when disabled', () => {
        const handleClick = jest.fn();
        render(
            <IconButton handleClick={handleClick} disabled>
                Icon
            </IconButton>
        );
        const buttonElement = screen.getByRole('button');
        fireEvent.click(buttonElement);
        expect(handleClick).not.toHaveBeenCalled();
    });

    test('applies the disabled class when disabled', () => {
        render(
            <IconButton handleClick={() => {}} disabled>
                Icon
            </IconButton>
        );
        const buttonElement = screen.getByRole('button');
        expect(buttonElement).toHaveClass('opacity-50');
        expect(buttonElement).toHaveClass('cursor-not-allowed');
    });

    test('sets the title attribute when provided', () => {
        render(
            <IconButton handleClick={() => {}} title="Button Title">
                Icon
            </IconButton>
        );
        const buttonElement = screen.getByRole('button');
        expect(buttonElement).toHaveAttribute('title', 'Button Title');
    });
});
