import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import ruRU from 'antd/locale/ru_RU';
import AdminLayout from './layouts/AdminLayout';
import DashboardPage from './pages/Dashboard';
import { StoresPage, StoreDetailPage } from './pages/Stores';
import ClientsPage from './pages/Clients';
import WhatsAppChatPage from './pages/WhatsAppChat';

export default function App() {
  return (
    <ConfigProvider
      locale={ruRU}
      theme={{
        token: {
          colorPrimary: '#1677ff',
          colorText: '#000000e0',
          colorTextSecondary: '#00000073',
          colorBgLayout: '#f5f5f5',
          borderRadius: 6,
          fontFamily:
            "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
        },
        components: {
          Layout: {
            siderBg: '#fff',
          },
        },
      }}
    >
      <BrowserRouter>
        <Routes>
          <Route element={<AdminLayout />}>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/stores" element={<StoresPage />} />
            <Route path="/stores/:id" element={<StoreDetailPage />} />
            <Route path="/clients" element={<ClientsPage />} />
            <Route path="/whatsapp" element={<WhatsAppChatPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ConfigProvider>
  );
}
