import { useState, useRef, useEffect } from 'react';
import { Input, Button, Typography, Badge, Avatar } from 'antd';
import {
  SendOutlined,
  SearchOutlined,
  PaperClipOutlined,
  SmileOutlined,
  InfoCircleOutlined,
  UserOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/ru';
import { chats } from '../../data/mock';
import styles from './WhatsAppChat.module.css';

dayjs.extend(relativeTime);
dayjs.locale('ru');

const { Text, Title } = Typography;

const AVATAR_COLORS = ['#1677ff', '#52c41a', '#faad14', '#722ed1', '#eb2f96', '#13c2c2', '#fa541c', '#2f54eb'];

function getAvatarColor(id) {
  return AVATAR_COLORS[id % AVATAR_COLORS.length];
}

function formatChatTime(isoStr) {
  const d = dayjs(isoStr);
  const now = dayjs();
  if (now.diff(d, 'day') === 0 && d.isSame(now, 'day')) return d.format('HH:mm');
  if (now.diff(d, 'day') <= 1 && d.isSame(now.subtract(1, 'day'), 'day')) return 'Вчера';
  if (now.diff(d, 'day') < 7) return d.format('dddd');
  return d.format('DD.MM.YYYY');
}

export default function WhatsAppChatPage() {
  const [activeChatId, setActiveChatId] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [messageText, setMessageText] = useState('');
  const messagesEndRef = useRef(null);

  const activeChat = chats.find((c) => c.id === activeChatId);

  const filteredChats = chats.filter(
    (c) =>
      !searchText ||
      c.name.toLowerCase().includes(searchText.toLowerCase()) ||
      c.lastMessage.toLowerCase().includes(searchText.toLowerCase())
  );

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeChatId]);

  const handleSend = () => {
    if (!messageText.trim()) return;
    setMessageText('');
  };

  return (
    <>
      <Title level={4} style={{ marginBottom: 16, color: '#000000e0' }}>WhatsApp чат</Title>

      <div className={styles.container}>
        {/* Chat list */}
        <div className={styles.chatList}>
          <div className={styles.searchBox}>
            <Input
              placeholder="Поиск чата..."
              prefix={<SearchOutlined style={{ color: '#00000073' }} />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              allowClear
              size="middle"
            />
          </div>

          <div className={styles.chatItems}>
            {filteredChats.map((chat) => (
              <div
                key={chat.id}
                className={`${styles.chatItem} ${activeChatId === chat.id ? styles.chatItemActive : ''}`}
                onClick={() => setActiveChatId(chat.id)}
              >
                <Badge count={chat.unread} size="small" offset={[-4, 4]}>
                  <Avatar
                    style={{ backgroundColor: getAvatarColor(chat.id), flexShrink: 0 }}
                    icon={<UserOutlined />}
                    size={40}
                  />
                </Badge>
                <div className={styles.chatMeta}>
                  <div className={styles.chatHeader}>
                    <span className={styles.chatName}>{chat.name}</span>
                    <span className={styles.chatTime}>{formatChatTime(chat.time)}</span>
                  </div>
                  <span className={styles.chatPreview}>
                    {chat.sender === 'you' && <span style={{ color: '#000000e0' }}>Вы: </span>}
                    {chat.lastMessage}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat window */}
        <div className={styles.chatWindow}>
          {activeChat ? (
            <>
              <div className={styles.windowHeader}>
                <Avatar
                  style={{ backgroundColor: getAvatarColor(activeChat.id), flexShrink: 0 }}
                  icon={<UserOutlined />}
                  size={36}
                />
                <div>
                  <div style={{ fontWeight: 600, color: '#000000e0', fontSize: 14, lineHeight: 1.3 }}>{activeChat.name}</div>
                  <div style={{ fontSize: 12, color: '#00000073' }}>В сети</div>
                </div>
              </div>

              <div className={styles.messages}>
                {activeChat.messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`${styles.bubble} ${msg.from === 'you' ? styles.bubbleOut : styles.bubbleIn}`}
                  >
                    <div className={styles.bubbleText}>{msg.text}</div>
                    <span className={styles.bubbleTime}>{dayjs(msg.time).format('HH:mm')}</span>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              <div className={styles.inputBar}>
                <Button type="text" icon={<SmileOutlined />} size="small" style={{ color: '#00000073' }} />
                <Button type="text" icon={<PaperClipOutlined />} size="small" style={{ color: '#00000073' }} />
                <Input
                  placeholder="Введите сообщение..."
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  onPressEnter={handleSend}
                  className={styles.messageInput}
                />
                <Button
                  type="primary"
                  icon={<SendOutlined />}
                  onClick={handleSend}
                  disabled={!messageText.trim()}
                />
              </div>
            </>
          ) : (
            <div className={styles.placeholder}>
              <InfoCircleOutlined style={{ fontSize: 48, color: '#bfbfbf' }} />
              <div style={{ fontSize: 16, fontWeight: 500, color: '#000000e0', marginTop: 12 }}>Выберите чат</div>
              <div style={{ fontSize: 13, color: '#00000073' }}>Выберите диалог из списка слева</div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
