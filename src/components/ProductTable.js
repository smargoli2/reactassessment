import React, { useState, useMemo } from 'react';
import productsData from '../productsData';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination, Select, MenuItem, InputLabel, FormControl, Checkbox, ListItemText, Paper } from '@mui/material';

export default function ProductTable() {
    const [filters, setFilters] = useState({ category: [], availabilityStatus: '' });
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const products = productsData;

    const uniqueCategories = useMemo(function () {
        const categories = products.map(function (product) {
            return product.category;
        });
        return [...new Set(categories)];
    }, [products]);

    const uniqueStatuses = useMemo(function () {
        const statuses = products.map(function (product) {
            return product.availabilityStatus;
        });
        return [...new Set(statuses)];
    }, [products]);

    const filteredProducts = useMemo(function () {
        return products.filter(function (product) {
            const matchCategory = filters.category.length > 0 ? filters.category.includes(product.category) : true;
            const matchStatus = filters.availabilityStatus ? product.availabilityStatus === filters.availabilityStatus : true;
            return matchCategory && matchStatus;
        });
    }, [products, filters]);

    const currentItems = useMemo(function () {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return filteredProducts.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredProducts, currentPage]);

    function handlePageChange(event, newPage) {
        setCurrentPage(newPage + 1);
    }

    function handleFilterChange(event) {
        const { name, value } = event.target;
        setFilters(function (prevFilters) {
            return {
                ...prevFilters,
                [name]: value,
            };
        });
    }

    function handleCategoryChange(event) {
        const { value } = event.target;
        setFilters(function (prevFilters) {
            return {
                ...prevFilters,
                category: value,
            };
        });
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
                        onChange={handleCategoryChange}
                        label="Category"
                        renderValue={(selected) => selected.join(', ')}
                        sx={{
                            backgroundColor: '#ffffff',
                            '& .MuiSelect-icon': { color: '#3f51b5' },
                        }}>
                        {uniqueCategories.map(function (category) {
                            return (
                                <MenuItem key={category} value={category}>
                                    <Checkbox checked={filters.category.indexOf(category) > -1} />
                                    <ListItemText primary={category} />
                                </MenuItem>
                            );
                        })}
                    </Select>
                </FormControl>

                <FormControl style={{ width: '250px' }}>
                    <InputLabel>Availability Status</InputLabel>
                    <Select
                        name="availabilityStatus"
                        value={filters.availabilityStatus}
                        onChange={handleFilterChange}
                        label="Availability Status"
                        sx={{
                            backgroundColor: '#ffffff',
                            '& .MuiSelect-icon': { color: '#3f51b5' },
                        }}>
                        <MenuItem value="">All</MenuItem>
                        {uniqueStatuses.map(function (status) {
                            return (
                                <MenuItem key={status} value={status}>
                                    {status}
                                </MenuItem>
                            );
                        })}
                    </Select>
                </FormControl>
            </div>

            <TableContainer component={Paper} sx={{ boxShadow: 3 }}>
                <Table>
                    <TableHead sx={{ backgroundColor: '#7CB9E8', color: '#ffffff' }}>
                        <TableRow>
                            <TableCell style={{ fontWeight: 'bold' }}>Name</TableCell>
                            <TableCell style={{ fontWeight: 'bold' }}>Brand</TableCell>
                            <TableCell style={{ fontWeight: 'bold' }}>Category</TableCell>
                            <TableCell style={{ fontWeight: 'bold' }}>Price</TableCell>
                            <TableCell style={{ fontWeight: 'bold' }}>Status</TableCell>
                            <TableCell style={{ fontWeight: 'bold' }}>Description</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {currentItems.map(function (product) {
                            return (
                                <TableRow key={product.id} sx={{ '&:hover': { backgroundColor: '#f0f0f0' } }}>
                                    <TableCell>{product.name}</TableCell>
                                    <TableCell>{product.brand}</TableCell>
                                    <TableCell>{product.category}</TableCell>
                                    <TableCell>${product.price}</TableCell>
                                    <TableCell>{product.availabilityStatus}</TableCell>
                                    <TableCell>{product.description}</TableCell>
                                </TableRow>
                            );
                        })}
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
                sx={{
                    backgroundColor: '#ffffff',
                    borderTop: '1px solid #e0e0e0',
                }}/>
        </div>
    );
}