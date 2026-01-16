import { useState, useEffect, useRef } from "react";
import { Modal } from "bootstrap";
import axios from "axios";
import Pagination from "../components/Pagination"
import ProductModal from "../modal/ProductModal"
const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_PATH = import.meta.env.VITE_API_PATH;
function ArticleList({ articles, getProducts, pageInfo }) {
  const productModalRef = useRef(null);

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



  //圖片上傳
  const handleFileChange = async (e) => {
    // console.log(e);
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("file-to-upload", file);
    try {
      const res = await axios.post(
        `${BASE_URL}/v2/api/${API_PATH}/admin/upload`,
        formData
      );
      const uploadedImageUrl = res.data.imageUrl;
      setSelectedArticle({
        ...selectedArticle,
        imageUrl: uploadedImageUrl,
      });
    } catch (error) {
      alert("圖片上傳失敗！！");
      console.log(error);
    }
  };
  return (
    <>
      <div className="admin-wrapper">
        <div className="container mb-3">
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
{/* 分頁 */}
<Pagination pageInfo={pageInfo} getProducts={getProducts}/>

      </div>

      {/* --- Modal 結構 --- */}
      <ProductModal 
      productModalRef={productModalRef} 
      modalOpenType={modalOpenType} 
      handelCloseModal={handelCloseModal}
      handleFileChange={handleFileChange}
      handleModalInputChange={handleModalInputChange}
      selectedArticle={selectedArticle}
      handleImageChange={handleImageChange}
      handleAddImages={handleAddImages}
      handleDeleteImages={handleDeleteImages}
      handleUpdateArticle={handleUpdateArticle}/>

    </>
  );
}

export default ArticleList;
