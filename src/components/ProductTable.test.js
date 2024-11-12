import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import ProductTable from './ProductTable';

describe('Test ProductTable', () => {
  it('should retry if data fails to load', async () => {
    let retryButtonVisible = false;
  
    const renderAndCheckRetryButton = async () => {
      await act(async () => {
        render(<ProductTable />);
      });
  
      retryButtonVisible = screen.queryByTestId('retry-button') !== null;
    };
  
    while (!retryButtonVisible) {
      await renderAndCheckRetryButton();
    }
  
    const retryButton = screen.getAllByTestId('retry-button');
    fireEvent.click(retryButton[0]);
  
    let isDataLoaded = false;
  
    while (!isDataLoaded) {
      try {
        await waitFor(() => {
          if (screen.getByText('Blender')) {
            isDataLoaded = true;
          }
        });
      } catch (error) {
        const retryButton = screen.queryByTestId('retry-button');
        if (retryButton) {
          fireEvent.click(retryButton);
        }
      }
    }
  
    expect(screen.getByText('Blender')).toBeInTheDocument();
  });

  it('should edit and save a product', async () => {
    let retryButtonVisible = false;

    const renderAndCheckRetryButton = async () => {
      await act(async () => {
        render(<ProductTable />);
      });

      retryButtonVisible = screen.queryByTestId('retry-button') !== null;
    };

    while (!retryButtonVisible) {
      await renderAndCheckRetryButton();
    }

    const retryButton = screen.getAllByTestId('retry-button');
    fireEvent.click(retryButton[0]);

    let isDataLoaded = false;

    while (!isDataLoaded) {
      try {
        await waitFor(() => {
          if (screen.getByText('Blender')) {
            isDataLoaded = true;
          }
        });
      } catch (error) {
        const retryButton = screen.queryByTestId('retry-button')[0];
        if (retryButton) {
          fireEvent.click(retryButton);
        }
      }
    }
    
    const editButton = screen.getByTestId('edit-button1');
    fireEvent.click(editButton);

    const nameInput = screen.getByTestId('name-input1').querySelector('input');
    fireEvent.change(nameInput, { target: { value: 'Updated Product Name' } });

    const saveButton = screen.getByTestId('save-button1');
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(screen.getByText('Updated Product Name')).toBeInTheDocument();
    });
  }, 10000);

});