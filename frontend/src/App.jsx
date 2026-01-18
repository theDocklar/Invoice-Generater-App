import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Invoices from "./pages/Invoices.jsx";
import Clients from "./pages/Clients.jsx";
import CreateInvoice from "./pages/CreateInvoice.jsx";
import Layout from "./components/Layout.jsx";
import { ToastProvider } from "./components/Toast.jsx";

function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/dashboard"
            element={
              <Layout>
                <Dashboard />
              </Layout>
            }
          />
          <Route
            path="/invoices"
            element={
              <Layout>
                <Invoices />
              </Layout>
            }
          />
          <Route
            path="/clients"
            element={
              <Layout>
                <Clients />
              </Layout>
            }
          />
          <Route
            path="/create-invoice"
            element={
              <Layout>
                <CreateInvoice />
              </Layout>
            }
          />
          <Route
            path="/edit-invoice/:id"
            element={
              <Layout>
                <CreateInvoice />
              </Layout>
            }
          />
        </Routes>
      </BrowserRouter>
    </ToastProvider>
  );
}

export default App;
