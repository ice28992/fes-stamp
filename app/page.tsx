'use client';

import Image from 'next/image';
import { useState } from 'react';
import { WrapCard } from '@/components/ui/Card';
import { LargeCard } from '@/components/ui/Card';
import { EventCookie, EventData } from '@/hooks/eventCookie';
import styles from './page.module.css';

export default function Home() {
  const { events } = EventCookie();
  const totalStamps = 12;

  const [selectedEvent, setSelectedEvent] = useState<EventData | null>(null);
  const imageUrl = selectedEvent ? `/images/${selectedEvent.id}.png` : null;

  return (
    <>
      {/* スタンプ一覧カード */}
      <div className={styles.contents}>
        <WrapCard cardTitle="スタンプ一覧">
          {events.length === 0 ? (
            <p>まだスタンプがありません。</p>
          ) : (
            <div className={styles.gridContainer}>
              {events.map((ev) => (
                <div
                  key={ev.id}
                  className={styles.gridItem}
                  onClick={() => setSelectedEvent(ev)}
                >
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

      {/* 残りスタンプ個数 */}
      {events.length === totalStamps ? (
        <><p className={styles.h2}>
          SuwaGeeksのブースに行くと、<br />
          ちょっとしたお菓子がもらえます！<br />
          ※無くなり次第終了です
        </p><hr /></>
      ) : (
        <h2 className={styles.h2}>
          残りのスタンプは{totalStamps - events.length}個です！
        </h2>
      )}

      {/* 選択したスタンプの詳細カード */}
      {selectedEvent && (
        <>
        <h2 className={styles.h2}>【選択したカードの詳細】</h2>
        <div className={styles.cardWrap}>
            <LargeCard
            cardColor="#89c0cf"
            cardTitle={`スタンプ：${selectedEvent.id}`}
            cardText={
              <>
                {imageUrl && (
                  <Image
                    className={styles.img}
                    src={imageUrl}
                    alt={`Event ${selectedEvent.id} Image`}
                    width={100}
                    height={100}
                  />
                )}
                <span>{selectedEvent.name}</span><br/>
                <span>{selectedEvent.message}</span>
              </>
            }
          />
        </div>
      </>)}
    </>
  );
}
