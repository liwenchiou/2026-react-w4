import { useState } from "react";
import axios from "axios";
const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_PATH = import.meta.env.VITE_API_PATH;
function LoginPage({ setIsAuth, getProducts }) {
  const [account, setAccount] = useState({
    email: "",
    pass: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAccount({ ...account, [name]: value });
  };

  const handleLogin = (e) => {
    e.preventDefault();
    axios
      .post(`${BASE_URL}/v2/admin/signin`, {
        username: account.email,
        password: account.pass,
      })
      .then((res) => {
        if (res.data.success) {
          alert("登入成功");
          const { token, expired } = res.data;
          document.cookie = `hexToken=${token}; expires=${new Date(expired)}`;
          setIsAuth(true);
          axios.defaults.headers.common["Authorization"] = token;
          getProducts();
        }
      })
      .catch((err) => {
        console.log(err);
        alert("登入失敗，請檢查帳號密碼");
      });
  };
  return (
    /* 登入介面保持原樣... */
    <div className="login-page-container">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-lg-10">
            <div className="card login-card border-0">
              <div className="row g-0">
                <div className="col-md-6 d-none d-md-block login-img"></div>
                <div className="col-md-6 p-4">
                  <div className="login-form-container">
                    <div className="text-center mb-5">
                      <h2 className="fw-bold">
                        系統登入 <span className="text-cyan">Login</span>
                      </h2>
                      <p className="text-white-50 small mt-2">
                        RESTful API 串接實戰
                      </p>
                    </div>
                    <form onSubmit={handleLogin}>
                      <div className="mb-4">
                        <label className="form-label small text-white-50">
                          電子郵件 (Email)
                        </label>
                        <input
                          type="email"
                          name="email"
                          className="form-control"
                          value={account.email}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="mb-4">
                        <label className="form-label small text-white-50">
                          密碼 (Password)
                        </label>
                        <input
                          type="password"
                          name="pass"
                          className="form-control"
                          value={account.pass}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="d-grid gap-2 mt-5">
                        <button
                          type="submit"
                          className="btn btn-primary btn-login py-3"
                        >
                          立即驗證登入
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default LoginPage;
