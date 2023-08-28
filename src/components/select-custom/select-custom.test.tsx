import React from "react";
import { render, fireEvent, getByRole, within, screen } from '@testing-library/react';
import SelectCustom from "./select-custom";
import { TOption } from "../../types/types";


const optionsArray:Array<TOption> = [
    {
        label: 'Option 1',
        value: 1
    },
    {
        label: 'Option 2',
        value: 2
    }
];

test('One Material UI select should be rendered', () => {
    const { getByTestId } = render(<SelectCustom
        label="label"
        onChange={() => {}}
        optionsArr={optionsArray}
    />);

    expect(getByTestId('select-custom')).toBeInTheDocument;
});

test('Selecting an option should trigger the onChange function', () => {
    const onChangeFn = jest.fn();
    const { getByTestId } = render(<SelectCustom
        label="label"
        onChange={onChangeFn}
        optionsArr={optionsArray}
        id="select"
    />);

    const select = getByRole(getByTestId('select-custom'), "button");

    if (select) {
        fireEvent.mouseDown(select);

        const listBox = within(screen.getByRole('listbox'));
        fireEvent.click(listBox.getByText(/Option 1/i));

        expect(onChangeFn).toHaveBeenCalledWith(1, "select");
    }
});

test('if value equals zero and showZeroValue the input should be empty', () => {
    const { getByTestId } = render(<SelectCustom
        label="label"
        onChange={() => {}}
        optionsArr={optionsArray}
        showZeroValue={false}
        value="0"
    />);

    const select = getByRole(getByTestId('select-custom'), "button");

    if (select) {
        fireEvent.mouseDown(select);

        const listBox = within(screen.getByRole('listbox'));

        expect(listBox.getByText(/Option 1/i)).not.toBeVisible;
    }
});

test('if value not equals zero is shown in the input', () => {
    const { getByTestId } = render(<SelectCustom
        label="label"
        onChange={() => {}}
        optionsArr={optionsArray}
        showZeroValue={false}
        value="2"
    />);

    const select = getByRole(getByTestId('select-custom'), "button");

    if (select) {
        fireEvent.mouseDown(select);

        const listBox = within(screen.getByRole('listbox'));

        expect(listBox.getByText(/Option 2/i)).toBeVisible;
    }
});