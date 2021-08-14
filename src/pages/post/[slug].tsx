import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import Prismic from '@prismicio/client';

import { getPrismicClient } from '../../services/prismic';
import Header from '../../components/Header';

import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';
import { formatDateString } from '../../utils/formatDateString';
import { RichText } from 'prismic-dom';
import { FiCalendar, FiClock, FiUser } from 'react-icons/fi';
import { calculateEstimatedReadingTime } from '../../utils/calculateEstimatedReadingTime';
import { useRouter } from 'next/router';

interface Post {
  first_publication_date: string | null;
  data: {
    title: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
}

interface PostProps {
  post: Post;
}

export default function Post({
  post,
}: PostProps) {
  const router = useRouter()

  if (router.isFallback) {
    return <div>Carregando...</div>
  }

  return (
    <>
      <Head>
        <title>{post.data.title} | Spacetraveling</title>
      </Head>
      <Header />
      {post.data.banner.url && (
        <div className={styles.bannerContainer}>
          <img src={post.data.banner.url} />
        </div>
      )}
      <main className={`${commonStyles.container} ${styles.postContainer}`}>
        <article>
          <h1>{post.data.title}</h1>
          <div className={styles.postInfo}>
            <span>
              <FiCalendar />
              <time>{formatDateString(post.first_publication_date)}</time>
            </span>
            <span>
              <FiUser />
              <span>{post.data.author}</span>
            </span>
            <span>
              <FiClock />
              <span>{calculateEstimatedReadingTime(post.data.content.map(content => RichText.asText(content.body)))} min</span>
            </span>
          </div>
          {post.data.content.map(content => (
            <section key={content.heading}>
              <h2>{content.heading}</h2>
              <div className={styles.postContent} dangerouslySetInnerHTML={{ __html: RichText.asHtml(content.body) }} />
            </section>
          ))}
        </article>
      </main>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const prismic = getPrismicClient();
  const posts = await prismic.query(
    Prismic.Predicates.at('document.type', 'post'),
    {
      fetch: ['post.title', 'post.subtitle', 'post.author'],
      pageSize: 1,
    }
  );

  return {
    paths: posts.results.map(post => ({
      params: {
        slug: post.uid,
      }
    })),
    fallback: true,
  }
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const prismic = getPrismicClient();
  const response = await prismic.getByUID('post', String(params.slug), {});
  return {
    props: {
      post: {
        ...response,
      },
    },
  };
};
