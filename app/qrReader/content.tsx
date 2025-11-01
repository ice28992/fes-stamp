'use client';

import { useState, useEffect, useRef } from 'react';
import jsQR from 'jsqr';
import styles from './style.module.css';
import Image from 'next/image';
import Cookies from 'js-cookie';

import { SmallCard } from '@/components/ui/Card';

export default function Camera() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [qrCodeData, setQrCodeData] = useState<string | null>(null);
  const [eventId, setEventId] = useState<string | null>(null);
  const [eventMessage, setEventMessage] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    const config = { audio: false, video: { facingMode: 'environment' } };
    const ctx = canvasRef.current?.getContext('2d');

    const canvasUpdate = () => {
      if (ctx && videoRef.current && canvasRef.current) {
        canvasRef.current.width = videoRef.current.clientWidth;
        canvasRef.current.height = videoRef.current.clientHeight;
        ctx.drawImage(videoRef.current, 0, 0, videoRef.current.clientWidth, videoRef.current.clientHeight);
        requestAnimationFrame(canvasUpdate);
      }
    };

    const checkImage = async () => {
      if (ctx && videoRef.current) {
        ctx?.drawImage(videoRef.current, 0, 0, videoRef.current.clientWidth, videoRef.current.clientHeight);
        const imageData = ctx.getImageData(0, 0, videoRef.current.clientWidth, videoRef.current.clientHeight);
        if (imageData) {
          const code = jsQR(imageData.data, videoRef.current.clientWidth, videoRef.current.clientHeight);
          if (code) {
            const qrData = code.data;
            setQrCodeData(qrData);

            // QRコードのデータをカンマで分割
            const [id, message] = qrData.split(',');
            setEventId(id);
            setEventMessage(message);

            // イベントIDに対応する画像をセット
            setImageUrl(`/images/${id}.png`);

            // クッキーに保存
            const eventCookie = Cookies.get('events');
            let eventArray: { id: string; message: string }[] = [];

            if (eventCookie) {
              try {
                eventArray = JSON.parse(eventCookie);
              } catch (e) {
                console.error('クッキーの解析に失敗', e);
                eventArray = [];
              }
            }

            // eventId上書き or 追加
            const index = eventArray.findIndex(ev => ev.id === id);
            if (index !== -1) {
              eventArray[index].message = message;
            } else {
              eventArray.push({ id, message });
            }
            Cookies.set('events', JSON.stringify(eventArray), { expires: 1 });
            console.log('現在の events クッキー:', Cookies.get('events'));
          }
        }
        setTimeout(() => { checkImage(); }, 200);
      }
    };

    navigator.mediaDevices.getUserMedia(config)
      .then(stream => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
            if (videoRef.current) {
              videoRef.current.play();
              canvasUpdate();
              checkImage();
            }
          };
        }
      })
      .catch(err => {
        console.log(err);
      });
  }, []);

  return (
    <div>
      <div className={styles.video}>
        <video ref={videoRef} autoPlay playsInline width="100%" height="auto"></video>
        <canvas ref={canvasRef} className="hidden"></canvas>
      </div>

      {/* QRコードの内容があれば表示 */}
      {qrCodeData && eventId && eventMessage && (
        <div className={styles.contents}>
          <SmallCard
            cardColor="#6be0a5ff"
            cardTitle={`スタンプ ${eventId}`}
            cardText={
              <>
                {imageUrl && 
                  <Image
                    className={styles.img}
                    src={imageUrl} 
                    alt={`Event ${eventId} Image`} 
                    width={100}
                    height={100}
                  />
                }
                <span>{eventMessage}</span>
              </>
            }
          />
        </div>
      )}
    </div>
  );
}
