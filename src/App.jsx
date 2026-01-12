import { useState } from "react";
import "./App.css";
import axios from "axios";
import { Modal } from "bootstrap";
import Auth from "./Auth";
import ArticleList from "./ArticleList";
const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_PATH = import.meta.env.VITE_API_PATH;

function App() {
  const [isAuth, setIsAuth] = useState(false);
  const [articles, setArticles] = useState([]);

  const getProducts = () => {
    axios
      .get(`${BASE_URL}/v2/api/${API_PATH}/products/all`)
      .then((res) => {
        setArticles(Object.values(res.data.products));
      })
      .catch((err) => console.log(err));
  };

  return (
    <>
      {isAuth ? (
        <ArticleList
          articles={articles}
          setIsAuth={setIsAuth}
          getProducts={getProducts}
        />
      ) : (
        <Auth setIsAuth={setIsAuth} getProducts={getProducts} />
      )}
    </>
  );
}

export default App;
