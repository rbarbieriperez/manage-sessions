import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import SpinnerCustom from './spinner-custom';


test('If the isVisible property is true the spinner is actually visible', () => {
    const { getByTestId } = render(<SpinnerCustom isVisible={true}/>);
    expect(getByTestId("spinner-container")).toBeVisible;
})

test('If the isVisible property is false the spinner is not visible', () => {
    const { getByTestId } = render(<SpinnerCustom isVisible={false}/>);
    expect(getByTestId("spinner-container")).not.toBeVisible;
});