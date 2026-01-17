function ProductModal({productModalRef,modalOpenType,handelCloseModal,handleFileChange,handleModalInputChange,selectedArticle,handleImageChange,handleAddImages,handleDeleteImages,handleUpdateArticle}) {
  return (
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
                <div className="mb-5">
                  <label htmlFor="fileInput" className="form-label">
                    圖片上傳
                  </label>
                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png"
                    className="form-control"
                    id="fileInput"
                    onChange={handleFileChange}
                  />
                </div>
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
                    {(selectedArticle?.imagesUrl || []).map((image, index) => (
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
                    ))}
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
                  <label className="form-label text-white-50 small">標題</label>
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
                  <div className="col">
                    <label className="form-label text-white-50 small">
                      喜好程度（自訂欄位）
                    </label>
                    <input
                      onChange={handleModalInputChange}
                      value={selectedArticle.like_count || ""}
                      name="like_count"
                      type="number"
                      className="form-control bg-dark text-white border-secondary"
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
  );
}

export default ProductModal;
