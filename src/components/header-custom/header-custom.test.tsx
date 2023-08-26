import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import HeaderCustom from './header-custom';


test('Header should render the title if exists', () => {
    const { getByText } = render(<HeaderCustom
        headerTitle='headerTitle'
    />);

    expect(getByText('headerTitle')).toBeInTheDocument;
});

test('Header should not render the title if is missing', () => {
    const { getByTestId } = render(<HeaderCustom/>);

    expect(getByTestId('header-title')).not.toBeInTheDocument;
});

test('If the onMenuClick exists it should being called with clicking the menu button', () => {
    const menuFn = jest.fn();
    const { getByTestId } = render(<HeaderCustom onMenuClick={menuFn}/>);

    const menuButton = getByTestId('menu-button');
    fireEvent.click(menuButton);

    expect(menuFn).toHaveBeenCalledTimes(1);
});