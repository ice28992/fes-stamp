'use client';
import styles from './Footer.module.css';
import Link from 'next/link';
import { IoHome, IoQrCode } from "react-icons/io5";
import { FaStamp } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <nav className={styles.nav}>
        <Link href="/" className={styles.link}>
          <IoHome />
          スタンプ一覧
        </Link>
        <Link href="/qrReader" className={styles.link}>
          <IoQrCode />
          QR読み取り
        </Link>
        <Link href="/detail" className={styles.link}>
          <FaStamp />
          スタンプ詳細
        </Link>
      </nav>
    </footer>
  );
};

export default Footer;
