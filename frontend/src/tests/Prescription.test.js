import { fireEvent, render, screen } from '@testing-library/react';
import Prescription from './Prescription.test';

describe('Prescription Component', () => {

  // Test 1: Render the component and check basic elements
  test('renders the component with all form elements', () => {
    render(<Prescription />);

    expect(screen.getByText('Request Prescription for Your Pet')).toBeInTheDocument();
    expect(screen.getByLabelText('Prescription Detail:')).toBeInTheDocument();
    expect(screen.getByLabelText('Preferred Pharmacy:')).toBeInTheDocument();
    expect(screen.getByLabelText('Preferred Pickup Date:')).toBeInTheDocument();
    expect(screen.getByLabelText('Preferred Pickup Time:')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Proceed To Payment' })).toBeInTheDocument();
  });

  // Test 2: Pet selection functionality
  test('selecting a pet updates the selected pet', () => {
    render(<Prescription />);

    const petButton = screen.getByRole('button', { name: 'Select' });
    fireEvent.click(petButton);

    expect(screen.getByText('Selected')).toBeInTheDocument();
    expect(screen.getByText(/Prescription Request for/)).toBeInTheDocument();
  });

  // Test 3: Submitting form opens the payment modal
  test('submitting the form opens the payment modal', () => {
    render(<Prescription />);

    // Set valid form values
    fireEvent.change(screen.getByLabelText('Prescription Detail:'), {
      target: { value: 'Antibiotics' }
    });
    fireEvent.change(screen.getByLabelText('Preferred Pharmacy:'), {
      target: { value: 'Pharmacy 1' }
    });
    fireEvent.change(screen.getByLabelText('Preferred Pickup Date:'), {
      target: { value: '2024-09-20' }
    });
    fireEvent.change(screen.getByLabelText('Preferred Pickup Time:'), {
      target: { value: '14:00' }
    });

    fireEvent.click(screen.getByRole('button', { name: 'Proceed To Payment' }));
    
    expect(screen.getByText('Payment Details')).toBeInTheDocument();
  });

  // Test 4: Validating credit card form in payment modal
  test('payment form validation shows errors for invalid card details', () => {
    render(<Prescription />);

    // Open payment modal first
    fireEvent.click(screen.getByRole('button', { name: 'Proceed To Payment' }));

    // Enter invalid card details
    fireEvent.change(screen.getByLabelText('Card Number:'), { target: { value: '123' } });
    fireEvent.change(screen.getByLabelText('Expiry Date (MM/YY):'), { target: { value: '12/25' } });
    fireEvent.change(screen.getByLabelText('CVV:'), { target: { value: '12' } });

    fireEvent.click(screen.getByRole('button', { name: 'Pay Now' }));

    // Check for error messages
    expect(screen.getByText('Card number must be 16 digits.')).toBeInTheDocument();
    expect(screen.getByText('CVV must be 3 digits.')).toBeInTheDocument();
  });

  // Test 5: Successful payment and confirmation modal
  test('successful payment displays confirmation modal', () => {
    render(<Prescription />);

    // Open payment modal first
    fireEvent.click(screen.getByRole('button', { name: 'Proceed To Payment' }));

    // Enter valid card details
    fireEvent.change(screen.getByLabelText('Card Number:'), { target: { value: '1234-5678-9012-3456' } });
    fireEvent.change(screen.getByLabelText('Expiry Date (MM/YY):'), { target: { value: '12/25' } });
    fireEvent.change(screen.getByLabelText('CVV:'), { target: { value: '123' } });

    fireEvent.click(screen.getByRole('button', { name: 'Pay Now' }));

    // Check if confirmation modal appears
    expect(screen.getByText('Payment Successful!')).toBeInTheDocument();
    expect(screen.getByText('Thank you for your submission and payment!')).toBeInTheDocument();
  });

  // Test 6: Closing confirmation modal resets form
  test('closing confirmation modal resets the form', () => {
    render(<Prescription />);

    // Open payment modal first
    fireEvent.click(screen.getByRole('button', { name: 'Proceed To Payment' }));

    // Enter valid card details
    fireEvent.change(screen.getByLabelText('Card Number:'), { target: { value: '1234-5678-9012-3456' } });
    fireEvent.change(screen.getByLabelText('Expiry Date (MM/YY):'), { target: { value: '12/25' } });
    fireEvent.change(screen.getByLabelText('CVV:'), { target: { value: '123' } });

    fireEvent.click(screen.getByRole('button', { name: 'Pay Now' }));

    // Close the confirmation modal
    fireEvent.click(screen.getByRole('button', { name: 'Close' }));

    // Ensure form is reset
    expect(screen.getByLabelText('Prescription Detail:').value).toBe('');
    expect(screen.getByLabelText('Preferred Pharmacy:').value).toBe('');
    expect(screen.getByLabelText('Preferred Pickup Date:').value).toBe('');
    expect(screen.getByLabelText('Preferred Pickup Time:').value).toBe('');
  });
});
