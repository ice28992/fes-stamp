import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

export interface EventData {
  id: string;
  name: string;
  message: string;
}

export function EventCookie() {
  const [events, setEvents] = useState<EventData[]>([]);

  // クッキーから初期データをロード
  useEffect(() => {
    setTimeout(() => {
      const cookieData = Cookies.get('events');
      if (cookieData) {
        try {
          setEvents(JSON.parse(cookieData));
        } catch (e) {
          console.error('クッキーの解析に失敗', e);
          setEvents([]);
        }
      }
    }, 0);
  }, []);

  // イベントを追加 or 更新
  const UpdateEvent = (event: EventData) => {
    setEvents(prev => {
      const index = prev.findIndex(ev => ev.id == event.id);
      let newEvents;
      if (index != -1) {
        newEvents = [...prev];
        newEvents[index] = event;
      } else {
        newEvents = [...prev, event];
      }
      Cookies.set('events', JSON.stringify(newEvents), { expires: 1 });
      return newEvents;
    });
  };

  return { events, UpdateEvent };
}
