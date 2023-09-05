import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import DateFilter from './date-filter';


test('2 DatePicker elements are beign rendered', () => {
    const { getAllByRole } = render(<DateFilter
        onInitialDateChanged={() => {}}
        onLastDateChanged={() => {}}
    />);

    const datePickers = getAllByRole('textbox');
    expect(datePickers.length).toBe(2);
});

test('Initial datepicker should start with the first day of the month', () => {
    const { getAllByRole } = render(<DateFilter
        onInitialDateChanged={() => {}}
        onLastDateChanged={() => {}}
    />);

    const datePickers = getAllByRole('textbox');
    const text = `01/0${new Date().getUTCMonth() + 1}/${new Date().getUTCFullYear()}`;
    expect(datePickers[0].getAttribute('value')).toBe(text);
});

test('Last datepicker should start with the current day of the month', () => {
    const { getAllByRole } = render(<DateFilter
        onInitialDateChanged={() => {}}
        onLastDateChanged={() => {}}
    />);

    const datePickers = getAllByRole('textbox');
    const text = `0${new Date().getUTCDate()}/0${new Date().getUTCMonth() + 1}/${new Date().getUTCFullYear()}`;
    expect(datePickers[1].getAttribute('value')).toBe(text);
});

test('onInitialDateChanged method should be called with the selected initial date', () => {
    const mockFn = jest.fn();
    render(<DateFilter
        onInitialDateChanged={mockFn}
        onLastDateChanged={() => {}}
    />);

    const text = `01/0${new Date().getUTCMonth() + 1}/${new Date().getUTCFullYear()}`;
    expect(mockFn).toHaveBeenCalledWith(text);
});


test('onLastDateChanged method should be called with the selected last date', () => {
    const mockFn = jest.fn();
    render(<DateFilter
        onInitialDateChanged={() => {}}
        onLastDateChanged={mockFn}
    />);

    const text = `0${new Date().getUTCDate()}/0${new Date().getUTCMonth() + 1}/${new Date().getUTCFullYear()}`;
    expect(mockFn).toHaveBeenCalledWith(text);
});

test('Selected a new initial date should trigger the onInitialDateChanged', () => {
    const mockFn = jest.fn();
    render(<DateFilter
        onInitialDateChanged={mockFn}
        onLastDateChanged={() => {}}
    />);
    const text = `01/0${new Date().getUTCMonth() + 1}/${new Date().getUTCFullYear()}`;
    const datePicker = screen.getByDisplayValue(text);
    
    fireEvent.change(datePicker, `05/0${new Date().getUTCMonth() + 1}/${new Date().getUTCFullYear()}`);

    expect(mockFn).toHaveBeenCalledWith(text);
});