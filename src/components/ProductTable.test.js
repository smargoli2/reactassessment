import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import ProductTable from './ProductTable';
import productsData from '../productsData';

// Mock localStorage
beforeEach(() => {
  const products = JSON.stringify(productsData);
  window.localStorage.setItem('products', products);
});

describe('ProductTable', () => {
  it.only('should edit and save a product', async () => {
    await act(async () => {
      render(<ProductTable />);
  });

    const editButton = screen.getByTestId('edit-button1');
    fireEvent.click(editButton);

    const nameInput = screen.getByTestId('name-input1').querySelector('input');
    fireEvent.change(nameInput, { target: { value: 'Updated Product Name' } });

    const saveButton = screen.getByTestId('save-button1');
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(screen.getByText('Updated Product Name')).toBeInTheDocument();
    });
  });

  it('should cancel editing when the cancel button is clicked', async () => {
    render(<ProductTable />);

    // Start editing the first product
    const editButton = screen.getAllByLabelText('edit')[0];
    fireEvent.click(editButton);

    // Click the cancel button
    const cancelButton = screen.getAllByLabelText('cancel')[0];  // Assuming the button is labeled 'cancel'
    fireEvent.click(cancelButton);

    // Check if the table returns to its non-editing state
    expect(screen.getByText(productsData[0].name)).toBeInTheDocument();
  });
});