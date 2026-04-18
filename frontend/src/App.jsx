import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.css';

import Header from './layout/Header'

import Login from "./pages/authorization/Login";
import Register from "./pages/authorization/Register";
import Profile from "./pages/authorization/Profile";

import Cart from './pages/cart/Cart';
import Orders from './pages/order/Orders';
import AdminOrders from './pages/order/AdminOrders.jsx';

import ListProducts from './pages/product/ListProducts';
import AddProduct from './pages/product/AddProduct';
import EditProduct from './pages/product/EditProduct';
import ProductDetail from './pages/product/ProductDetail';

import ListCategories from './pages/category/ListCategories';
import AddCategory from './pages/category/AddCategory';
import EditCategory from './pages/category/EditCategory';


import { connect } from "react-redux";

class App extends React.Component {
    render() {

        return (
            <div>
                <BrowserRouter>
                    <Header />
                    <Routes>
                        <Route path="/login" element={<Login/>} />
                        <Route path="/register" element={<Register/>} />
                        <Route path="/profile" element={<Profile/>} />            
                        <Route path="/cart" element={<Cart/>} />
                        <Route path="/orders" element={<Orders/>} />
                        <Route path="/AdminOrders" element={<AdminOrders/>} />

                        <Route path="/ListProducts" element={<ListProducts/>}/>
                        <Route path="/AddProduct" element={<AddProduct/>}/>
                        <Route path="/EditProduct/:id" element={<EditProduct/>}/>
                        <Route path="/product/:id" element={<ProductDetail/>}/>  

                        <Route path="/ListCategories" element={<ListCategories/>}/>
                        <Route path="/AddCategory" element={<AddCategory/>}/>
                        <Route path="/EditCategory/:id" element={<EditCategory/>}/> 
                    </Routes>
                </BrowserRouter>
            </div>
        );
    }
}

function mapStateToProps(state) {
    const { user } = state.auth;
    return {
        user
    };
}

export default connect(mapStateToProps)(App);
