import React from 'react';
import { TableCell, TableRow, IconButton, TextField } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';

// Memoize the ProductRow component to avoid unnecessary re-renders
const ProductRow = React.memo(({ product, editingProductId, editedProduct, onEdit, onSave, onCancel, onUpdate }) => {
    return (
        <TableRow key={product.id} sx={{ '&:hover': { backgroundColor: '#f0f0f0' } }}>
            <TableCell sx={{ fontFamily: 'Host Grotesk, sans-serif', fontSize: '1rem' }}>
                {/* If the product is being edited, show the input field */}
                {editingProductId === product.id ? (
                    <TextField name="name" value={editedProduct.name || ''} onChange={onUpdate} data-testid={`name-input${product.id}`} />
                ) : product.name}
            </TableCell>
            <TableCell sx={{ fontFamily: 'Host Grotesk, sans-serif', fontSize: '1rem' }}>
                {editingProductId === product.id ? (
                    <TextField name="price" type="number" value={editedProduct.price || ''} onChange={onUpdate} />
                ) : `$${product.price}`}
            </TableCell>
            <TableCell sx={{ fontFamily: 'Host Grotesk, sans-serif', fontSize: '1rem' }}>{product.category}</TableCell>
            <TableCell sx={{ fontFamily: 'Host Grotesk, sans-serif', fontSize: '1rem' }}>{product.brand}</TableCell>
            <TableCell sx={{ fontFamily: 'Host Grotesk, sans-serif', fontSize: '1rem' }}>{product.availabilityStatus}</TableCell>
            <TableCell sx={{ fontFamily: 'Host Grotesk, sans-serif', fontSize: '1rem' }}>{product.description}</TableCell>
            <TableCell sx={{ fontFamily: 'Host Grotesk, sans-serif', fontSize: '1rem' }}>
                {editingProductId === product.id ? (
                    <>
                        <IconButton onClick={onSave} data-testid={`save-button${product.id}`}><SaveIcon /></IconButton>
                        <IconButton onClick={onCancel} data-testid={`cancel-button${product.id}`}><CancelIcon /></IconButton>
                    </>
                ) : (
                    <IconButton onClick={() => onEdit(product)} data-testid={`edit-button${product.id}`}><EditIcon /></IconButton>
                )}
            </TableCell>
        </TableRow>
    );
});

export default ProductRow;