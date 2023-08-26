import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import ClinicContactDetails from './clinic-contact-details';
import { TContactDetail, TOption } from '../../types/types';


const optionsArray:Array<TOption> = [
    {
        value: 1,
        label: 'Correo'
    },
    {
        value: 2,
        label: 'Celular'
    },
    {
        value: 3,
        label: 'Sitio Web'
    }
];

const modifyData:TContactDetail = {
    contactDetail: '099999999',
    contactType: 'Celular',
    contactMethodInfo: 'test'
}

test('Two inputs should be rendered', () => {
    const { getAllByRole } = render(<ClinicContactDetails id={1} options={optionsArray} onDataChanged={() => {}}/>);
    const inputElements = getAllByRole('textbox');
    expect(inputElements.length).toBe(2);
    inputElements.forEach((inputElement) => expect(inputElement).toBeInTheDocument);
});

test('One select should be rendered', () => {
    const { queryByTestId  } = render(<ClinicContactDetails id={1} options={optionsArray} onDataChanged={() => {}}/>);
    const selectElement = queryByTestId('select-custom');
    expect(selectElement).toBeInTheDocument;
});

test('Typing on description input should trigger the onDataChange function', () => {
    const mockDataChangeFn = jest.fn();
    const { getAllByRole } = render(<ClinicContactDetails id={1} options={optionsArray} onDataChanged={mockDataChangeFn}/>)

    const inputElements = getAllByRole('textbox');

    fireEvent.change(inputElements[0], { target: { value: 'Celular' } })

    expect(mockDataChangeFn).toHaveBeenCalledWith({
        "contactDetail": "",
        "contactMethodInfo": "Celular",
        "contactType": "",
    }, 1);
});

test('Selecting an option of the select should trigger the onDataChange function', () => {
    const mockDataChangeFn = jest.fn();
    const { queryByTestId, getByLabelText } = render(<ClinicContactDetails id={1} options={optionsArray} onDataChanged={mockDataChangeFn}/>)

    const selectElement = queryByTestId('select-custom');
    


    if (selectElement) {
        fireEvent.click(selectElement);

        const optionElement = getByLabelText('Correo');

        fireEvent.click(optionElement);

        expect(mockDataChangeFn).toHaveBeenCalledWith({
            "contactDetail": "",
            "contactMethodInfo": "",
            "contactType": "Correo",
        }, 1);
    }
});

test('selecting an option that does not exist should not trigger the onDataChange function', () => {
    const mockDataChangeFn = jest.fn();
    const { queryByTestId, getByLabelText } = render(<ClinicContactDetails id={1} options={optionsArray} onDataChanged={mockDataChangeFn}/>)

    const selectElement = queryByTestId('select-custom');
    if (selectElement) {
        fireEvent.click(selectElement);

        const optionElement = getByLabelText('test');

        expect(optionElement).not.toBeInTheDocument;
    }
});

test('Typing on value input should trigger the onDataChange function', () => {
    const mockDataChangeFn = jest.fn();
    const { getAllByRole } = render(<ClinicContactDetails id={1} options={optionsArray} onDataChanged={mockDataChangeFn}/>)

    const inputElements = getAllByRole('textbox');

    fireEvent.change(inputElements[1], { target: { value: '09999999999' } })

    expect(mockDataChangeFn).toHaveBeenCalledWith({
        "contactDetail": "09999999999",
        "contactMethodInfo": "",
        "contactType": "",
    }, 1);
});


test('If the modifyData property is defined the component should load with the data populated', () => {
    const { getByDisplayValue, getByText } = render(<ClinicContactDetails onDataChanged={() => {}} id={1} options={optionsArray} modifyData={modifyData}/>);

    const descInput = getByDisplayValue('test');
    const typeSelect = getByText('Celular');
    const detailInput = getByDisplayValue('099999999');

    expect(descInput).toBeInTheDocument;
    expect(typeSelect).toBeInTheDocument;
    expect(detailInput).toBeInTheDocument;

});