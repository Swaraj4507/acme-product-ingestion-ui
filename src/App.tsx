import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { Layout } from "@/components/Layout";
import { DashboardPage } from "@/pages/DashboardPage";
import { UploadPage } from "@/pages/UploadPage";
import { ProductsPage } from "@/pages/ProductsPage";
import { WebhooksPage } from "@/pages/WebhooksPage";

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/upload" element={<UploadPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/webhooks" element={<WebhooksPage />} />
        </Routes>
      </Layout>
      <Toaster position="top-center" />
    </BrowserRouter>
  );
}

export default App;
