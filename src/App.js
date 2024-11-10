import React from "react"
import ProductTable from "./components/ProductTable"

export default function App() {
    console.log("app is rendering")
    return (
        <div>
            <h1>Superb Kitchen Supply</h1>
            <ProductTable />
        </div>
    )
}