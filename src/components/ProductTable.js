import React, { useState, useMemo } from 'react';
import productsData from '../productsData';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination,
    Select, MenuItem, InputLabel, FormControl, Checkbox, ListItemText, Paper, IconButton,
    TextField
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';

export default function ProductTable() {
    const [filters, setFilters] = useState({ category: [], availabilityStatus: '' });
    const [currentPage, setCurrentPage] = useState(1);
    const [editingProductId, setEditingProductId] = useState(null);
    const [editedProduct, setEditedProduct] = useState({});
    const [itemsPerPage, setItemsPerPage] = useState(5);

    // Get products from localStorage or productsData
    const [products, setProducts] = useState(() => {
        const storedProducts = localStorage.getItem('products');
        return storedProducts ? JSON.parse(storedProducts) : productsData;
    });

    function saveProducts(updatedProducts) {
        localStorage.setItem('products', JSON.stringify(updatedProducts));
    }

    const uniqueCategories = useMemo(() => {
        //Use Set to select unique values, then spread back into an array
        return [...new Set(products.map(product => product.category))];
    }, [products]);

    const uniqueStatuses = useMemo(() => {
        return [...new Set(products.map(product => product.availabilityStatus))];
    }, [products]);

    const filteredProducts = useMemo(() => {
        return products.filter(product => {
            const matchCategory = filters.category.length > 0 ? filters.category.includes(product.category) : true;
            const matchStatus = filters.availabilityStatus ? product.availabilityStatus === filters.availabilityStatus : true;
            return matchCategory && matchStatus;
        });
    }, [products, filters]);

    const currentItems = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return filteredProducts.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredProducts, currentPage, itemsPerPage]);

    function handlePageChange(event, newPage) {
        setCurrentPage(newPage + 1);
    }

    function handleRowsPerPageChange(event) {
        const newItemsPerPage = parseInt(event.target.value, 10);
        setItemsPerPage(newItemsPerPage);
        setCurrentPage(1);
    };

    function handleStatusFilterChange(event) {
        const { name, value } = event.target;
        setFilters(prevFilters => ({ ...prevFilters, [name]: value }));
        setCurrentPage(1); 
    }

    function handleCategoryFilterChange(event) {
        const { value } = event.target;
        setFilters(prevFilters => ({ ...prevFilters, category: value }));
        setCurrentPage(1); 
    }

    function handleEdit(product) {
        setEditingProductId(product.id);
        setEditedProduct({ ...product });
    }

    function handleSave() {
        const updatedProducts = products.map(p =>
            p.id === editingProductId ? { ...p, ...editedProduct } : p
        );

        setProducts(updatedProducts);
        saveProducts(updatedProducts);
        setEditingProductId(null);
    }

    function handleCancel() {
        setEditingProductId(null);
        setEditedProduct({});
    }

    function handleUpdate(event) {
        const { name, value } = event.target;
        setEditedProduct(prevProduct => ({ ...prevProduct, [name]: value }));
    }

    return (
        <div style={{ padding: '20px', backgroundColor: '#f7f7f7', borderRadius: '8px' }}>
            <div style={{ marginBottom: '20px', display: 'flex', gap: '20px' }}>
                <FormControl style={{ width: '250px' }}>
                    <InputLabel>Category</InputLabel>
                    <Select
                        name="category"
                        multiple
                        value={filters.category}
                        onChange={handleCategoryFilterChange}
                        label="Category"
                        renderValue={(selected) => selected.join(', ')}>
                        {uniqueCategories.map(category => (
                            <MenuItem key={category} value={category}>
                                <Checkbox checked={filters.category.indexOf(category) > -1} />
                                <ListItemText primary={category} />
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <FormControl style={{ width: '250px' }}>
                    <InputLabel>Availability Status</InputLabel>
                    <Select
                        name="availabilityStatus"
                        value={filters.availabilityStatus}
                        onChange={handleStatusFilterChange}
                        label="Availability Status">
                        <MenuItem value="">All</MenuItem>
                        {uniqueStatuses.map(status => (
                            <MenuItem key={status} value={status}>{status}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </div>

            <TableContainer component={Paper} sx={{ boxShadow: 3 }}>
                <Table>
                    <TableHead sx={{ backgroundColor: '#7CB9E8', color: '#ffffff' }}>
                        <TableRow>
                            <TableCell style={{ fontWeight: 'bold' }}>Name</TableCell>
                            <TableCell style={{ fontWeight: 'bold' }}>Price</TableCell>
                            <TableCell style={{ fontWeight: 'bold' }}>Category</TableCell>
                            <TableCell style={{ fontWeight: 'bold' }}>Brand</TableCell>
                            <TableCell style={{ fontWeight: 'bold' }}>Status</TableCell>
                            <TableCell style={{ fontWeight: 'bold' }}>Description</TableCell>
                            <TableCell style={{ fontWeight: 'bold' }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {currentItems.map(product => (
                            <TableRow key={product.id} sx={{ '&:hover': { backgroundColor: '#f0f0f0' } }}>
                                <TableCell>
                                    {/* If the product is being edited, show the input field */}
                                    {editingProductId === product.id ? (
                                        <TextField
                                            name="name"
                                            value={editedProduct.name || ''}
                                            onChange={handleUpdate}/>
                                    ) : product.name}
                                </TableCell>
                                <TableCell>
                                    {editingProductId === product.id ? (
                                        <TextField
                                            name="price"
                                            type="number"
                                            value={editedProduct.price || ''}
                                            onChange={handleUpdate}/>
                                    ) : `$${product.price}`}
                                </TableCell>
                                <TableCell>{product.category}</TableCell>
                                <TableCell>{product.brand}</TableCell>
                                <TableCell>{product.availabilityStatus}</TableCell>
                                <TableCell>{product.description}</TableCell>
                                <TableCell>
                                    {editingProductId === product.id ? (
                                        <>
                                            <IconButton onClick={handleSave}><SaveIcon /></IconButton>
                                            <IconButton onClick={handleCancel}><CancelIcon /></IconButton>
                                        </>
                                    ) : (
                                        <IconButton onClick={() => handleEdit(product)}><EditIcon /></IconButton>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={filteredProducts.length}
                rowsPerPage={itemsPerPage}
                page={currentPage - 1}
                onPageChange={handlePageChange}
                onRowsPerPageChange={handleRowsPerPageChange}/>
        </div>
    );
}