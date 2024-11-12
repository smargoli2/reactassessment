import React, { useState, useMemo, useCallback, lazy, Suspense, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination, Paper } from '@mui/material';
import ProductRow from './ProductRow';
import ErrorBoundary from './ErrorBoundary';
import { mockFetchProducts } from "../services/mockFetch";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";

// Lazy load ProductFilters
const ProductFilters = lazy(() => import('./ProductFilters'));

export default function ProductTable(props) {
    const [filters, setFilters] = useState({ category: [], availabilityStatus: '' });
    const [currentPage, setCurrentPage] = useState(1);
    const [editingProductId, setEditingProductId] = useState(null);
    const [editedProduct, setEditedProduct] = useState({});
    const [itemsPerPage, setItemsPerPage] = useState(5);

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadDataError, setLoadDataError] = useState(null);
    const [saveError, setSaveError] = useState(null);

    const fetchProducts = async () => {
        setLoading(true);
        setLoadDataError(null);
        try {
            const fetchedProducts = await mockFetchProducts(props.shouldFail);
            setProducts(fetchedProducts);
        } catch (err) {
            setLoadDataError(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const storedProducts = localStorage.getItem("products");

        if (storedProducts) {
            setProducts(JSON.parse(storedProducts));
        } else {
            fetchProducts();
        }
    }, []);

    function saveProducts(updatedProducts) {
        localStorage.setItem('products', JSON.stringify(updatedProducts));
    }

    // Use Set to select unique values, then spread back into an array
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

    const handlePageChange = useCallback((event, newPage) => {
        setCurrentPage(newPage + 1);
    }, []);

    const handleRowsPerPageChange = useCallback((event) => {
        const newItemsPerPage = parseInt(event.target.value, 10);
        setItemsPerPage(newItemsPerPage);
        setCurrentPage(1);
    }, []);

    const handleStatusFilterChange = useCallback((event) => {
        const { name, value } = event.target;
        setFilters(prevFilters => ({ ...prevFilters, [name]: value }));
        setCurrentPage(1);
    }, []);

    const handleCategoryFilterChange = useCallback((event) => {
        const { value } = event.target;
        setFilters(prevFilters => ({ ...prevFilters, category: value }));
        setCurrentPage(1);
    }, []);

    const handleEdit = useCallback((product) => {
        setEditingProductId(product.id);
        setEditedProduct({ ...product });
    }, []);

    const handleSave = useCallback(() => {
        setSaveError(null);
        const updatedProducts = products.map(p =>
            p.id === editingProductId ? { ...p, ...editedProduct } : p
        );

        try {
            const isNetworkError = Math.random() < 0.5; // 30% chance of network error

            if (isNetworkError) {
                throw new Error("Network error. Please check your connection and click Retry.");
            } else if (Math.random() < 0.3) { // 30% chance of API error
                throw new Error("Invalid product data. Please update and try again.");
            }

            setProducts(updatedProducts);
            saveProducts(updatedProducts);
            setEditingProductId(null);
            setSaveError(null);
        } catch (error) {
            setSaveError(error.message);
        }
    }, [editedProduct, editingProductId, products]);

    const handleCancel = useCallback(() => {
        setEditingProductId(null);
        setEditedProduct({});
    }, []);

    const handleUpdate = useCallback((event) => {
        const { name, value } = event.target;
        setEditedProduct(prevProduct => ({ ...prevProduct, [name]: value }));
    }, []);

    return (
        <div style={{ padding: '20px', backgroundColor: '#f7f7f7', borderRadius: '8px' }}>
            {loading && <CircularProgress data-testid="loading-indicator" />}
            {loadDataError && !loading && (
                <>
                    <Alert severity="error" style={{ marginBottom: "20px" }}>
                        {loadDataError}
                    </Alert>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={fetchProducts}
                        style={{ marginBottom: '20px' }}
                        data-testid="retry-button"
                    >
                        Retry
                    </Button>
                </>
            )}
            {saveError && (
                <Alert severity="error" style={{ marginBottom: "20px" }}>
                    {saveError}
                </Alert>
            )}

            {saveError && saveError.includes("Network error") && (
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSave}
                    style={{ marginBottom: '20px' }}
                    data-testid="retry-button"
                >
                    Retry
                </Button>
            )}
            <div style={{ marginBottom: '20px' }}>
                {/* Suspense for lazy loading ProductFilters */}
                <Suspense fallback={<div>Loading filters...</div>}>
                    <ProductFilters
                        uniqueCategories={uniqueCategories}
                        uniqueStatuses={uniqueStatuses}
                        filters={filters}
                        handleCategoryFilterChange={handleCategoryFilterChange}
                        handleStatusFilterChange={handleStatusFilterChange}
                    />
                </Suspense>
            </div>
            <ErrorBoundary>
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
                                    onUpdate={handleUpdate} />
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </ErrorBoundary>

            <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={filteredProducts.length}
                rowsPerPage={itemsPerPage}
                page={currentPage - 1}
                onPageChange={handlePageChange}
                onRowsPerPageChange={handleRowsPerPageChange} />
        </div>
    );
}