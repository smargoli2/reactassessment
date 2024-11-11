import React from 'react';
import { FormControl, InputLabel, Select, MenuItem, Checkbox, ListItemText } from '@mui/material';

export default function ProductFilters({
    uniqueCategories,
    uniqueStatuses,
    filters,
    handleCategoryFilterChange,
    handleStatusFilterChange
}) {
    return (
        <div style={{ marginBottom: '20px', display: 'flex', gap: '20px' }}>
            <FormControl sx={{ width: 250 }}>
                <InputLabel sx={{ fontFamily: 'Host Grotesk, sans-serif' }}>Category</InputLabel>
                <Select
                    name="category"
                    multiple
                    value={filters.category}
                    onChange={handleCategoryFilterChange}
                    label="Category"
                    renderValue={(selected) => selected.join(', ')}>
                    {uniqueCategories.map((category) => (
                        <MenuItem key={category} value={category}>
                            <Checkbox checked={filters.category.indexOf(category) > -1} />
                            <ListItemText primary={category} />
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            <FormControl sx={{ width: 250 }}>
                <InputLabel sx={{ fontFamily: 'Host Grotesk, sans-serif' }}>Status</InputLabel>
                <Select
                    name="availabilityStatus"
                    value={filters.availabilityStatus}
                    onChange={handleStatusFilterChange}
                    label="Availability Status">
                    <MenuItem value="">All</MenuItem>
                    {uniqueStatuses.map((status) => (
                        <MenuItem key={status} value={status}>{status}</MenuItem>
                    ))}
                </Select>
            </FormControl>
        </div>
    );
}