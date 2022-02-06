import '@testing-library/jest-dom';
import React from 'React'
// import { render, screen } from '@testing-library/react';
import { render, screen, fireEvent } from '@testing-library/react';
// import LoginRegisterModal from './LoginRegisterModal';
import LoginForm from './LoginForm';

describe('Login', () => {
  it('It renders the modal when called', () => {
    render(<LoginForm/>)
    const button = screen.getByRole('button')
    fireEvent.click(button)
    expect('form').toBeInTheDocument()
    // const element = screen.getByText(/Login/i);
    // expect(element).toBeInTheDocument();
  })
})
