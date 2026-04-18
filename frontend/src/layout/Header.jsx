import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import authActions from "../actions/auth";
import { connect, useDispatch } from "react-redux";

function Header({ user }) {
    const dispatch = useDispatch();
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        if (user) {
            setCurrentUser(user);
        }
    }, [user]);

    const logOut = () => {
        dispatch(authActions.logout());
        window.location.reload();
    };

    return (
        <nav className="navbar navbar-project navbar-expand-lg navbar-light" style={{ background: '#d2b48c' }}>
            {/* Показываем ссылки только если пользователь - админ */}
            {currentUser && currentUser.role === 'ROLE_ADMIN' && (
                <>
                    <div className="ms-3">
                        <Link className="navbar-brand" to="/listCategories" style={{ color: '#704214' }}>Категории</Link>
                    </div>
                    <div className="ms-3">
                        <Link className="navbar-brand" to="/adminOrders" style={{ color: '#704214' }}>Все заказы</Link>
                    </div>
                </>
            )}
            <div className="ms-3">
                <Link className="navbar-brand" to="/listProducts" style={{ color: '#704214' }}>Товары</Link>
            </div>
            <div className="ms-3">
                <Link className="navbar-brand" to="/cart" style={{ color: '#704214' }}>Корзина</Link>
            </div>
            <div className="ms-3">
                <Link className="navbar-brand" to="/orders" style={{ color: '#704214' }}>Заказы</Link>
            </div>


            {currentUser ? (
                <div className="ml-auto">
                    <span className="navbar-brand" style={{ color: '#704214' }}>{currentUser.username}</span>
                    <button className="navbar-brand btn" onClick={logOut} style={{ background: '#d2b48c', color: '#704214' }}>Выйти из профиля</button>
                </div>
            ) : (
                <div className="ml-auto">
                    <Link to="/register" className="nav-link navbar-brand btn navbar-brand-button" style={{ background: '#d2b48c', color: '#704214' }}>Регистрация</Link>
                    <Link to="/login" className="nav-link navbar-brand btn navbar-brand-button" style={{ background: '#d2b48c', color: '#704214' }}>Вход в систему</Link>
                </div>
            )}
        </nav>
    );
}

function mapStateToProps(state) {
  const { user } = state.auth;
  return {
    user
  };
}

export default connect(mapStateToProps)(Header);
