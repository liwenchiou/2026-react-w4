import { useState, useEffect, useRef } from "react";
import { Modal } from "bootstrap";
import axios from "axios";
const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_PATH = import.meta.env.VITE_API_PATH;
function Article({ articles, setIsAuth, getProducts }) {
  const productModalRef = useRef(null);
  const handleCheckLogin = () => {
    axios
      .post(`${BASE_URL}/v2/api/user/check`)
      .then(() => {
        setIsAuth(true);
        getProducts();
      })
      .catch((error) => console.log(error));
  };
  const [modalOpenType, setModalOpenType] = useState(null);
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
  const [selectedArticle, setSelectedArticle] = useState(defaultModalState);
  // 開啟 Modal
  const handelOpenModal = (openType, art) => {
    setModalOpenType(openType);
    // 如果是新增，就傳入預設值；如果是編輯，就傳入點選的那篇文章
    setSelectedArticle(openType === "create" ? defaultModalState : art);
    const modalInstance = Modal.getInstance(productModalRef.current);
    modalInstance.show();
  };
  useEffect(() => {
    // 確保只初始化一次
    if (productModalRef.current) {
      new Modal(productModalRef.current);
    }
  }, []);
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
  return (
    <>
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

export default Article;
