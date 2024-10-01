import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import Prescription from './pages/Prescriptionrefill/Prescription';
import '@testing-library/jest-dom/extend-expect';

describe('Prescription Component', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  test('renders prescription form', () => {
    render(<Prescription />);
    expect(
      screen.getByText('Request Prescription for Your Pet')
    ).toBeInTheDocument();
  });

  test('allows user to proceed to payment options', async () => {
    render(<Prescription />);

    // Select a pet
    fireEvent.click(screen.getAllByText('Select')[0]);

    // Fill out the prescription form
    fireEvent.change(screen.getByLabelText(/Prescription Detail/i), {
      target: { value: 'Medication for allergies' },
    });
    fireEvent.change(screen.getByLabelText(/Preferred Pharmacy/i), {
      target: { value: 'Pharmacy 1' },
    });
    fireEvent.change(screen.getByLabelText(/Preferred Pickup Date/i), {
      target: { value: '2023-12-31' },
    });
    fireEvent.change(screen.getByLabelText(/Preferred Pickup Time/i), {
      target: { value: '10:00' },
    });

    fireEvent.click(screen.getByText('Proceed To Payment'));

    expect(
      await screen.findByText('Select Payment Method')
    ).toBeInTheDocument();
  });

  test('displays both payment methods', async () => {
    render(<Prescription />);

    // Proceed to payment options as before
    fireEvent.click(screen.getByText('Proceed To Payment'));

    expect(
      await screen.findByText('Credit/Debit Card')
    ).toBeInTheDocument();
    expect(screen.getByText('Pay With PayPal')).toBeInTheDocument();
  });

  test('validates credit card inputs and shows errors', async () => {
    render(<Prescription />);

    // Proceed to credit card payment modal

    // Select Credit/Debit Card option
    fireEvent.click(screen.getByText('Credit/Debit Card'));

    // Leave card number empty and submit
    fireEvent.click(screen.getByText('Pay Now'));

    expect(
      await screen.findAllByText(/This field is required/i)
    ).toHaveLength(3); // Assuming all fields are required

    // Input invalid card number
    fireEvent.change(screen.getByLabelText(/Card Number/i), {
      target: { value: '1234-5678-9012-345' }, // Too short
    });
    fireEvent.change(screen.getByLabelText(/Expiry Date/i), {
      target: { value: '13/25' }, // Invalid month
    });
    fireEvent.change(screen.getByLabelText(/CVV/i), {
      target: { value: '99' }, // Too short
    });

    fireEvent.click(screen.getByText('Pay Now'));

    expect(
      await screen.findByText(/Card number must be 16 digits/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Invalid expiry date\. Use MM\/YY format/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/CVV must be 3 digits/i)).toBeInTheDocument();
  });

  test('accepts valid credit card inputs and shows confirmation', async () => {
    render(<Prescription />);

    // Proceed to credit card payment modal
    fireEvent.click(screen.getByText('Credit/Debit Card'));

    // Input valid card details
    fireEvent.change(screen.getByLabelText(/Card Number/i), {
      target: { value: '1234-5678-9012-3456' },
    });
    fireEvent.change(screen.getByLabelText(/Expiry Date/i), {
      target: { value: '12/25' },
    });
    fireEvent.change(screen.getByLabelText(/CVV/i), {
      target: { value: '123' },
    });

    fireEvent.click(screen.getByText('Pay Now'));

    expect(
      await screen.findByText(/Payment Successful/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Thank you for your submission and payment/i)
    ).toBeInTheDocument();
  });
});
