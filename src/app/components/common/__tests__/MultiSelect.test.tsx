import { fireEvent, render, screen } from '@testing-library/react';
import MultiSelect from '../MultiSelect';

describe('Common Components: MultiSelect', () => {
    const options = ['Option 1', 'Option 2', 'Option 3'];
    const selectedOptions = ['Option 1'];
    const handleOptionClick = jest.fn();

    test('renders the button with "Select..." text initially', () => {
        render(
            <MultiSelect
                options={options}
                selectedOptions={selectedOptions}
                handleOptionClick={handleOptionClick}
            />
        );
        const buttonElement = screen.getByRole('button');
        expect(buttonElement).toBeInTheDocument();
        expect(buttonElement).toHaveTextContent('Select...');
    });

    test('toggles the options display when the button is clicked', () => {
        render(
            <MultiSelect
                options={options}
                selectedOptions={selectedOptions}
                handleOptionClick={handleOptionClick}
            />
        );
        const buttonElement = screen.getByRole('button');
        fireEvent.click(buttonElement);
        expect(buttonElement).toHaveTextContent('Click to Close');
        const optionsList = screen.getByRole('listbox');
        expect(optionsList).toBeInTheDocument();
        fireEvent.click(buttonElement);
        expect(buttonElement).toHaveTextContent('Select...');
    });

    test('renders the options correctly', () => {
        render(
            <MultiSelect
                options={options}
                selectedOptions={selectedOptions}
                handleOptionClick={handleOptionClick}
            />
        );
        const buttonElement = screen.getByRole('button');
        fireEvent.click(buttonElement);
        options.forEach((option) => {
            const optionElement = screen.getByText(option);
            expect(optionElement).toBeInTheDocument();
        });
    });

    test('calls handleOptionClick when an option is clicked', () => {
        render(
            <MultiSelect
                options={options}
                selectedOptions={selectedOptions}
                handleOptionClick={handleOptionClick}
            />
        );
        const buttonElement = screen.getByRole('button');
        fireEvent.click(buttonElement);
        const optionElement = screen.getByText('Option 2');
        fireEvent.click(optionElement);
        expect(handleOptionClick).toHaveBeenCalledWith('Option 2');
    });

    test('checks the checkbox for selected options', () => {
        render(
            <MultiSelect
                options={options}
                selectedOptions={selectedOptions}
                handleOptionClick={handleOptionClick}
            />
        );
        const buttonElement = screen.getByRole('button');
        fireEvent.click(buttonElement);
        const checkbox = screen.getByTestId('Option 1') as HTMLInputElement;
        expect(checkbox.checked).toBe(true);
    });

    test('unchecks the checkbox for unselected options', () => {
        render(
            <MultiSelect
                options={options}
                selectedOptions={selectedOptions}
                handleOptionClick={handleOptionClick}
            />
        );
        const buttonElement = screen.getByRole('button');
        fireEvent.click(buttonElement);
        const checkbox = screen.getByTestId('Option 2') as HTMLInputElement;
        expect(checkbox.checked).toBe(false);
    });
});
