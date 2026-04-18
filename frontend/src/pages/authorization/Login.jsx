import React, { useState } from "react";
import { Navigate, Link } from "react-router-dom";
import { connect } from "react-redux";
import auth from "../../actions/auth";

const Login = ({ isLoggedIn, message, dispatch }) => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    loading: false,
  });

  const { username, password, loading } = formData;

  const onChangeUsername = (e) =>
    setFormData({ ...formData, username: e.target.value });
  const onChangePassword = (e) =>
    setFormData({ ...formData, password: e.target.value });

  const handleLogin = async (e) => {
    e.preventDefault();
    setFormData({ ...formData, loading: true });

    try {
      await dispatch(auth.login(username, password));
      window.location.reload();
    } catch (error) {
      setFormData({ ...formData, loading: false });
    }
  };

  if (isLoggedIn) {
    return <Navigate to="/listProducts" />;
  }

  return (
    <div className="container-md mt-3">
      <div className="col-md-5">
        <form
          onSubmit={handleLogin}
          style={{
            background: "#d2b48c",
            padding: "20px",
            borderRadius: "10px",
          }}
        >
          <div className="form-group mt-2">
            <input
              type="text"
              className="form-control"
              name="username"
              placeholder="Логин"
              value={username}
              onChange={onChangeUsername}
              required
              style={{ backgroundColor: "#fff8e1", borderColor: "#704214" }}
            />
          </div>
          <div className="form-group mt-2">
            <input
              type="password"
              className="form-control"
              name="password"
              placeholder="Пароль"
              value={password}
              onChange={onChangePassword}
              required
              style={{ backgroundColor: "#fff8e1", borderColor: "#704214" }}
            />
          </div>

          <div className="form-group mt-2">
            <button
              className="btn btn-primary btn-block"
              disabled={loading}
              style={{ backgroundColor: "#704214", borderColor: "#704214" }}
            >
              {loading && (
                <span className="spinner-border spinner-border-sm"></span>
              )}
              <span>Войти</span>
            </button>
          </div>
          <div className="form-group mt-2">
            <Link to="/register" style={{ color: "#704214" }}>
              Зарегистрироваться
            </Link>
          </div>
          {message && loading && (
            <div className="form-group">
              <div className="alert alert-danger" role="alert">
                {message}
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  isLoggedIn: state.auth.isLoggedIn,
  message: state.message.message,
});

export default connect(mapStateToProps)(Login);
