import React from 'react';
import { render, fireEvent, getByRole, within, screen } from '@testing-library/react';
import ContactDetails from './patient-contact-details';
import { TFamily } from '../../types/types';


const modifyData:TFamily = {
    name: 'nameTest',
    surname: 'surnameTest',
    contactDetail: 'contactDetailTest',
    contactType: 'contactTypeTest',
    lastSurname: 'lastSurnameTest',
    relationType: 'relationTypeTest'
}


test('4 inputs should be rendered', () => {
    const { getAllByRole } = render(<ContactDetails
        	id={1}
            onDataChanged={() => {}}
            key={'key'}
    />);

    const inputs = getAllByRole('textbox');

    expect(inputs.length).toBe(4);
});

test('Selecting a relation type should be reflected on the onDataChanged payload', () => {
    const dataChangedFn = jest.fn();
    const { getAllByTestId } = render(<ContactDetails
        id={1}
        key={'key'}
        onDataChanged={dataChangedFn}
    />);

    const selectEls = getAllByTestId('select-custom');

    if (selectEls.length > 0) {
        fireEvent.mouseDown(getByRole(selectEls[0], "button"));

        const listBox = within(screen.getByRole("listbox"));
        fireEvent.click(listBox.getByText(/Padre/i));
        expect(dataChangedFn).toHaveBeenCalledWith({
            name: '',
            surname: '',
            contactDetail: '',
            contactType: '',
            lastSurname: '',
            relationType: 'Padre'
        }, 1);
    }
});

test('Typing on the Nombre* input should be reflected on the onDataChanged payload', () => {
    const dataChangedFn = jest.fn();
    const { getAllByRole } = render(<ContactDetails
        id={1}
        key={'key'}
        onDataChanged={dataChangedFn}
    />);

    const inputEls = getAllByRole('textbox');

    if (inputEls.length > 0) {
        fireEvent.change(inputEls[0], { target: { value: 'test' }});
        expect(dataChangedFn).toHaveBeenCalledWith({
            name: 'test',
            surname: '',
            contactDetail: '',
            contactType: '',
            lastSurname: '',
            relationType: ''
        }, 1);
    }
});

test('Typing on the Primer Apellido* input should be reflected on the onDataChanged payload', () => {
    const dataChangedFn = jest.fn();
    const { getAllByRole } = render(<ContactDetails
        id={1}
        key={'key'}
        onDataChanged={dataChangedFn}
    />);

    const inputEls = getAllByRole('textbox');

    if (inputEls.length > 0) {
        fireEvent.change(inputEls[1], { target: { value: 'test' }});
        expect(dataChangedFn).toHaveBeenCalledWith({
            name: '',
            surname: 'test',
            contactDetail: '',
            contactType: '',
            lastSurname: '',
            relationType: ''
        }, 1);
    }
});

test('Typing on the Segundo Apellido* input should be reflected on the onDataChanged payload', () => {
    const dataChangedFn = jest.fn();
    const { getAllByRole } = render(<ContactDetails
        id={1}
        key={'key'}
        onDataChanged={dataChangedFn}
    />);

    const inputEls = getAllByRole('textbox');

    if (inputEls.length > 0) {
        fireEvent.change(inputEls[2], { target: { value: 'test' }});
        expect(dataChangedFn).toHaveBeenCalledWith({
            name: '',
            surname: '',
            contactDetail: '',
            contactType: '',
            lastSurname: 'test',
            relationType: ''
        }, 1);
    }
});

test('Selecting a contact type should be reflected on the onDataChanged payload', () => {
    const dataChangedFn = jest.fn();
    const { getAllByTestId } = render(<ContactDetails
        id={1}
        key={'key'}
        onDataChanged={dataChangedFn}
    />);

    const selectEls = getAllByTestId('select-custom');

    if (selectEls.length > 0) {
        fireEvent.mouseDown(getByRole(selectEls[1], "button"));

        const listBox = within(screen.getByRole("listbox"));
        fireEvent.click(listBox.getByText(/Celular/i));
        expect(dataChangedFn).toHaveBeenCalledWith({
            name: '',
            surname: '',
            contactDetail: '',
            contactType: 'Celular',
            lastSurname: '',
            relationType: ''
        }, 1);
    }
});

test('Typing on the Valor* input should be reflected on the onDataChanged payload', () => {
    const dataChangedFn = jest.fn();
    const { getAllByRole } = render(<ContactDetails
        id={1}
        key={'key'}
        onDataChanged={dataChangedFn}
    />);

    const inputEls = getAllByRole('textbox');

    if (inputEls.length > 0) {
        fireEvent.change(inputEls[3], { target: { value: 'test' }});
        expect(dataChangedFn).toHaveBeenCalledWith({
            name: '',
            surname: '',
            contactDetail: 'test',
            contactType: '',
            lastSurname: '',
            relationType: ''
        }, 1);
    }
});

test('If modifyData property is filled the onDataChange payload should contain it', () => {
    const dataChangedFn = jest.fn();
    const { getAllByRole } = render(<ContactDetails
        id={1}
        key={'key'}
        onDataChanged={dataChangedFn}
        modifyData={modifyData}
    />);

    const inputEls = getAllByRole('textbox');

    if (inputEls.length > 0) {
        fireEvent.change(inputEls[0], { target: { value: 'nameTest' }});
        expect(dataChangedFn).toHaveBeenCalledWith(modifyData, 1);
    }
});