import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import PatientData from './patient-data';
import { TPatient } from '../../types/types';

const modifyData:TPatient = {
    clinicId: 1,
    age: 18,
    family: [],
    lastSurname: 'lastSurnameTest',
    name: 'nameTest',
    patientId: 1,
    sessionTime: 60,
    sessionValue: 2000,
    surname: 'surnameTest'
}


test('5 inputs should be rendered', () => {
    const { getByLabelText } = render(<PatientData
        formSubmitted={false}
        onDataChanged={() => {}}
        onFormReset={() => {}}
    />);

    const nameEl = getByLabelText('Nombre*');
    expect(nameEl).toBeInTheDocument;

    const surnameEl = getByLabelText('Primer Apellido*');
    expect(surnameEl).toBeInTheDocument;

    const secondSurnameEl = getByLabelText('Segundo Apellido');
    expect(secondSurnameEl).toBeInTheDocument;

    const ageEl = getByLabelText('Edad*');
    expect(ageEl).toBeInTheDocument;

    const amountEl = getByLabelText('Monto*');
    expect(amountEl).toBeInTheDocument;
});

test('1 select should be rendered', () => {
    const { getAllByTestId } = render(<PatientData
        formSubmitted={false}
        onDataChanged={() => {}}
        onFormReset={() => {}}
    />);

    expect(getAllByTestId('select-custom').length).toBe(1);
});

test('Typing on the Nombre* input should trigger the onDataChanged with the new value', () => {
    const onDataChangeFn = jest.fn();
    const { getByTestId } = render(<PatientData
        formSubmitted={false}
        onDataChanged={onDataChangeFn}
        onFormReset={() => {}}
    />);

    const input = getByTestId('outlined-input').querySelector('input');

    if (input) {
        fireEvent.change(input, { target: { value: 'test' }});

        expect(onDataChangeFn).toHaveBeenCalledWith({
            patientId: 0,
            name: 'test',
            surname: '',
            lastSurname: '',
            age: 0,
            clinicId: 0,
            sessionTime: 0,
            sessionValue: 0,
            family: []
        });
    }
});

test('Typing on the Primer Apellido* input should trigger the onDataChanged with the new value', () => {
    const onDataChangeFn = jest.fn();
    const { getAllByRole } = render(<PatientData
        formSubmitted={false}
        onDataChanged={onDataChangeFn}
        onFormReset={() => {}}
    />);

    const inputs = getAllByRole('textbox');

    if (inputs.length > 0) {
        fireEvent.change(inputs[2], { target: { value: 'test' }});

        expect(onDataChangeFn).toHaveBeenCalledWith({
            patientId: 0,
            name: '',
            surname: 'test',
            lastSurname: '',
            age: 0,
            clinicId: 0,
            sessionTime: 0,
            sessionValue: 0,
            family: []
        });
    }
});

test('Typing on the Segundo Apellido* input should trigger the onDataChanged with the new value', () => {
    const onDataChangeFn = jest.fn();
    const { getAllByRole } = render(<PatientData
        formSubmitted={false}
        onDataChanged={onDataChangeFn}
        onFormReset={() => {}}
    />);

    const inputs = getAllByRole('textbox');

    if (inputs.length > 0) {
        fireEvent.change(inputs[3], { target: { value: 'test' }});

        expect(onDataChangeFn).toHaveBeenCalledWith({
            patientId: 0,
            name: '',
            surname: '',
            lastSurname: 'test',
            age: 0,
            clinicId: 0,
            sessionTime: 0,
            sessionValue: 0,
            family: []
        });
    }
});

test('Typing on the Edad* input should trigger the onDataChanged with the new value', () => {
    const onDataChangeFn = jest.fn();
    const { getAllByRole } = render(<PatientData
        formSubmitted={false}
        onDataChanged={onDataChangeFn}
        onFormReset={() => {}}
    />);

    const inputs = getAllByRole('textbox');

    if (inputs.length > 0) {
        fireEvent.change(inputs[4], { target: { value: '18' }});

        expect(onDataChangeFn).toHaveBeenCalledWith({
            patientId: 0,
            name: '',
            surname: '',
            lastSurname: '',
            age: 18,
            clinicId: 0,
            sessionTime: 0,
            sessionValue: 0,
            family: []
        });
    }
});

test('Typing on the Monto* input should trigger the onDataChanged with the new value', () => {
    const onDataChangeFn = jest.fn();
    const { getAllByRole } = render(<PatientData
        formSubmitted={false}
        onDataChanged={onDataChangeFn}
        onFormReset={() => {}}
    />);

    const inputs = getAllByRole('textbox');

    if (inputs.length > 0) {
        const testEl = inputs[5].querySelector('input');
        if (testEl)
        fireEvent.change(testEl, { target: { value: '1800' }});

        expect(onDataChangeFn).toHaveBeenCalledWith({
            patientId: 0,
            name: '',
            surname: '',
            lastSurname: '',
            age: 0,
            clinicId: 0,
            sessionTime: 0,
            sessionValue: 1800,
            family: []
        });
    }
});

test('Cliking on the form reset button should reset the form', () => {
    const { getByTestId, getByLabelText } = render(<PatientData
        formSubmitted={false}
        onDataChanged={() => {}}
        onFormReset={() => {}}
    />);

    const resetButton = getByTestId('reset-button');

    fireEvent.click(resetButton);

    expect(getByLabelText('Nombre*')).toBeVisible;
    expect(getByLabelText('Primer Apellido*')).toBeVisible;
    expect(getByLabelText('Segundo Apellido')).toBeVisible;
    expect(getByLabelText('Edad*')).toBeVisible;
    expect(getByLabelText('Monto*')).toBeVisible;
    expect(getByLabelText('Tiempo de Sesión')).toBeVisible;
});

test('If formSubmitted property if true the data is reseted and onDataChanged is not called', () => {
    const onDataChangeFn = jest.fn();
    render(<PatientData
        formSubmitted={true}
        onDataChanged={onDataChangeFn}
        onFormReset={() => {}}
    />);

    expect(onDataChangeFn).not.toHaveBeenCalled();
});

test('If the modifyData property exists, the data is returned on the onDataChange function', () => {
    const onDataChangeFn = jest.fn();
    const { getAllByRole } = render(<PatientData
        formSubmitted={true}
        onDataChanged={onDataChangeFn}
        onFormReset={() => {}}
        modifyData={modifyData}
    />);

    const inputs = getAllByRole('textbox');

    if (inputs.length > 0) {
        fireEvent.change(inputs[4], { target: { value: '18' }});

        expect(onDataChangeFn).toHaveBeenCalledWith(modifyData);
    }
});