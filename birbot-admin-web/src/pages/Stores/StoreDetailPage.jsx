import { useParams, useNavigate } from 'react-router-dom';
import {
  Card,
  Button,
  Space,
  Typography,
  Table,
  Modal,
  Select,
  message,
  Collapse,
  Empty,
  Divider,
} from 'antd';
import {
  ArrowLeftOutlined,
  LinkOutlined,
  CheckCircleOutlined,
  SyncOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons';
import { useState } from 'react';
import dayjs from 'dayjs';
import { stores, storeOrders, subscriptionOptions } from '../../data/mock';

const { Title, Text } = Typography;

const fmt = (val) => new Intl.NumberFormat('ru-RU').format(val);

function InfoRow({ label, children, danger, warning }) {
  return (
    <div style={{ display: 'flex', padding: '6px 0', borderBottom: '1px solid #f0f0f0' }}>
      <span style={{ width: 260, flexShrink: 0, color: '#000000e0', fontWeight: 500 }}>{label} :</span>
      <span style={{ color: danger ? '#ff4d4f' : warning ? '#faad14' : '#000000e0', fontWeight: danger || warning ? 600 : 400 }}>
        {children}
      </span>
    </div>
  );
}

export default function StoreDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const store = stores.find((s) => s.id === id);
  const [subModalOpen, setSubModalOpen] = useState(false);
  const [selectedSub, setSelectedSub] = useState(undefined);

  if (!store) {
    return (
      <Card>
        <Empty description="Магазин не найден" />
        <Button type="link" onClick={() => navigate('/stores')}>Назад к списку</Button>
      </Card>
    );
  }

  const orders = storeOrders[store.id] || [];
  const isPaidExpired = dayjs(store.paidTo).isBefore(dayjs());

  const handleActivate = () => {
    if (selectedSub) {
      message.success(`"${selectedSub}" активирован для ${store.name}`);
      setSubModalOpen(false);
      setSelectedSub(undefined);
    }
  };

  const collapseItems = [
    { key: 'products', label: 'Товары', children: <Empty description="Нет данных" /> },
    { key: 'orders', label: 'Заказы', children: orders.length > 0
        ? <Table dataSource={orders} columns={[
            { title: 'Период', dataIndex: 'period' },
            { title: 'Кол-во', dataIndex: 'count', render: (v) => <strong>{v} шт.</strong> },
            { title: 'Сумма', dataIndex: 'total', render: (v) => `(${fmt(v)} ₸)` },
          ]} rowKey="period" pagination={false} size="small" />
        : <Empty description="Нет данных" /> },
    { key: 'payments', label: 'Платежи', children: <Empty description="Нет данных" /> },
    { key: 'settings', label: 'Настройки', children: <Empty description="Нет данных" /> },
    { key: 'history', label: 'История действий', children: <Empty description="Нет данных" /> },
    { key: 'xml', label: 'История подгрузки XML в Kaspi', children: <Empty description="Нет данных" /> },
    { key: 'mailing', label: 'Рассылка', children: <Empty description="Нет данных" /> },
    { key: 'notifications', label: 'Уведомления', children: <Empty description="Нет данных" /> },
  ];

  return (
    <>
      <Button
        type="text"
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate('/stores')}
        style={{ marginBottom: 8, padding: '4px 8px' }}
      >
        Назад
      </Button>
      <Title level={4} style={{ marginBottom: 16, color: '#000000e0' }}>Информация о магазине</Title>

      <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
        {/* Left — main info */}
        <div style={{ flex: 1 }}>
          <InfoRow label="Название">{store.name}</InfoRow>
          <InfoRow label="Логин">{store.login}</InfoRow>
          <InfoRow label="Бот оплачен до" danger={isPaidExpired}>
            {dayjs(store.paidTo).format('M/D/YYYY, h:mm:ss A')}
          </InfoRow>
          <InfoRow label="Демпинг по бонусам оплачен до" warning={!store.dumpingBonusPaidTo}>
            {store.dumpingBonusPaidTo ? dayjs(store.dumpingBonusPaidTo).format('DD.MM.YYYY') : 'Неизвестно'}
          </InfoRow>
          <InfoRow label="Рассылка в WhatsApp оплачена до" danger={!store.whatsappPaidTo}>
            {store.whatsappPaidTo ? dayjs(store.whatsappPaidTo).format('DD.MM.YYYY') : 'не оплачено'}
          </InfoRow>
          <InfoRow label="Дата регистрации">
            {dayjs(store.registeredAt).format('M/D/YYYY, h:mm:ss A')}
          </InfoRow>
          <InfoRow label="Главный город">{store.mainCity}</InfoRow>
          <InfoRow label="Допустимое кол-во доп. городов">{store.allowedCities}</InfoRow>
          <InfoRow label="Макс. кол-во товаров">{store.maxProducts ?? '—'}</InfoRow>
          <InfoRow label="Пользователь">
            <a style={{ color: '#1677ff' }}>{store.user}</a>
          </InfoRow>
          <InfoRow label="Номер телефона">{store.phone}</InfoRow>
          <InfoRow label="Ссылка на наш XML файл">
            {store.xmlLink ? <a style={{ color: '#1677ff' }}><LinkOutlined /> Ссылка</a> : '—'}
          </InfoRow>

          <div style={{ marginTop: 12 }}>
            <a style={{ color: '#1677ff' }}>Открыть магазин</a>
          </div>

          <Space wrap style={{ marginTop: 16 }}>
            <Button type="primary" icon={<CheckCircleOutlined />} onClick={() => setSubModalOpen(true)}>
              Управление подписками
            </Button>
            <Button icon={<SyncOutlined />}>Загрузить данные из другого бота</Button>
            <Button danger icon={<CloseCircleOutlined />}>Сбросить активацию</Button>
          </Space>
        </div>

        {/* Right — stats */}
        <div style={{ width: 300, flexShrink: 0 }}>
          <div style={{ marginBottom: 4, color: '#00000073', fontSize: 13 }}>Среднее кол-во активных товаров: <strong style={{ color: '#000000e0' }}>{store.avgActiveProducts}</strong></div>
          <div style={{ marginBottom: 4, color: '#00000073', fontSize: 13 }}>Активные города: <strong style={{ color: '#000000e0' }}>{store.activeCities}</strong></div>
          <div style={{ marginBottom: 4, color: '#00000073', fontSize: 13 }}>Последний платеж: <strong style={{ color: '#000000e0' }}>{fmt(store.lastPayment)}</strong></div>
          <div style={{ marginBottom: 16, color: '#00000073', fontSize: 13 }}>Минимальный следующий платеж: <strong style={{ color: '#000000e0' }}>{fmt(store.minNextPayment)}</strong></div>

          <Card size="small" title="Заказы" style={{ marginBottom: 12 }}>
            {orders.length > 0 ? orders.map((o) => (
              <div key={o.period} style={{ marginBottom: 6 }}>
                <div style={{ color: '#00000073', fontSize: 12 }}>{o.period}:</div>
                <div style={{ fontWeight: 600, color: '#000000e0' }}>{o.count} шт. ({fmt(o.total)} ₸)</div>
              </div>
            )) : <Empty description="Нет данных" image={Empty.PRESENTED_IMAGE_SIMPLE} />}
          </Card>

          <Card size="small" title="Лимит запросов">
            <Empty description="Нет данных" image={Empty.PRESENTED_IMAGE_SIMPLE} />
          </Card>
        </div>
      </div>

      <Collapse items={collapseItems} style={{ marginTop: 16 }} bordered={false} />

      <Modal
        title="Управление подписками"
        open={subModalOpen}
        onCancel={() => setSubModalOpen(false)}
        onOk={handleActivate}
        okText="Активировать"
        cancelText="Отмена"
        okButtonProps={{ disabled: !selectedSub }}
      >
        <p style={{ fontWeight: 600, marginBottom: 8 }}>Основные подписки</p>
        <Select
          placeholder="Выберите подписку для активации"
          value={selectedSub}
          onChange={setSelectedSub}
          style={{ width: '100%' }}
          options={subscriptionOptions.map((o) => ({ label: o, value: o }))}
        />
      </Modal>
    </>
  );
}
