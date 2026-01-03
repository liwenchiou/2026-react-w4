import { useState } from 'react';
import './App.css';
import axios from 'axios';

function App() {
  //儲存登入表單資料
  const [account, setAccount] = useState({
    email: "",
    pass: "",
  });

  //改變輸入值
  const handleInputChange = (e) => {
    //解構抓e的內容
    const { name, value } = e.target;
    //存到account 裡面
    setAccount({
      ...account,
      [name]: value
    })
  }

  //執行登入
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const handleLogin = (e) => {
    e.preventDefault();
    console.log(account);
    axios.post(`${BASE_URL}/v2/admin/signin`,
      {
        username: account.email,
        password: account.pass
      }
    )
      .then((res) => {
        console.log(res.data);
        if (res.data.success) {
          alert("登入成功");
        }
      })
      .catch((err) => {
        console.log(err);
      })
  }

  return (
    <div className="container">
      <div className="row justify-content-center my-auto">
        {/* 控制整體卡片寬度 */}
        <div className="col-12 col-lg-10">
          <div className="card login-card border-0">
            <div className="row g-0">

              {/* 左側：科技圖 (平板以上顯示) */}
              <div className="col-md-6 d-none d-md-block login-img"></div>

              {/* 右側：登入表單 (背景設為透明以顯示卡片樣式) */}
              <div className="col-md-6 bg-transparent">
                <div className="login-form-container">
                  <div className="text-center mb-5">
                    <h2 className="fw-bold">
                      系統登入 <span className="text-cyan">Login</span>
                    </h2>
                    <p className="text-white-50 small mt-2">第2025 React 作品實戰冬季班</p>
                    <p className="text-white-50 small mt-2">第二週 - RESTful API 串接</p>

                  </div>

                  <form onSubmit={handleLogin}>
                    <div className="mb-4">
                      <label className="form-label small text-white-50">電子郵件 (Email)</label>
                      <input
                        type="email"
                        name="email"
                        className="form-control"
                        placeholder="admin@tech-system.com"
                        value={account.email}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="mb-4">
                      <label className="form-label small text-white-50">密碼 (Password)</label>
                      <input
                        type="password"
                        name="pass"
                        className="form-control"
                        placeholder="••••••••"
                        value={account.pass}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="d-grid gap-2 mt-5">
                      <button type="submit" className="btn btn-primary btn-login py-3">
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
  );
}

export default App;