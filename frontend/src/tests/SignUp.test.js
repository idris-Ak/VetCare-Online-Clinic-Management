import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import SignUp from './pages/SignUp';
import '@testing-library/jest-dom/extend-expect';

describe('SignUp Component', () => {
  beforeEach(() => {
    // Mock localStorage for users
    jest.spyOn(Storage.prototype, 'setItem');
    jest.spyOn(Storage.prototype, 'getItem').mockReturnValue(JSON.stringify([]));
  });

  afterEach(() => {
    localStorage.setItem.mockRestore();
    localStorage.getItem.mockRestore();
  });

  test('renders signup form with role selection', () => {
    render(<SignUp />);
    expect(screen.getByText('SignUp To VetCare')).toBeInTheDocument();
    expect(screen.getByText(/Choose Your Role/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Confirm Password/i)).toBeInTheDocument();
  });

  test('allows user to sign up as pet owner with valid details', async () => {
    render(<SignUp />);

    fireEvent.change(screen.getByLabelText(/Name/i), {
      target: { value: 'John Doe' },
    });
    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: 'john@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/Password/i), {
      target: { value: 'StrongPassword123!' },
    });
    fireEvent.change(screen.getByLabelText(/Confirm Password/i), {
      target: { value: 'StrongPassword123!' },
    });

    fireEvent.click(screen.getByText('Sign Up'));

    // Mock API response
    await waitFor(() => {
      expect(screen.getByText(/SignUp Successful!/i)).toBeInTheDocument();
    });
  });

  test('displays error for invalid email format', async () => {
    render(<SignUp />);

    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: 'invalid-email' },
    });
    fireEvent.click(screen.getByText('Sign Up'));

    expect(
      await screen.findByText(/Enter a valid email/i)
    ).toBeInTheDocument();
  });

  test('displays error for weak password', async () => {
    render(<SignUp />);

    fireEvent.change(screen.getByLabelText(/Password/i), {
      target: { value: '123' },
    });
    fireEvent.click(screen.getByText('Sign Up'));

    expect(
      await screen.findByText(/Your password must be at least 8 characters/i)
    ).toBeInTheDocument();
  });

  test('displays error for mismatched passwords', async () => {
    render(<SignUp />);

    fireEvent.change(screen.getByLabelText(/Password/i), {
      target: { value: 'StrongPassword123!' },
    });
    fireEvent.change(screen.getByLabelText(/Confirm Password/i), {
      target: { value: 'WrongPassword!' },
    });

    fireEvent.click(screen.getByText('Sign Up'));

    expect(
      await screen.findByText(/Passwords do not match/i)
    ).toBeInTheDocument();
  });

  test('displays error for missing required fields', async () => {
    render(<SignUp />);

    fireEvent.click(screen.getByText('Sign Up'));

    expect(
      await screen.findByText(/Please fill in this field./i)
    ).toBeInTheDocument();
  });

  test('displays error when email is already registered', async () => {
    // Simulate existing user in localStorage
    const mockUsers = [{ email: 'existinguser@example.com', password: 'StrongPassword123!' }];
    jest.spyOn(Storage.prototype, 'getItem').mockReturnValue(JSON.stringify(mockUsers));

    render(<SignUp />);

    fireEvent.change(screen.getByLabelText(/Name/i), {
      target: { value: 'Jane Doe' },
    });
    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: 'existinguser@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/Password/i), {
      target: { value: 'StrongPassword123!' },
    });
    fireEvent.change(screen.getByLabelText(/Confirm Password/i), {
      target: { value: 'StrongPassword123!' },
    });

    fireEvent.click(screen.getByText('Sign Up'));

    expect(
      await screen.findByText(/An account with this email already exists/i)
    ).toBeInTheDocument();
  });
});
