import { useState } from 'react';
import './App.css';
import axios from 'axios';

function App() {
  const [account, setAccount] = useState({
    email: "",
    pass: "",
  });

  const [isAuth, setIsAuth] = useState(false);
  const [articles, setArticles] = useState([]);
  const [selectedArticle, setSelectedArticle] = useState(null);

  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const API_PATH = import.meta.env.VITE_API_PATH;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAccount({ ...account, [name]: value });
  };

  const handleLogin = (e) => {
    e.preventDefault();
    axios.post(`${BASE_URL}/v2/admin/signin`, {
      username: account.email,
      password: account.pass
    })
      .then((res) => {
        if (res.data.success) {
          alert("登入成功");
          const { token, expired } = res.data;
          document.cookie = `hexToken=${token}; expires=${new Date(expired)}`;
          setIsAuth(true);
          axios.defaults.headers.common['Authorization'] = token;

          axios.get(`${BASE_URL}/v2/api/${API_PATH}/admin/products/all`)
            .then((res) => {
              setArticles(Object.values(res.data.products));
            })
            .catch((err) => console.log(err));
        }
      })
      .catch((err) => {
        console.log(err);
        alert("登入失敗，請檢查帳號密碼");
      });
  };

  return (
    isAuth ? (
      /* --- 管理後台介面 --- */
      <div className="admin-wrapper">
        <div className="container-fluid">
          <h3 className="mb-4 fw-bold text-white"><span className="text-cyan">CODEBLOOM</span> 文章後台管理</h3>
          <div className="row g-4">
            <div className="col-lg-5">
              <div className="card glass-card">
                <div className="p-3 border-bottom border-secondary">
                  <h6 className="m-0 text-cyan">文章清單列表</h6>
                </div>
                <div className="table-responsive">
                  <table className="table tech-table">
                    <thead>
                      <tr>
                        <th>名稱</th>
                        <th>價格</th>
                        <th>狀態</th>
                        <th>詳情</th>
                      </tr>
                    </thead>
                    <tbody>
                      {articles.map(art => (
                        <tr key={art.id} onClick={() => setSelectedArticle(art)}>
                          <td><span className="text-cyan">{art.title}</span></td>
                          <td><span>${art.price}</span></td>
                          <td>
                            <span className={`badge ${art.is_enabled ? 'bg-success text-dark' : 'bg-danger'}`}>
                              {art.is_enabled ? '啟用' : '停用'}
                            </span>
                          </td>
                          <td><button className="btn btn-sm btn-outline-info">查看</button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="col-lg-7">
              <div className="card glass-card p-4">
                <h6 className="text-cyan mb-4">文章詳細資訊編輯</h6>
                {selectedArticle ? (
                  <div className="row">
                    <div className="col-md-5">
                      <div className="main-img-container mb-3">
                        <img src={selectedArticle.imageUrl} className="img-fluid" alt="Article" />
                      </div>
                      <label className="form-label">其他附圖</label>
                      <div className="d-flex gap-2 flex-wrap">
                        {selectedArticle.imagesUrl?.map((img, index) => (
                          img && (
                            <div key={index} style={{ width: '80px', height: '80px', background: 'rgba(255,255,255,0.1)', borderRadius: '8px', overflow: 'hidden' }}>
                              <img src={img} className="img-fluid w-100 h-100" style={{ objectFit: 'cover' }} alt="Article sub" />
                            </div>
                          )
                        ))}
                      </div>
                    </div>

                    <div className="col-md-7">
                      <div className="mb-3">
                        <label className="form-label">文章名稱</label>
                        <input type="text" className="form-control" value={selectedArticle.title} readOnly />
                      </div>
                      <div className="row">
                        <div className="col-6 mb-3">
                          <label className="form-label">類型</label>
                          <input type="text" className="form-control" value={selectedArticle.category} readOnly />
                        </div>
                        <div className="col-6 mb-3">
                          <label className="form-label">狀態</label>
                          <select className="form-select" value={selectedArticle.is_enabled} readOnly>
                            <option value={1}>啟用中</option>
                            <option value={0}>已停用</option>
                          </select>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-6 mb-3">
                          <label className="form-label">原價</label>
                          <input type="text" className="form-control" value={selectedArticle.origin_price} readOnly />
                        </div>
                        <div className="col-6 mb-3">
                          <label className="form-label">售價</label>
                          <input type="text" className="form-control text-cyan fw-bold" value={selectedArticle.price} readOnly />
                        </div>
                      </div>
                    </div>

                    <div className="col-12 mt-3">
                      <label className="form-label">文章描述</label>
                      <textarea className="form-control mb-3" rows="2" value={selectedArticle.description} readOnly></textarea>
                      <label className="form-label">完整內容</label>
                      <textarea className="form-control" rows="5" value={selectedArticle.content} readOnly></textarea>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-white-50 mt-5">請點擊左側列表查看詳細資訊</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    ) : (
      /* --- 登入介面 --- */
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
                        <h2 className="fw-bold">系統登入 <span className="text-cyan">Login</span></h2>
                        <p className="text-white-50 small mt-2">RESTful API 串接實戰</p>
                      </div>
                      <form onSubmit={handleLogin}>
                        <div className="mb-4">
                          <label className="form-label small text-white-50">電子郵件 (Email)</label>
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
                          <label className="form-label small text-white-50">密碼 (Password)</label>
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
                          <button type="submit" className="btn btn-primary btn-login py-3">立即驗證登入</button>
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
    )
  );
}

export default App;