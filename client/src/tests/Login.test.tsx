import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
// import Login from '../routes/Login';
import App from '../App';
import exp from 'constants';
import userEvent from '@testing-library/user-event';

import axios, { AxiosStatic } from 'axios';
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<AxiosStatic>;

test('Login screen should display its necessary form', () => {
  render(<App />);
  const emailInput = screen.getByPlaceholderText(/Email/);
  const passwordInput = screen.getByPlaceholderText(/Password/);
  const rememmberBtn = screen.getByText(/Remember me/);
  const loginBtn = screen.getByDisplayValue(/Login/);
  const registerLink = screen.getByText(/Register account/);

  expect(emailInput).toBeInTheDocument();
  expect(emailInput).toBeRequired();
  expect(passwordInput).toBeInTheDocument();
  expect(passwordInput).toBeRequired();
  expect(rememmberBtn).toBeInTheDocument();
  expect(loginBtn).toBeInTheDocument();
  expect(loginBtn).toBeEnabled();
  expect(registerLink).toBeInTheDocument();
});

// test('Login should work', async () => {
//     mockedAxios.post.mockResolvedValue({
//       status: 200,
//       data: ""
//     });
//     render(<App />);
//     const emailInput = screen.getByPlaceholderText(/Email/);
//     const passwordInput = screen.getByPlaceholderText(/Password/);
//     const loginBtn = screen.getAllByText(/Login/)[1];

//     await userEvent.type(emailInput, "t");
//     await userEvent.type(passwordInput, "t");
//     await fireEvent.click(loginBtn);

//     expect(screen.getByText(/Gurbi/)).toBeInTheDocument();
//     // expect(screen.getByText(/Login/)).not.toBeInTheDocument();
// });