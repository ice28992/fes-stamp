'use client';

import { useState, useEffect, useRef } from 'react';
import jsQR from 'jsqr';
import styles from './style.module.css';
import { SmallCard } from '@/components/ui/Card';

export default function Camera() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [qrCodeData, setQrCodeData] = useState<string | null>(null);

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
            setQrCodeData(code.data);
            console.log(code.data);
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
      <div className={styles.contents}>
        {qrCodeData && (
          <SmallCard
            cardColor='#6be0a5ff'
            cardTitle='QRコードの内容'
            cardText={qrCodeData}
          />
        )}
      </div>
    </div>
  );
}
