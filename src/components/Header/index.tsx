import Link from 'next/link';

import styles from './header.module.scss';

export default function Header() {
  return (
    <header className={styles.headerContainer}>
      <div className={styles.headerContent}>
        <Link href="/">
          <a>
            <img src="../../../public/images/logo.png" alt="logo" width={260} />
          </a>
        </Link>
      </div>
    </header>
  );
}
