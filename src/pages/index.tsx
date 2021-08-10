import { GetStaticProps } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import logo from '../../public/images/logo.svg';

import { FiCalendar, FiUser } from 'react-icons/fi';

import { getPrismicClient } from '../services/prismic';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

export default function Home() {
  return (
    <>
      <Head>
        <title>Spacetraveling | Home</title>
      </Head>
      <header className={styles.headerContainer}>
        <div className={styles.headerContent}>
          <Image src={logo} alt="logo" height={26} />
        </div>
      </header>
      <main className={styles.mainContainer}>
        <div className={styles.posts}>
          <a>
            <h1>Como utilizar hooks</h1>
            <p>Pensando em sincronização em vez de ciclos de vida.</p>
            <footer>
              <span className={styles.postInfo}>
                <FiCalendar />
                <time>15 Mar 2021</time>
              </span>
              <span className={styles.postInfo}>
                <FiUser />
                <span>Mateus Morais</span>
              </span>
            </footer>
          </a>
          <a>
            <h1>Como utilizar hooks</h1>
            <p>Pensando em sincronização em vez de ciclos de vida.</p>
            <footer>
              <span className={styles.postInfo}>
                <FiCalendar />
                <time>15 Mar 2021</time>
              </span>
              <span className={styles.postInfo}>
                <FiUser />
                <span>Mateus Morais</span>
              </span>
            </footer>
          </a>
          <a>
            <h1>Como utilizar hooks</h1>
            <p>Pensando em sincronização em vez de ciclos de vida.</p>
            <footer>
              <span className={styles.postInfo}>
                <FiCalendar />
                <time>15 Mar 2021</time>
              </span>
              <span className={styles.postInfo}>
                <FiUser />
                <span>Mateus Morais</span>
              </span>
            </footer>
          </a>
        </div>
        <footer>
          <button>Carregar mais posts</button>
        </footer>

      </main>
    </>
  );
}

// export const getStaticProps = async () => {
//   // const prismic = getPrismicClient();
//   // const postsResponse = await prismic.query(TODO);

//   // TODO
// };
