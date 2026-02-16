import { useEffect, useState } from 'react';
import {
  Card,
  Col,
  Row,
  Table,
  Tag,
  Typography,
  Statistic,
} from 'antd';
import dayjs from 'dayjs';
import GaugeChart from '../../components/GaugeChart';
import {
  dashboardStats,
  paidToday,
  expectedPayments,
  unpaidYesterday,
  referrals,
} from '../../data/mock';

const { Title } = Typography;

const fmt = (val) => new Intl.NumberFormat('ru-RU').format(val);

const paidTodayCols = [
  { title: '#', width: 40, render: (_, __, i) => i + 1 },
  { title: 'Магазин', dataIndex: 'store', render: (t) => <a style={{ color: '#1677ff' }}>{t}</a> },
  { title: 'Активировал', dataIndex: 'activatedBy' },
  { title: 'Сумма', dataIndex: 'amount', render: (v) => `${fmt(v)} ₸` },
  {
    title: 'Тип покупки',
    dataIndex: 'type',
    render: (t) => <Tag color={t === 'Подписка' ? 'processing' : 'success'}>{t}</Tag>,
  },
  {
    title: 'Активирован до',
    dataIndex: 'until',
    render: (d) => dayjs(d).format('DD.MM.YYYY'),
  },
];

const expectedCols = [
  { title: '#', width: 40, render: (_, __, i) => i + 1 },
  { title: 'Магазин', dataIndex: 'store', render: (t) => <a style={{ color: '#1677ff' }}>{t}</a> },
  { title: 'Сумма', dataIndex: 'amount', render: (v) => `${fmt(v)} ₸` },
];

const referralCols = [
  { title: 'ФИО', dataIndex: 'name', render: (t) => <a style={{ color: '#1677ff' }}>{t}</a> },
  { title: 'Номер тел.', dataIndex: 'phone' },
  { title: 'Пользователи', dataIndex: 'users', render: (v) => <a style={{ color: '#1677ff' }}>{v}</a> },
  { title: 'Магазины', dataIndex: 'stores' },
  { title: 'Сумма', dataIndex: 'amount', render: (v) => `${fmt(v)} ₸` },
];

export default function DashboardPage() {
  const [countdown, setCountdown] = useState('');
  const s = dashboardStats;

  useEffect(() => {
    const end = dayjs().endOf('month');
    const tick = () => {
      const diff = end.diff(dayjs());
      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff % 86400000) / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const sec = Math.floor((diff % 60000) / 1000);
      setCountdown(`${d} дн. ${h} ч. ${m} мин. ${sec} сек.`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <>
      <Title level={4} style={{ marginBottom: 16, color: '#000000e0' }}>Аналитика</Title>

      {/* Stat cards row */}
      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card size="small" bodyStyle={{ padding: '16px' }}>
            <Statistic title="План" value={s.plan} suffix="₸" valueStyle={{ fontSize: 20, color: '#000000e0' }} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card size="small" bodyStyle={{ padding: '16px' }}>
            <Statistic title="Текущая сумма" value={s.currentAmount} suffix="₸" valueStyle={{ fontSize: 20, color: '#000000e0' }} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card size="small" bodyStyle={{ padding: '16px' }}>
            <Statistic title="Осталось" value={s.remaining} suffix="₸" valueStyle={{ fontSize: 20, color: '#000000e0' }} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card size="small" bodyStyle={{ padding: '16px' }}>
            <div style={{ color: '#00000073', fontSize: 14, marginBottom: 8 }}>До конца месяца</div>
            <div style={{ fontSize: 16, fontWeight: 600, color: '#000000e0' }}>{countdown}</div>
          </Card>
        </Col>
      </Row>

      {/* Gauges */}
      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col xs={24} lg={12}>
          <Card size="small" title="Подписки" bodyStyle={{ display: 'flex', justifyContent: 'center', padding: '16px' }}>
            <GaugeChart
              value={s.subscriptionGauge}
              max={s.plan}
              formatValue={(v) => fmt(v) + ' ₸'}
              color="#8c8c8c"
              bgColor="#f5f5f5"
              size={180}
              strokeWidth={12}
            />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card size="small" title="VIP" bodyStyle={{ display: 'flex', justifyContent: 'center', padding: '16px' }}>
            <GaugeChart
              value={s.vipGauge}
              max={s.plan}
              formatValue={(v) => fmt(v) + ' ₸'}
              color="#8c8c8c"
              bgColor="#f5f5f5"
              size={180}
              strokeWidth={12}
            />
          </Card>
        </Col>
      </Row>

      {/* Paid today */}
      <Card
        size="small"
        style={{ marginBottom: 16 }}
        title={<>Оплаченные на сегодня <Tag color="blue" style={{ marginLeft: 8 }}>{fmt(s.paidTodayTotal)} KZT</Tag></>}
      >
        <Table
          dataSource={paidToday}
          columns={paidTodayCols}
          rowKey={(r, i) => `${r.store}-${i}`}
          pagination={false}
          size="small"
          scroll={{ x: 700 }}
        />
      </Card>

      {/* Expected / Unpaid side by side */}
      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col xs={24} lg={12}>
          <Card
            size="small"
            title="Ожидаемые оплаты на сегодня"
            extra={
              <span style={{ fontSize: 12 }}>
                С тестовиками: <strong>{fmt(s.expectedTodayWithTest)}</strong>{' '}
                Без: <span style={{ color: '#52c41a' }}>{fmt(s.expectedTodayNoTest)}</span>
              </span>
            }
          >
            <Table dataSource={expectedPayments} columns={expectedCols} rowKey="store" pagination={false} size="small" />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card
            size="small"
            title="Не оплаченные вчера"
            extra={
              <span style={{ fontSize: 12 }}>
                С тестовиками: <strong>{fmt(s.unpaidYesterdayWithTest)}</strong>{' '}
                Без: <span style={{ color: '#ff4d4f' }}>{fmt(s.unpaidYesterdayNoTest)}</span>
              </span>
            }
          >
            <Table dataSource={unpaidYesterday} columns={expectedCols} rowKey={(r, i) => `${r.store}-${i}`} pagination={false} size="small" />
          </Card>
        </Col>
      </Row>

      {/* Referrals */}
      <Card size="small" title="Статистика по рефераллам">
        <Table dataSource={referrals} columns={referralCols} rowKey="phone" pagination={false} size="small" />
      </Card>
    </>
  );
}
