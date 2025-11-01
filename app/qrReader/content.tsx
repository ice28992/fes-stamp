'use client';

import { useState, useEffect, useRef } from 'react';
import jsQR from 'jsqr';
import styles from './style.module.css';
import Image from 'next/image';
import { EventCookie } from '@/hooks/eventCookie';
import { SmallCard } from '@/components/ui/Card';

export default function QRReader() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [qrCodeData, setQrCodeData] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const { events, UpdateEvent } = EventCookie();

  // 直前のQRコードデータを保持
  const lastQrDataRef = useRef<string | null>(null);

  useEffect(() => {
    const config = { audio: false, video: { facingMode: 'environment' } };
    const ctx = canvasRef.current?.getContext('2d', { willReadFrequently: true });

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
        const code = jsQR(imageData.data, videoRef.current.clientWidth, videoRef.current.clientHeight);
         
        if (code) {
          const qrData = code.data;

          // 検出データが直前データと異なる場合のみ処理
          if (qrData !== lastQrDataRef.current) {
            lastQrDataRef.current = qrData;
            setQrCodeData(qrData);

            // QRコードのデータをカンマで分割
            const [id, name, message] = qrData.split(',');
            UpdateEvent({ id, name, message });
            setImageUrl(`/images/${id}.png`);
          }
        }
        setTimeout(checkImage, 200);
      }
    };
      
    navigator.mediaDevices.getUserMedia(config).then(stream => {
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
}, [UpdateEvent]);

// 最新のイベント取得
const latest = qrCodeData ? events.find(ev => qrCodeData.includes(ev.id)) : null;

  return (
    <div>
      <h3 className={styles.h3}>QRコードをカメラ内に写してください！</h3>
      <div className={styles.video}>
        <video ref={videoRef} autoPlay playsInline width="100%" height="auto"></video>
        <canvas ref={canvasRef} className="hidden"></canvas>
      </div>

      {/* QRコードの内容があれば表示 */}
      {latest && (
        <div className={styles.contents}>
          <SmallCard
            cardColor="#89c0cf"
            cardTitle={`スタンプ ${latest.id}`}
            cardText={
              <>
                {imageUrl && 
                  <Image
                    className={styles.img}
                    src={imageUrl} 
                    alt={`Event ${latest.id} Image`} 
                    width={70}
                    height={70}
                  />
                }
                <span>{latest.name}</span><br/>
                <span>{latest.message}</span>
              </>
            }
          />
        </div>
      )}
    </div>
  );
}
