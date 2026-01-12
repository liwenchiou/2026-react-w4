import { useState, useEffect } from "react";
import "./App.css";
import axios from "axios";
import Auth from "./Auth";
import ArticleList from "./ArticleList";
const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_PATH = import.meta.env.VITE_API_PATH;

function App() {
  const [isAuth, setIsAuth] = useState(false);
  const [articles, setArticles] = useState([]);
  const [pageInfo, setPageInfo] = useState({});

  const getProducts = (page=1) => {
    axios
      .get(`${BASE_URL}/v2/api/${API_PATH}/admin/products?page=${page}`)
      .then((res) => {
        setArticles(Object.values(res.data.products));
        setPageInfo(res.data.pagination);
        console.log(res.data.pagination);
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

  return (
    <>
      {isAuth ? (
        <ArticleList articles={articles} getProducts={getProducts} pageInfo={pageInfo}/>
      ) : (
        <Auth setIsAuth={setIsAuth} getProducts={getProducts} />
      )}
    </>
  );
}

export default App;
