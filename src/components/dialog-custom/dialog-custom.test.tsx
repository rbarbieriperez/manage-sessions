import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import DialogCustom from './dialog-custom';

test('The component is rendered with its full configuration', () => {
    const { getByText } = render(<DialogCustom
        open={true}
        acceptButtonText='Accept'
        rejectButtonText='Reject'
        modalTitle='Modal Title'
        modalDesc='Modal Desc'
        onButtonAcceptClick={() => {}}
        onButtonRejectClick={() => {}}
        onModalClose={() => {}}
        key={'modal-key'}
    />);


    expect(getByText('Accept')).toBeInTheDocument;
    expect(getByText('Reject')).toBeInTheDocument;
    expect(getByText('Modal Title')).toBeInTheDocument;
    expect(getByText('Modal Desc')).toBeInTheDocument;
});

test('Cliking on the accept button should close the modal', () => {
    const { getByText } = render(<DialogCustom
        open={true}
        acceptButtonText='Accept'
        rejectButtonText='Reject'
        modalTitle='Modal Title'
        modalDesc='Modal Desc'
        onButtonAcceptClick={() => {}}
        onButtonRejectClick={() => {}}
        onModalClose={() => {}}
        key={'modal-key'}
    />);

    const buttonElement = getByText('Accept');
    fireEvent.click(buttonElement);

    expect(buttonElement).not.toBeVisible;
});

test('Cliking on reject button should close the modal', () => {
    const { getByText } = render(<DialogCustom
        open={true}
        acceptButtonText='Accept'
        rejectButtonText='Reject'
        modalTitle='Modal Title'
        modalDesc='Modal Desc'
        onButtonAcceptClick={() => {}}
        onButtonRejectClick={() => {}}
        onModalClose={() => {}}
        key={'modal-key'}
    />);

    const buttonElement = getByText('Reject');
    fireEvent.click(buttonElement);

    expect(buttonElement).not.toBeVisible;
});

test('Cliking on accept button should call the onButtonAceptClick callback', () => {
    const acceptButtonFn = jest.fn();
    const { getByText } = render(<DialogCustom
        open={true}
        acceptButtonText='Accept'
        rejectButtonText='Reject'
        modalTitle='Modal Title'
        modalDesc='Modal Desc'
        onButtonAcceptClick={acceptButtonFn}
        onButtonRejectClick={() => {}}
        onModalClose={() => {}}
        key={'modal-key'}
    />);

    const buttonElement = getByText('Accept');
    fireEvent.click(buttonElement);

    expect(acceptButtonFn).toHaveBeenCalledTimes(1);
});

test('Cliking on reject button should call the onButtonAceptClick callback', () => {
    const rejectButtonFn = jest.fn();
    const { getByText } = render(<DialogCustom
        open={true}
        acceptButtonText='Accept'
        rejectButtonText='Reject'
        modalTitle='Modal Title'
        modalDesc='Modal Desc'
        onButtonAcceptClick={() => {}}
        onButtonRejectClick={rejectButtonFn}
        onModalClose={() => {}}
        key={'modal-key'}
    />);

    const buttonElement = getByText('Reject');
    fireEvent.click(buttonElement);

    expect(rejectButtonFn).toHaveBeenCalledTimes(1);
});

test('If the onModalClose property exists, it should being called when closing the modal', () => {
    const onModalCloseFn = jest.fn();
    const { getByText } = render(<DialogCustom
        open={true}
        acceptButtonText='Accept'
        rejectButtonText='Reject'
        modalTitle='Modal Title'
        modalDesc='Modal Desc'
        onButtonAcceptClick={() => {}}
        onButtonRejectClick={() => {}}
        onModalClose={onModalCloseFn}
        key={'modal-key'}
    />);

    const buttonElement = getByText('Reject');
    fireEvent.keyDown(buttonElement, { key: 'Escape', code: 'Escape' });

    expect(onModalCloseFn).toHaveBeenCalledTimes(1);
});