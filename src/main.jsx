import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom' 
import './index.css'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import App from './App.jsx'
import { ProductProvider } from "./context/ProductContext";


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ProductProvider>
    <BrowserRouter> 
    <App />
    </BrowserRouter>
    </ProductProvider>
     </StrictMode>,
)
