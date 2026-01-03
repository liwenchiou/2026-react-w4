import { useState } from 'react';
import './App.css';

function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('正在登入...', { email, password });
  };

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
                    <p className="text-white-50 small mt-2">進入科技化管理控制台</p>
                  </div>

                  <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                      <label className="form-label small text-white-50">電子郵件 (Email)</label>
                      <input
                        type="email"
                        className="form-control"
                        placeholder="admin@tech-system.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>

                    <div className="mb-4">
                      <label className="form-label small text-white-50">密碼 (Password)</label>
                      <input
                        type="password"
                        className="form-control"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>

                    <div className="d-grid gap-2 mt-5">
                      <button type="submit" className="btn btn-primary btn-login py-3">
                        立即驗證登入
                      </button>
                    </div>
                  </form>

                  <div className="mt-4 text-center">
                    <small className="text-white-50">
                      需要協助？ <a href="#" className="text-cyan text-decoration-none">聯絡技術支援</a>
                    </small>
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

export default App;