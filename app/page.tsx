'use client';

import Image from 'next/image';
import { WrapCard } from '@/components/ui/Card';
import { EventCookie } from '@/hooks/eventCookie';
import styles from './page.module.css';

export default function Home() {
  const { events } = EventCookie(); // クッキーからイベント一覧取得

  return (
    <div className={styles.contents}>
      <WrapCard cardTitle="スタンプ一覧">
        {events.length == 0 ? (
          <p>まだスタンプがありません。</p>
        ) : (
          <div className={styles.gridContainer}>
            {events.map((ev) => (
              <div key={ev.id} className={styles.gridItem}>
                <Image
                  src={`/images/${ev.id}.png`}
                  alt={`Event ${ev.id} Image`}
                  width={70}
                  height={70}
                />
              </div>
            ))}
          </div>
        )}
      </WrapCard>
    </div>
  );
}
