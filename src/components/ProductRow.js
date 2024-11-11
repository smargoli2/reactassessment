import React from 'react';
import { TableCell, TableRow, IconButton, TextField } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';

export default function ProductRow({
    product,
    editingProductId,
    editedProduct,
    onEdit,
    onSave,
    onCancel,
    onUpdate
}) {
    return (
        <TableRow key={product.id} sx={{ '&:hover': { backgroundColor: '#f0f0f0' } }}>
            <TableCell sx={{ fontFamily: 'Host Grotesk, sans-serif', fontSize: '1rem' }}>
                {/* If the product is being edited, show the input field */}
                {editingProductId === product.id ? (
                    <TextField name="name" value={editedProduct.name || ''} onChange={onUpdate} />
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
                        <IconButton onClick={onSave}><SaveIcon /></IconButton>
                        <IconButton onClick={onCancel}><CancelIcon /></IconButton>
                    </>
                ) : (
                    <IconButton onClick={() => onEdit(product)}><EditIcon /></IconButton>
                )}
            </TableCell>
        </TableRow>
    );
}