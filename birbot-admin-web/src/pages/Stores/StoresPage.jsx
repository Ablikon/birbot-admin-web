import { useState } from 'react';
import {
  Table,
  Tag,
  Button,
  Input,
  Select,
  Space,
  Typography,
  InputNumber,
  Card,
} from 'antd';
import { SearchOutlined, ShopOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { stores } from '../../data/mock';

const { Title, Text } = Typography;

const fmt = (val) => new Intl.NumberFormat('ru-RU').format(val);

export default function StoresPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [calcValue, setCalcValue] = useState(0);

  const filtered = stores.filter((s) => {
    const matchSearch =
      !search ||
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.login.toLowerCase().includes(search.toLowerCase());
    const matchStatus =
      statusFilter === 'all' ||
      (statusFilter === 'active' && !s.stopped) ||
      (statusFilter === 'stopped' && s.stopped);
    return matchSearch && matchStatus;
  });

  const columns = [
    {
      title: 'Название',
      dataIndex: 'name',
      render: (text, record) => (
        <Space>
          <ShopOutlined style={{ color: '#faad14' }} />
          <a onClick={() => navigate(`/stores/${record.id}`)}>{text}</a>
        </Space>
      ),
    },
    {
      title: 'Оплачен до',
      dataIndex: 'paidTo',
      render: (d) => {
        const date = dayjs(d);
        const expired = date.isBefore(dayjs());
        return <span style={{ color: expired ? '#ff4d4f' : '#000000e0' }}>{date.format('DD.MM.YYYY')}</span>;
      },
    },
    { title: 'Главный город', dataIndex: 'mainCity' },
    { title: 'Кол-во городов', dataIndex: 'allowedCities', align: 'center' },
    {
      title: 'Остановлен',
      dataIndex: 'stopped',
      render: (v) => v ? <Tag color="error">Да</Tag> : <Tag color="success">Нет</Tag>,
    },
  ];

  return (
    <>
      <Title level={4} style={{ marginBottom: 16, color: '#000000e0' }}>Магазины</Title>

      <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
        <div style={{ flex: 1 }}>
          <Space wrap style={{ marginBottom: 12 }}>
            <Select
              value={statusFilter}
              onChange={setStatusFilter}
              style={{ width: 100 }}
              options={[
                { value: 'all', label: 'Все' },
                { value: 'active', label: 'Активные' },
                { value: 'stopped', label: 'Остановлены' },
              ]}
            />
            <Input
              placeholder="Поиск по ключевому слову"
              prefix={<SearchOutlined />}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ width: 260 }}
              allowClear
            />
            <Button type="primary" icon={<SearchOutlined />}>Поиск</Button>
          </Space>

          <Table
            dataSource={filtered}
            columns={columns}
            rowKey="id"
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total, range) => `${range[0]}-${range[1]} из ${total}`,
              size: 'default',
            }}
            size="middle"
            style={{ background: '#fff' }}
          />
        </div>

        <Card size="small" title="Калькулятор" style={{ width: 200, flexShrink: 0 }}>
          <InputNumber
            value={calcValue}
            onChange={setCalcValue}
            style={{ width: '100%', marginBottom: 8 }}
            min={0}
          />
          <div style={{ color: '#00000073', fontSize: 13 }}>
            Цена: <strong style={{ color: '#000000e0' }}>{fmt(13000)} ₸</strong>
          </div>
        </Card>
      </div>
    </>
  );
}
