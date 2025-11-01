import QRReader from './content';
import styles from './style.module.css'

export default function Home() {
  return (
    <div className={styles.wrapper}>
      <QRReader/>
    </div>
  );
}
