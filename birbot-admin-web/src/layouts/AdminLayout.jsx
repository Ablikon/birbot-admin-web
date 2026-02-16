import {
  HomeOutlined,
  ShopOutlined,
  TeamOutlined,
  WhatsAppOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import { Layout, Menu } from 'antd';
import { useLocation, useNavigate, Outlet } from 'react-router-dom';

const { Sider, Content } = Layout;

const menuItems = [
  { key: '/', icon: <HomeOutlined />, label: 'Главная' },
  { key: '/stores', icon: <ShopOutlined />, label: 'Магазины' },
  { key: '/clients', icon: <TeamOutlined />, label: 'Клиенты' },
  { key: '/whatsapp', icon: <WhatsAppOutlined />, label: 'WhatsApp чат' },
];

export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  const selectedKey =
    menuItems
      .filter((i) => i.key !== '/')
      .find((i) => location.pathname.startsWith(i.key))?.key ?? '/';

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        width={220}
        style={{
          background: '#fff',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          overflow: 'auto',
          borderRight: '1px solid #f0f0f0',
        }}
      >
        <div style={{ padding: '20px 16px 12px', borderBottom: '1px solid #f0f0f0', marginBottom: 4 }}>
          <div style={{ color: '#000000e0', fontWeight: 700, fontSize: 18 }}>Birbot</div>
          <div style={{ color: '#00000073', fontSize: 12 }}>Админ панель</div>
        </div>

        <Menu
          mode="inline"
          selectedKeys={[selectedKey]}
          onClick={({ key }) => navigate(key)}
          items={menuItems}
          style={{ borderRight: 0, fontWeight: 500 }}
        />

        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, borderTop: '1px solid #f0f0f0' }}>
          <Menu
            mode="inline"
            selectable={false}
            items={[{ key: 'logout', icon: <LogoutOutlined />, label: 'Выйти', danger: true }]}
            style={{ borderRight: 0 }}
          />
        </div>
      </Sider>

      <Layout style={{ marginLeft: 220, background: '#f5f5f5' }}>
        <Content style={{ margin: 24 }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
