import React from "react";
import { render, fireEvent } from '@testing-library/react';
import HelperScreen from "./helper-screen";

test('Two messages should be rendered', () => {
    const { getAllByTestId } = render(<HelperScreen/>);
    expect(getAllByTestId('text').length).toBe(2);
});
