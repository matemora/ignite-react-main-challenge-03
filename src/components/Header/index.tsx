import Image from 'next/image';
import Link from 'next/link';
import logo from '../../../public/images/logo.svg';

import styles from './header.module.scss';

export default function Header() {
  return (
    <header className={styles.headerContainer}>
      <div className={styles.headerContent}>
        <Link href="/">
          <a>
            <Image src={logo} alt="logo" height={26} />
          </a>
        </Link>
      </div>
    </header>
  );
}
