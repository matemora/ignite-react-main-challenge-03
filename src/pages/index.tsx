import { GetStaticProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import Header from '../components/Header';

import { FiCalendar, FiUser } from 'react-icons/fi';

import { getPrismicClient } from '../services/prismic';
import Prismic from '@prismicio/client';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';
import { useCallback, useState } from 'react';
import { formatDateString } from '../utils/formatDateString';

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
  next_page: string | null;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

export default function Home({
  postsPagination,
}: HomeProps) {
  const [posts, setPosts] = useState<Post[]>(postsPagination.results);
  const [nextPage, setNextPage] = useState(postsPagination.next_page);

  const handleFetchMore = useCallback(async () => {
    const newPosts = await (await fetch(postsPagination.next_page)).json() as PostPagination;
    setNextPage(newPosts.next_page);
    setPosts(prev => [...prev, ...newPosts.results.map(post => ({
      uid: post.uid,
      first_publication_date: new Date(post.first_publication_date).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
      data: {
        ...post.data,
      },
    }))])
  }, []);

  return (
    <>
      <Head>
        <title>Spacetraveling | Home</title>
      </Head>
      <Header />
      <main className={commonStyles.container}>
        <div className={styles.posts}>
          {posts.map(post => (
            <Link key={post.uid} href={`post/${post.uid}`}>
              <a>
                <h1>{post.data.title}</h1>
                <p>{post.data.subtitle}</p>
                <footer>
                  <span className={styles.postInfo}>
                    <FiCalendar />
                    <time>{post.first_publication_date}</time>
                  </span>
                  <span className={styles.postInfo}>
                    <FiUser />
                    <span>{post.data.author}</span>
                  </span>
                </footer>
              </a>
            </Link>
          ))}
        </div>
        {nextPage && (
          <footer className={styles.loadMore}>
            <button onClick={handleFetchMore}>Carregar mais posts</button>
          </footer>
        )}
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();
  const postsResponse = await prismic.query(
    Prismic.Predicates.at('document.type', 'post'),
    {
      fetch: ['post.title', 'post.subtitle', 'post.author'],
      pageSize: 1,
    }
  );

  const postsPagination = {
    next_page: postsResponse.next_page,
    results: postsResponse.results.map(result => {
      return {
        uid: result.uid,
        first_publication_date: formatDateString(result.first_publication_date),
        data: {
          ...result.data,
        },
      }
    }),
  }

  return {
    props: {
      postsPagination,
    }
  }
};
