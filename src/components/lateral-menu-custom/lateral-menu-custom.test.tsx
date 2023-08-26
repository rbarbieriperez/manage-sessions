import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import LateralMenuCustom from './LateralMenuCustom';


test('5 menu items should be rendered', () => {
    const { getAllByTestId } = render(<LateralMenuCustom
        menuItemSelected={() => {}}
        open={true}
        key={'key'}
    />);

    expect(getAllByTestId('menu-item').length).toBe(5);
});

test('Cliking on button 1 should call menuItemSelected with "home"', () => {
    const buttonFn = jest.fn();
    const { getAllByTestId } = render(<LateralMenuCustom
        menuItemSelected={buttonFn}
        open={true}
        key={'key'}
    />);
    const buttons = getAllByTestId('menu-item');
    fireEvent.click(buttons[0]);
    expect(buttonFn).toHaveBeenCalledWith('home');
});

test('Cliking on button 2 should call menuItemSelected with "manage-clinics"', () => {
    const buttonFn = jest.fn();
    const { getAllByTestId } = render(<LateralMenuCustom
        menuItemSelected={buttonFn}
        open={true}
        key={'key'}
    />);
    const buttons = getAllByTestId('menu-item');
    fireEvent.click(buttons[1]);
    expect(buttonFn).toHaveBeenCalledWith('manage-clinics');
});

test('Cliking on button 3 should call menuItemSelected with "manage-patients"', () => {
    const buttonFn = jest.fn();
    const { getAllByTestId } = render(<LateralMenuCustom
        menuItemSelected={buttonFn}
        open={true}
        key={'key'}
    />);
    const buttons = getAllByTestId('menu-item');
    fireEvent.click(buttons[2]);
    expect(buttonFn).toHaveBeenCalledWith('manage-patients');
});

test('Cliking on button 4 should call menuItemSelected with "reports"', () => {
    const buttonFn = jest.fn();
    const { getAllByTestId } = render(<LateralMenuCustom
        menuItemSelected={buttonFn}
        open={true}
        key={'key'}
    />);
    const buttons = getAllByTestId('menu-item');
    fireEvent.click(buttons[3]);
    expect(buttonFn).toHaveBeenCalledWith('reports');
});

test('Cliking on button 5 should call menuItemSelected with "other-settings"', () => {
    const buttonFn = jest.fn();
    const { getAllByTestId } = render(<LateralMenuCustom
        menuItemSelected={buttonFn}
        open={true}
        key={'key'}
    />);
    const buttons = getAllByTestId('menu-item');
    fireEvent.click(buttons[4]);
    expect(buttonFn).toHaveBeenCalledWith('other-settings');
});

test('Clicking on a button should close the menu', () => {
    const { getAllByTestId, getByRole } = render(<LateralMenuCustom
        menuItemSelected={() => {}}
        open={true}
        key={'key'}
    />);
    const buttons = getAllByTestId('menu-item');
    fireEvent.click(buttons[0]);

    expect(getByRole('generic')).not.toBeVisible;
});

