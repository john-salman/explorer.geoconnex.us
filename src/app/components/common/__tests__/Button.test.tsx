import { fireEvent, render, screen } from '@testing-library/react';
import Button from '../Button';

describe('Common: Button', () => {
    test('renders the button with children', () => {
        render(<Button handleClick={() => {}}>Click Me</Button>);
        const buttonElement = screen.getByText(/Click Me/i);
        expect(buttonElement).toBeInTheDocument();
    });

    test('calls handleClick when clicked', () => {
        const handleClick = jest.fn();
        render(<Button handleClick={handleClick}>Click Me</Button>);
        const buttonElement = screen.getByText(/Click Me/i);
        fireEvent.click(buttonElement);
        expect(handleClick).toHaveBeenCalledTimes(1);
    });
});
