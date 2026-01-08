import { useState, useEffect, useRef } from "react";
import "./App.css";
import axios from "axios";
import { Modal } from "bootstrap";

function App() {
  const [account, setAccount] = useState({
    email: "",
    pass: "",
  });

  // modal 預設值
  const defaultModalState = {
    imageUrl: "",
    title: "",
    category: "",
    unit: "",
    origin_price: "",
    price: "",
    description: "",
    content: "",
    is_enabled: 0,
    imagesUrl: [""],
  };

  const [isAuth, setIsAuth] = useState(false);
  const [articles, setArticles] = useState([]);
  const [selectedArticle, setSelectedArticle] = useState(defaultModalState);
  const [modalOpenType, setModalOpenType] = useState(null);

  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const API_PATH = import.meta.env.VITE_API_PATH;

  const productModalRef = useRef(null);

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

  const getProducts = () => {
    axios
      .get(`${BASE_URL}/v2/api/${API_PATH}/admin/products/all`)
      .then((res) => {
        setArticles(Object.values(res.data.products));
      })
      .catch((err) => console.log(err));
  };

  const handleCheckLogin = () => {
    axios
      .post(`${BASE_URL}/v2/api/user/check`)
      .then(() => {
        setIsAuth(true);
        getProducts();
      })
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    const defaultToken = document.cookie.replace(
      /(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/,
      "$1"
    );
    if (defaultToken) {
      axios.defaults.headers.common["Authorization"] = defaultToken;
      handleCheckLogin();
    }
  }, []);

  useEffect(() => {
    // 確保只初始化一次
    if (productModalRef.current) {
      new Modal(productModalRef.current);
    }
  }, []);

  // 開啟 Modal
  const handelOpenModal = (openType, art) => {
    setModalOpenType(openType);
    // 如果是新增，就傳入預設值；如果是編輯，就傳入點選的那篇文章
    setSelectedArticle(openType === "create" ? defaultModalState : art);
    const modalInstance = Modal.getInstance(productModalRef.current);
    modalInstance.show();
  };

  // 關閉 Modal
  const handelCloseModal = () => {
    const modalInstance = Modal.getInstance(productModalRef.current);
    modalInstance.hide();
  };

  // 處理 Modal 內的 Input 變更
  const handleModalInputChange = (e) => {
    const { value, name, type, checked } = e.target;
    setSelectedArticle({
      ...selectedArticle,
      // Checkbox 必須讀取 checked 值
      [name]: type === "checkbox" ? (checked ? 1 : 0) : value,
    });
  };

  //處理副圖
  const handleImageChange = (e, index) => {
    const { value } = e.target;
    const newImages = [...selectedArticle.imagesUrl];
    newImages[index] = value;
    setSelectedArticle({
      ...selectedArticle,
      imagesUrl: newImages,
    });
  };

  //新增副圖
  const handleAddImages = () => {
    const newImages = [...selectedArticle.imagesUrl, ""];
    setSelectedArticle({
      ...selectedArticle,
      imagesUrl: newImages,
    });
  };
  //刪除副圖
  const handleDeleteImages = () => {
    const newImages = [...selectedArticle.imagesUrl];
    newImages.pop();
    setSelectedArticle({
      ...selectedArticle,
      imagesUrl: newImages,
    });
  };

  //新增文章API
  const createArticle = async () => {
    try {
      await axios
        .post(`${BASE_URL}/v2/api/${API_PATH}/admin/product`, {
          data: {
            ...selectedArticle,
            origin_price: Number(selectedArticle.origin_price),
            price: Number(selectedArticle.price),
            is_enabled: selectedArticle.is_enabled ? 1 : 0,
          },
        })
        .then(() => {
          handelCloseModal();
          getProducts();
        });
    } catch (error) {
      console.log(error);
      alert("新增文章失敗");
    }
  };

  //編輯文章API
  const updateArticle = async (id) => {
    try {
      await axios
        .put(`${BASE_URL}/v2/api/${API_PATH}/admin/product/${id}`, {
          data: {
            ...selectedArticle,
            origin_price: Number(selectedArticle.origin_price),
            price: Number(selectedArticle.price),
            is_enabled: selectedArticle.is_enabled ? 1 : 0,
          },
        })
        .then(() => {
          handelCloseModal();
          getProducts();
        });
    } catch (error) {
      console.log(error);
      alert("更新文章失敗");
    }
  };

  //刪除文章API
  const deleteArticle = async (id) => {
    try {
      await axios
        .delete(`${BASE_URL}/v2/api/${API_PATH}/admin/product/${id}`)
        .then(() => {
          getProducts();
        });
    } catch (error) {
      console.log(error);
      alert("刪除文章失敗");
    }
  };

  //點擊儲存呼叫
  const handleUpdateArticle = () => {
    modalOpenType === "edit"
      ? updateArticle(selectedArticle.id)
      : createArticle();
  };

  // // 先定義一個 sleep 函式
  // const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  // //匯入測試資料
  // const handelttt = async () => {
  //   const testdata = [
  //     {
  //       category: "工具",
  //       title: "VS Code 高效插件包",
  //       unit: "組",
  //       origin_price: 500,
  //       price: 0,
  //       is_enabled: 1,
  //       description: "前端工程師必裝的 20 個插件，提升兩倍開發效率。",
  //       content: "包含 Prettier, ESLint, GitLens 等設定與教學檔。",
  //       imageUrl:
  //         "https://images.unsplash.com/photo-1587620962725-abab7fe55159?q=80&w=1000",
  //       imagesUrl: [
  //         "https://images.unsplash.com/photo-1542744095-2ad4870f60dd?q=80&w=800",
  //         "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=800",
  //         "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=800",
  //       ],
  //     },
  //     {
  //       category: "框架",
  //       title: "Vue3 + Vite 快速開發套件",
  //       unit: "組",
  //       origin_price: 2500,
  //       price: 2100,
  //       is_enabled: 1,
  //       description: "極速啟動！利用 Vite 構建你的下一個 Vue3 組件庫。",
  //       content: "整合 Composition API 與 Pinia 狀態管理。",
  //       imageUrl:
  //         "https://images.unsplash.com/photo-1551033406-611cf9a28f67?q=80&w=1000",
  //       imagesUrl: [
  //         "https://images.unsplash.com/photo-1454165833767-027ffea70250?q=80&w=800",
  //         "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?q=80&w=800",
  //         "https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=800",
  //       ],
  //     },
  //     {
  //       category: "設計",
  //       title: "UI/UX 響應式原型模組",
  //       unit: "套",
  //       origin_price: 4500,
  //       price: 3800,
  //       is_enabled: 1,
  //       description: "專為前端工程師設計的 Figma 轉網頁模組。",
  //       content: "包含多種導覽列、側邊欄及資訊面板組件。",
  //       imageUrl:
  //         "https://images.unsplash.com/photo-1586717791821-3f44a563eb4c?q=80&w=1000",
  //       imagesUrl: [
  //         "https://images.unsplash.com/photo-1558655146-d09347e92766?q=80&w=800",
  //         "https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=800",
  //         "https://images.unsplash.com/photo-1576153192396-180ecef2a715?q=80&w=800",
  //       ],
  //     },
  //     {
  //       category: "語言",
  //       title: "Node.js 前端開發者後端入門",
  //       unit: "堂",
  //       origin_price: 3600,
  //       price: 3100,
  //       is_enabled: 1,
  //       description: "前端工程師如何快速切換到後端？Node.js 與 Express 實作。",
  //       content: "學習建立 RESTful API 並與資料庫(MongoDB)串接。",
  //       imageUrl:
  //         "https://images.unsplash.com/photo-1504639725590-34d0984388bd?q=80&w=1000",
  //       imagesUrl: [
  //         "https://images.unsplash.com/photo-1510915228340-29c85a43dcfe?q=80&w=800",
  //         "https://images.unsplash.com/photo-1534665482403-a909d0d97c67?q=80&w=800",
  //         "https://images.unsplash.com/photo-1516116216624-53e697fedbea?q=80&w=800",
  //       ],
  //     },
  //     {
  //       category: "工具",
  //       title: "Docker 容器化前端部署",
  //       unit: "份",
  //       origin_price: 1500,
  //       price: 1200,
  //       is_enabled: 1,
  //       description: "一鍵部署環境，讓你的前端專案在各個環境運行無礙。",
  //       content: "教你如何撰寫 Dockerfile 並與 Nginx 整合部署。",
  //       imageUrl:
  //         "https://images.unsplash.com/photo-1605745341112-85968b19335b?q=80&w=1000",
  //       imagesUrl: [
  //         "https://images.unsplash.com/photo-1667372333318-3d4409395f19?q=80&w=800",
  //         "https://images.unsplash.com/photo-1579820010410-dc90e887a367?q=80&w=800",
  //         "https://images.unsplash.com/photo-1558494949-ef010cbdcc51?q=80&w=800",
  //       ],
  //     },
  //     {
  //       category: "框架",
  //       title: "Angular 進階組件開發",
  //       unit: "堂",
  //       origin_price: 4200,
  //       price: 3600,
  //       is_enabled: 1,
  //       description: "企業級專案首選框架，學習 RxJS 與 Dependency Injection。",
  //       content: "專為大型單頁應用設計，包含進階指令(Directives)應用。",
  //       imageUrl:
  //         "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=1000",
  //       imagesUrl: [
  //         "https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=800",
  //         "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=800",
  //         "https://images.unsplash.com/photo-1550439062-609e1531270e?q=80&w=800",
  //       ],
  //     },
  //     {
  //       category: "設計",
  //       title: "Tailwind CSS 高效開發術",
  //       unit: "份",
  //       origin_price: 900,
  //       price: 680,
  //       is_enabled: 1,
  //       description: "不需要寫 CSS 也能做出精美網頁？Utility-first 的魅力。",
  //       content: "介紹如何自定義設定檔並加速開發流程。",
  //       imageUrl:
  //         "https://images.unsplash.com/photo-1587620962725-abab7fe55159?q=80&w=1000",
  //       imagesUrl: [
  //         "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=800",
  //         "https://images.unsplash.com/photo-1551033406-611cf9a28f67?q=80&w=800",
  //         "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=800",
  //       ],
  //     },
  //     {
  //       category: "語言",
  //       title: "JavaScript 演算法實戰",
  //       unit: "本",
  //       origin_price: 1200,
  //       price: 1080,
  //       is_enabled: 1,
  //       description: "前端工程師面試必備，從遞迴到動態規劃的完整解析。",
  //       content: "包含 LeetCode 前 100 題解法範例。",
  //       imageUrl:
  //         "https://images.unsplash.com/photo-1503252947848-7028f1e362fb?q=80&w=1000",
  //       imagesUrl: [
  //         "https://images.unsplash.com/photo-1510915228340-29c85a43dcfe?q=80&w=800",
  //         "https://images.unsplash.com/photo-1516116216624-53e697fedbea?q=80&w=800",
  //         "https://images.unsplash.com/photo-1555949963-aa79dcee981c?q=80&w=800",
  //       ],
  //     },
  //     {
  //       category: "工具",
  //       title: "Figma 到前端實作工作坊",
  //       unit: "堂",
  //       origin_price: 2200,
  //       price: 1800,
  //       is_enabled: 1,
  //       description: "設計師與工程師的橋樑，學習標記、匯出與組件協作。",
  //       content: "使用 Figma Variables 加速顏色與間距管理。",
  //       imageUrl:
  //         "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?q=80&w=1000",
  //       imagesUrl: [
  //         "https://images.unsplash.com/photo-1572044162444-ad60f128bde2?q=80&w=800",
  //         "https://images.unsplash.com/photo-1559028012-481c04fa702d?q=80&w=800",
  //         "https://images.unsplash.com/photo-1534312527009-56c7016453e6?q=80&w=800",
  //       ],
  //     },
  //     {
  //       category: "進階",
  //       title: "前端效能優化秘笈",
  //       unit: "本",
  //       origin_price: 1600,
  //       price: 1350,
  //       is_enabled: 1,
  //       description: "讓網站秒開！資源快取、圖片延遲加載與異步腳本優化。",
  //       content: "介紹 Web Worker 與 Service Worker 的進階用法。",
  //       imageUrl:
  //         "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1000",
  //       imagesUrl: [
  //         "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800",
  //         "https://images.unsplash.com/photo-1531297484001-80022131f5a1?q=80&w=800",
  //         "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=800",
  //       ],
  //     },
  //     {
  //       category: "基礎",
  //       title: "Web 安全開發實務",
  //       unit: "份",
  //       origin_price: 2000,
  //       price: 1700,
  //       is_enabled: 1,
  //       description: "防範 XSS 與 CSRF，保護你的使用者數據不外洩。",
  //       content: "解析常見的 Web 攻擊手法與現代防護標準。",
  //       imageUrl:
  //         "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1000",
  //       imagesUrl: [
  //         "https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=800",
  //         "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=800",
  //         "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=800",
  //       ],
  //     },
  //   ];

  //   testdata.forEach(async (item) => {
  //     try {
  //       await axios
  //         .post(`${BASE_URL}/v2/api/${API_PATH}/admin/product`, {
  //           data: item,
  //         })
  //         .then(() => {
  //           sleep(3000);
  //           console.log(item);
  //         });
  //     } catch (error) {
  //       console.log(error);
  //       alert("新增文章失敗");
  //     }
  //   });
  // };

  return (
    <>
      {isAuth ? (
        <div className="admin-wrapper">
          <div className="container">
            <h3 className="mb-4 fw-bold text-white">
              <span className="text-cyan">CODEBLOOM</span> 文章後台管理
            </h3>
            <div className="row g-4">
              <div className="col-lg-12">
                <div className="card glass-card">
                  <div className="p-3 border-bottom border-secondary d-flex justify-content-between">
                    <h6 className="m-0 text-cyan">文章清單列表</h6>
                    <button
                      className="btn btn-sm btn-outline-info "
                      onClick={() => handelOpenModal("create")}
                    >
                      新增文章
                    </button>
                    {/* <button
                      className="btn btn-sm btn-outline-info"
                      onClick={() => handelttt()}
                    >
                      匯入資料
                    </button> */}
                  </div>
                  <div className="table-responsive">
                    <table className="table tech-table">
                      <thead>
                        <tr>
                          <th>名稱</th>
                          <th>價格</th>
                          <th>狀態</th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody>
                        {articles.map((art) => (
                          <tr key={art.id}>
                            <td>
                              <span className="text-cyan">{art.title}</span>
                            </td>
                            <td>
                              <span className="text-cyan">${art.price}</span>
                            </td>
                            <td>
                              <span
                                className={`badge ${
                                  art.is_enabled
                                    ? "bg-success text-dark"
                                    : "bg-danger"
                                }`}
                              >
                                {art.is_enabled ? "啟用" : "停用"}
                              </span>
                            </td>
                            <td>
                              <div className="btn-group">
                                <button
                                  type="button"
                                  className="btn btn-outline-primary btn-sm me-2"
                                  onClick={() => handelOpenModal("edit", art)}
                                >
                                  編輯
                                </button>
                                <button
                                  type="button"
                                  className="btn btn-outline-danger btn-sm"
                                  onClick={() => deleteArticle(art.id)}
                                >
                                  刪除
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
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
      )}

      {/* --- Modal 結構 --- */}
      <div
        ref={productModalRef}
        id="productModal"
        className="modal fade"
        style={{ backgroundColor: "rgba(0,0,0,0.7)" }}
      >
        <div className="modal-dialog modal-dialog-centered modal-xl">
          <div className="modal-content glass-card border-secondary shadow-lg text-white">
            <div className="modal-header border-bottom border-secondary">
              <h5 className="modal-title fs-4 text-cyan fw-bold">
                {modalOpenType === "edit" ? "編輯文章" : "新增文章"}
              </h5>
              <button
                type="button"
                className="btn-close btn-close-white"
                onClick={handelCloseModal}
              ></button>
            </div>

            <div className="modal-body p-4">
              <div className="row g-4">
                <div className="col-md-4">
                  <div className="mb-4">
                    <label className="form-label text-white-50 small">
                      主圖連結
                    </label>
                    <div className="input-group">
                      <input
                        onChange={handleModalInputChange}
                        value={selectedArticle.imageUrl || ""}
                        name="imageUrl"
                        type="text"
                        className="form-control bg-dark text-white border-secondary"
                        placeholder="請輸入圖片連結"
                      />
                    </div>
                    {selectedArticle?.imageUrl && (
                      <div className="mt-3 main-img-container shadow-sm">
                        <img
                          src={selectedArticle.imageUrl}
                          alt="主圖"
                          className="img-fluid rounded"
                        />
                      </div>
                    )}
                  </div>

                  <div className="border border-secondary border-dashed rounded-3 p-3 bg-opacity-10 bg-white">
                    <div className="d-flex gap-2 flex-wrap">
                      {(selectedArticle?.imagesUrl || []).map(
                        (image, index) => (
                          <div key={index} className="mb-2 w-100">
                            <label className="form-label text-cyan small mb-3">
                              副圖{index + 1}
                            </label>
                            <input
                              type="text"
                              placeholder={`圖片網址 ${index + 1}`}
                              className="form-control form-control-sm bg-dark text-white border-secondary mb-2"
                              value={image || ""}
                              onChange={(e) =>
                                handleImageChange(e, index)
                              } /* 副圖變更邏輯較廣，此處先保持 value 綁定 */
                            />
                            {image && (
                              <div
                                style={{
                                  width: "80px",
                                  height: "80px",
                                  background: "rgba(255,255,255,0.1)",
                                  borderRadius: "8px",
                                  overflow: "hidden",
                                  border: "1px solid rgba(0, 242, 254, 0.3)",
                                }}
                              >
                                <img
                                  src={image}
                                  className="img-fluid w-100 h-100"
                                  style={{ objectFit: "cover" }}
                                  alt={`sub-${index}`}
                                />
                              </div>
                            )}
                          </div>
                        )
                      )}
                      <div className="btn-group w-100 mb-3">
                        {selectedArticle.imagesUrl.length < 5 &&
                          selectedArticle.imagesUrl[
                            selectedArticle.imagesUrl.length - 1
                          ] !== "" && (
                            <button
                              onClick={handleAddImages}
                              className="btn btn-outline-primary btn-sm w-100 me-2"
                            >
                              新增圖片
                            </button>
                          )}

                        {selectedArticle.imagesUrl.length > 1 && (
                          <button
                            onClick={handleDeleteImages}
                            className="btn btn-outline-danger btn-sm w-100"
                          >
                            取消圖片
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-md-8">
                  <div className="mb-3">
                    <label className="form-label text-white-50 small">
                      標題
                    </label>
                    <input
                      onChange={handleModalInputChange}
                      value={selectedArticle.title || ""}
                      name="title"
                      type="text"
                      className="form-control bg-dark text-white border-secondary"
                    />
                  </div>

                  <div className="row g-3">
                    <div className="col-md-6 mb-3">
                      <label className="form-label text-white-50 small">
                        分類
                      </label>
                      <input
                        onChange={handleModalInputChange}
                        value={selectedArticle.category || ""}
                        name="category"
                        type="text"
                        className="form-control bg-dark text-white border-secondary"
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label text-white-50 small">
                        單位
                      </label>
                      <input
                        onChange={handleModalInputChange}
                        value={selectedArticle.unit || ""}
                        name="unit"
                        type="text"
                        className="form-control bg-dark text-white border-secondary"
                      />
                    </div>
                  </div>

                  <div className="row g-3 mb-3">
                    <div className="col-6">
                      <label className="form-label text-white-50 small">
                        原價
                      </label>
                      <input
                        onChange={handleModalInputChange}
                        value={selectedArticle.origin_price || ""}
                        name="origin_price"
                        type="number"
                        className="form-control bg-dark text-white border-secondary"
                      />
                    </div>
                    <div className="col-6">
                      <label className="form-label text-white-50 small">
                        售價
                      </label>
                      <input
                        onChange={handleModalInputChange}
                        value={selectedArticle.price || ""}
                        name="price"
                        type="number"
                        className="form-control bg-dark text-cyan fw-bold border-secondary"
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label text-white-50 small">
                      產品描述
                    </label>
                    <textarea
                      onChange={handleModalInputChange}
                      value={selectedArticle.description || ""}
                      name="description"
                      className="form-control bg-dark text-white border-secondary"
                      rows={3}
                    ></textarea>
                  </div>

                  <div className="mb-3">
                    <label className="form-label text-white-50 small">
                      說明內容
                    </label>
                    <textarea
                      onChange={handleModalInputChange}
                      value={selectedArticle.content || ""}
                      name="content"
                      className="form-control bg-dark text-white border-secondary"
                      rows={3}
                    ></textarea>
                  </div>

                  <div className="form-check mt-3">
                    <input
                      onChange={handleModalInputChange}
                      checked={!!selectedArticle.is_enabled}
                      name="is_enabled"
                      type="checkbox"
                      className="form-check-input"
                      id="isEnabled"
                    />
                    <label
                      className="form-check-label text-cyan"
                      htmlFor="isEnabled"
                    >
                      是否啟用產品
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer border-top border-secondary bg-transparent">
              <button
                type="button"
                className="btn btn-outline-light"
                onClick={handelCloseModal}
              >
                取消
              </button>
              <button
                type="button"
                className="btn btn-primary px-4"
                onClick={handleUpdateArticle}
              >
                確認儲存
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
