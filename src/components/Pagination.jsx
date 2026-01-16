function Pagination({pageInfo,getProducts}) {
      //點擊換頁
  const handleChangePage = (page) => {
    console.log(page);
    getProducts(page);
  };
  return (
    <div className="d-flex justify-content-center mt-4">
      <nav aria-label="Page navigation">
        <ul className="pagination custom-pagination">
          {/* 上一頁 */}
          <li className={`page-item ${!pageInfo.has_pre ? "disabled" : ""}`}>
            <button
              className="page-link"
              onClick={() => handleChangePage(pageInfo.current_page - 1)}
              disabled={!pageInfo.has_pre}
            >
              &laquo;
            </button>
          </li>

          {/* 頁碼 */}
          {Array.from({ length: pageInfo.total_pages }).map((_, index) => (
            <li
              key={index + 1}
              className={`page-item ${
                pageInfo.current_page === index + 1 ? "active" : ""
              }`}
            >
              <button
                className="page-link"
                onClick={() => handleChangePage(index + 1)}
              >
                {index + 1}
              </button>
            </li>
          ))}

          {/* 下一頁 */}
          <li className={`page-item ${!pageInfo.has_next ? "disabled" : ""}`}>
            <button
              className="page-link"
              onClick={() => handleChangePage(pageInfo.current_page + 1)}
              disabled={!pageInfo.has_next}
            >
              &raquo;
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default Pagination;
