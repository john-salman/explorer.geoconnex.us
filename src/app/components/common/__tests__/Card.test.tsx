import { fireEvent, render, screen } from '@testing-library/react';
import Card from '../Card';

describe('Common Components: Card', () => {
    test('renders the card with children', () => {
        render(<Card>Card Content</Card>);
        const cardElement = screen.getByText(/Card Content/i);
        expect(cardElement).toBeInTheDocument();
    });

    test('renders the close button when handleClose is provided', () => {
        const handleClose = jest.fn();
        render(<Card handleClose={handleClose}>Card Content</Card>);
        const closeButton = screen.getByTestId('close-button');
        expect(closeButton).toBeInTheDocument();
    });

    test('does not render the close button when handleClose is not provided', () => {
        render(<Card>Card Content</Card>);
        const closeButton = screen.queryByTestId('close-button');
        expect(closeButton).not.toBeInTheDocument();
    });

    test('calls handleClose when the close button is clicked', () => {
        const handleClose = jest.fn();
        render(<Card handleClose={handleClose}>Card Content</Card>);
        const closeButton = screen.getByTestId('close-button');
        fireEvent.click(closeButton);
        expect(handleClose).toHaveBeenCalledTimes(1);
    });
});
