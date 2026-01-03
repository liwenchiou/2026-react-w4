import { useState } from 'react';
import './App.css';
import axios from 'axios';

function App() {
  //儲存登入表單資料
  const [account, setAccount] = useState({
    email: "codebloom@gmail.com",
    pass: "codebloom",
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
  const API_PATH = import.meta.env.VITE_API_PATH;

  //存放token
  const [isAuth, setIsAuth] = useState(false);

  //文章列表
  const [articles, setArticles] = useState([]);
  const [selectedArticle, setSelectedArticle] = useState(null);

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
          // console.log(res.data.token);
          //cookie存放token
          const { token, expired } = res.data;
          // console.log(`token=> ${token}`);
          // console.log(`expired=> ${expired}`);
          //把 token 跟 expired 存到 cookie中
          document.cookie = `hexToken=${token}; expires=${new Date(expired)}`;
          setIsAuth(true);

          //請求前先帶上 token
          axios.defaults.headers.common['Authorization'] = token;
          //抓取文章列表
          axios.get(`${BASE_URL}/v2/api/${API_PATH}/admin/products/all`)
            .then((res) => {
              console.log(res.data.products);
              setArticles(Object.values(res.data.products));
            })
            .catch((err) => {
              console.log(err);
            })
        }
      })
      .catch((err) => {
        console.log(err);
      })
  }

  //文章列表
  // 模擬文章資料


  return (
    isAuth ? (
      <div className="admin-wrapper">
        <div className="container-fluid">
          <h3 className="mb-4 fw-bold text-white"><span className="text-cyan">CODEBLOOM</span> 文章後台管理</h3>

          <div className="row g-4">
            {/* 左側：文章清單 (佔 5 欄) */}
            <div className="col-lg-5">
              <div className="card glass-card">
                <div className="p-3 border-bottom border-secondary">
                  <h6 className="m-0 text-cyan">文章清單列表</h6>
                </div>
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
                      // console.log(art.id)
                      <tr key={art.id} onClick={() => setSelectedArticle(art)}>
                        <td><span className="text-cyan">{art.title}</span></td>
                        <td><span className="text-cyan">${art.price}</span></td>
                        <td>
                          {art.is_enabled ?
                            <span className="badge bg-success text-dark">啟用</span> :
                            <span className="badge bg-danger">停用</span>
                          }
                        </td>
                        <td><button className="btn btn-sm btn-outline-info">查看</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* 右側：詳情內容 (加寬至 7 欄) */}
            <div className="col-lg-7">
              <div className="card glass-card p-4">
                <h6 className="text-cyan mb-4">文章詳細資訊編輯</h6>
                {selectedArticle && (
                  <div className="row">
                    <div className="col-md-5">
                      <div className="main-img-container">
                        <img src={selectedArticle.imageUrl} className="img-fluid" alt="Article" />
                      </div>
                      <label className="form-label">其他附圖</label>
                      <div className="d-flex gap-2">
                        {
                          selectedArticle.imagesUrl.map((img, index) => (
                            img ? (
                              <div style={{ width: '100px', height: '100px', background: 'rgba(255,255,255,0.1)' }}>
                                <img key={index} src={img} className="img-fluid" alt="Article" />
                              </div>
                            ) : null
                          ))
                        }
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
                          <select className="form-select">
                            <option>{selectedArticle.is_enabled ? '啟用中' : '已停用'}</option>
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
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    ) : (
      //未登入
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
    )
  )
}

export default App;