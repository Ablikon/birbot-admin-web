import { useState } from 'react';
import {
  Table,
  Button,
  Input,
  Space,
  Typography,
  Modal,
  Select,
  message,
} from 'antd';
import { SearchOutlined, ShopOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { clients, subscriptionOptions } from '../../data/mock';

const { Title } = Typography;

export default function ClientsPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [activateModal, setActivateModal] = useState({ open: false, client: null });
  const [selectedSub, setSelectedSub] = useState(undefined);

  const filtered = clients.filter((c) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return c.name.toLowerCase().includes(q) || c.phone.includes(q) || c.email.toLowerCase().includes(q) || c.storeName.toLowerCase().includes(q);
  });

  const handleActivate = () => {
    if (selectedSub && activateModal.client) {
      message.success(`"${selectedSub}" активирован для магазина ${activateModal.client.storeName}`);
      setActivateModal({ open: false, client: null });
      setSelectedSub(undefined);
    }
  };

  const columns = [
    {
      title: 'Клиент',
      dataIndex: 'name',
      render: (text) => <strong>{text}</strong>,
    },
    { title: 'Телефон', dataIndex: 'phone' },
    { title: 'Email', dataIndex: 'email', responsive: ['lg'] },
    {
      title: 'Магазин',
      dataIndex: 'storeName',
      render: (name, record) => (
        <a onClick={() => navigate(`/stores/${record.storeId}`)} style={{ color: '#1677ff' }}>
          <ShopOutlined style={{ marginRight: 4 }} />{name}
        </a>
      ),
    },
    { title: 'Город', dataIndex: 'city' },
    {
      title: 'Дата регистрации',
      dataIndex: 'registeredAt',
      render: (d) => dayjs(d).format('DD.MM.YYYY'),
      responsive: ['xl'],
    },
    {
      title: 'Действия',
      key: 'actions',
      render: (_, record) => (
        <Button type="primary" size="small" onClick={() => setActivateModal({ open: true, client: record })}>
          Активировать магазин
        </Button>
      ),
    },
  ];

  return (
    <>
      <Title level={4} style={{ marginBottom: 16, color: '#000000e0' }}>Клиенты</Title>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 12, gap: 8 }}>
        <Input
          placeholder="Поиск по имени, телефону или email"
          prefix={<SearchOutlined />}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ width: 300 }}
          allowClear
        />
        <Button type="primary" icon={<SearchOutlined />}>Найти</Button>
      </div>

      <Table
        dataSource={filtered}
        columns={columns}
        rowKey="id"
        pagination={{ pageSize: 10, showSizeChanger: true, showTotal: (t, r) => `${r[0]}-${r[1]} из ${t}` }}
        size="middle"
        style={{ background: '#fff' }}
      />

      <Modal
        title="Активировать магазин"
        open={activateModal.open}
        onCancel={() => { setActivateModal({ open: false, client: null }); setSelectedSub(undefined); }}
        onOk={handleActivate}
        okText="Активировать"
        cancelText="Отмена"
        okButtonProps={{ disabled: !selectedSub }}
      >
        {activateModal.client && (
          <>
            <div style={{ marginBottom: 12, color: '#00000073', fontSize: 13 }}>
              <div>Клиент: <strong style={{ color: '#000000e0' }}>{activateModal.client.name}</strong></div>
              <div>Магазин: <strong style={{ color: '#000000e0' }}>{activateModal.client.storeName}</strong></div>
              <div>Телефон: <strong style={{ color: '#000000e0' }}>{activateModal.client.phone}</strong></div>
            </div>
            <div style={{ fontWeight: 600, marginBottom: 8, color: '#000000e0' }}>Выберите подписку для активации:</div>
            <Select
              placeholder="Выберите подписку"
              value={selectedSub}
              onChange={setSelectedSub}
              style={{ width: '100%' }}
              options={subscriptionOptions.map((o) => ({ label: o, value: o }))}
            />
          </>
        )}
      </Modal>
    </>
  );
}
