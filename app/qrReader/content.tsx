
'use client';

import { useState, useEffect, useRef } from 'react';
import jsQR from 'jsqr';
import styles from './style.module.css';
import Image from 'next/image';
import { EventCookie } from '@/hooks/eventCookie';
import { LargeCard } from '@/components/ui/Card';

export default function QRReader() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [qrCodeData, setQrCodeData] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { events, UpdateEvent } = EventCookie();

  // 直前のQRコードデータを保持
  const lastQrDataRef = useRef<string | null>(null);

  useEffect(() => {
    const config = {
      audio: false,
      video: { facingMode: 'environment' }
    };

    const ctx = canvasRef.current?.getContext('2d', {
      willReadFrequently: true
    });

    let animationId: number;
    let timeoutId: ReturnType<typeof setTimeout>;
    let stream: MediaStream | null = null;
    let stopped = false;

    // カメラ映像をCanvasに描画
    const canvasUpdate = () => {
      if (
        stopped ||
        !ctx ||
        !videoRef.current ||
        !canvasRef.current
      ) {
        return;
      }

      const video = videoRef.current;
      const canvas = canvasRef.current;

      if (video.videoWidth && video.videoHeight) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        ctx.drawImage(
          video,
          0,
          0,
          canvas.width,
          canvas.height
        );
      }

      animationId = requestAnimationFrame(canvasUpdate);
    };

    // QRコードを読み取る
    const checkImage = () => {
      if (
        stopped ||
        !ctx ||
        !videoRef.current ||
        !canvasRef.current
      ) {
        return;
      }

      const video = videoRef.current;

      if (video.readyState >= video.HAVE_ENOUGH_DATA) {
        const width = video.videoWidth;
        const height = video.videoHeight;

        if (width && height) {
          canvasRef.current.width = width;
          canvasRef.current.height = height;

          ctx.drawImage(video, 0, 0, width, height);

          const imageData = ctx.getImageData(
            0,
            0,
            width,
            height
          );

          const code = jsQR(
            imageData.data,
            width,
            height
          );

          if (code) {
            const qrData = code.data;

            // 前回と異なるQRコードの場合のみ処理
            if (qrData !== lastQrDataRef.current) {
              lastQrDataRef.current = qrData;

              // QRコードの内容を分割
              const [id, name, message] = qrData.split(',');

              // 登録済みスタンプQRか確認
              const isValidQR =
                !!id &&
                !!name &&
                !!message &&
                events.some(
                  ev =>
                    String(ev.id) === id &&
                    ev.name === name
                );

              if (isValidQR) {
                // 有効なQRコード
                setQrCodeData(qrData);
                setErrorMessage(null);

                UpdateEvent({
                  id,
                  name,
                  message
                });

                setImageUrl(`/images/${id}.png`);
              } else {
                // 無効なQRコード
                setQrCodeData(null);
                setImageUrl(null);
                setErrorMessage('スタンプQRではありません');
              }
            }
          } else {
            // QRコードがカメラから外れたら次の読み取りを許可
            lastQrDataRef.current = null;
          }
        }
      }

      timeoutId = setTimeout(checkImage, 200);
    };

    // カメラ起動
    navigator.mediaDevices
      .getUserMedia(config)
      .then(mediaStream => {
        if (stopped) {
          mediaStream.getTracks().forEach(track => track.stop());
          return;
        }

        stream = mediaStream;

        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;

          videoRef.current.onloadedmetadata = () => {
            if (stopped || !videoRef.current) return;

            videoRef.current.play();

            canvasUpdate();
            checkImage();
          };
        }
      })
      .catch(err => {
        console.error('カメラの起動に失敗しました:', err);
        setErrorMessage('カメラを起動できませんでした');
      });

    // コンポーネント終了時にカメラを停止
    return () => {
      stopped = true;

      cancelAnimationFrame(animationId);
      clearTimeout(timeoutId);

      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }

      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    };
  }, [UpdateEvent, events]);

  // 最新のイベント取得
  const latest = qrCodeData
    ? events.find(ev => String(ev.id) === qrCodeData.split(',')[0])
    : null;

  return (
    <div>
      <h3 className={styles.h3}>
        QRコードをカメラ内に写してください！
      </h3>

      <div className={styles.video}>
        <video
          ref={videoRef}
          autoPlay
          playsInline
          width="100%"
          height="auto"
        />

        <canvas
          ref={canvasRef}
          className="hidden"
        />
      </div>

      {/* QRコードのエラーメッセージ */}
      {errorMessage && (
        <div className={styles.contents}>
          <p style={{ color: 'red', fontWeight: 'bold' }}>
            {errorMessage}
          </p>
        </div>
      )}

      {/* 有効なQRコードの内容を表示 */}
      {latest && (
        <div className={styles.contents}>
          <LargeCard
            cardColor="#89c0cf"
            cardTitle={`スタンプ ${latest.id}`}
            cardText={
              <>
                {imageUrl && (
                  <Image
                    className={styles.img}
                    src={imageUrl}
                    alt={`Event ${latest.id} Image`}
                    width={150}
                    height={150}
                  />
                )}

                <span>{latest.name}</span>
                <br />
                <span>{latest.message}</span>
              </>
            }
          />
        </div>
      )}
    </div>
  );
}
