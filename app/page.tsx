import Image from 'next/image';
import { WrapCard } from '@/components/ui/Card';
import styles from './page.module.css';

const images = [
  '/images/ID1.png',
  '/images/ID2.png',
  '/images/ID3.png',
];

export default function Home() {
  return (
    <div className={styles.contents}>
      <WrapCard cardTitle="スタンプ一覧">
        <div className={styles.gridContainer}>
          {images.map((src, index) => (
            <div key={index} className={styles.gridItem}>
              <Image
                src={src}
                alt={`IDN Image ${index + 1}`}
                width={50}
                height={50}
              />
            </div>
          ))}
        </div>
      </WrapCard>
    </div>
  );
}
