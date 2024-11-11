import React, { useState, useMemo } from 'react';
import productsData from '../productsData';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination, Paper } from '@mui/material';
import ProductRow from './ProductRow';
import ProductFilters from './ProductFilters';

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

    //Use Set to select unique values, then spread back into an array
    const uniqueCategories = useMemo(() => [...new Set(products.map(product => product.category))], [products]);
    const uniqueStatuses = useMemo(() => [...new Set(products.map(product => product.availabilityStatus))], [products]);

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
    }

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
            <div style={{ marginBottom: '20px' }}>
                <ProductFilters
                    uniqueCategories={uniqueCategories}
                    uniqueStatuses={uniqueStatuses}
                    filters={filters}
                    handleCategoryFilterChange={handleCategoryFilterChange}
                    handleStatusFilterChange={handleStatusFilterChange}/>
            </div>

            <TableContainer component={Paper} sx={{ boxShadow: 3 }}>
                <Table>
                    <TableHead sx={{ backgroundColor: '#7CB9E8', color: '#ffffff' }}>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 'bold', fontFamily: 'Host Grotesk, sans-serif', fontSize: '1rem' }}>Name</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', fontFamily: 'Host Grotesk, sans-serif', fontSize: '1rem' }}>Price</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', fontFamily: 'Host Grotesk, sans-serif', fontSize: '1rem' }}>Category</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', fontFamily: 'Host Grotesk, sans-serif', fontSize: '1rem' }}>Brand</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', fontFamily: 'Host Grotesk, sans-serif', fontSize: '1rem' }}>Status</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', fontFamily: 'Host Grotesk, sans-serif', fontSize: '1rem' }}>Description</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', fontFamily: 'Host Grotesk, sans-serif', fontSize: '1rem' }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {currentItems.map(product => (
                            <ProductRow
                                key={product.id}
                                product={product}
                                editingProductId={editingProductId}
                                editedProduct={editedProduct}
                                onEdit={handleEdit}
                                onSave={handleSave}
                                onCancel={handleCancel}
                                onUpdate={handleUpdate}/>
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