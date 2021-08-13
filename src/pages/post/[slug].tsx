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
  estimatedReadingTime: number;
}

interface PostProps {
  post: Post;
}

export default function Post({
  post,
}: PostProps) {
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
              <time>{post.first_publication_date}</time>
            </span>
            <span>
              <FiUser />
              <span>{post.data.author}</span>
            </span>
            <span>
              <FiClock />
              <span>{post.estimatedReadingTime} min</span>
            </span>
          </div>
          {post.data.content.map(content => (
            <section key={content.heading}>
              <h2>{content.heading}</h2>
              <div className={styles.postContent} dangerouslySetInnerHTML={{ __html: content.body[0].text }} />
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
    paths: posts.results.map(post => `/post/${post.uid}`),
    fallback: true,
  }
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const prismic = getPrismicClient();
  const response = await prismic.getByUID('post', String(params.slug), {});
  return {
    props: {
      post: {
        first_publication_date: formatDateString(response.first_publication_date),
        data: {
          ...response.data,
          content: response.data.content.map(content => {
            return {
              heading: content.heading,
              body: [{
                text: RichText.asHtml(content.body),
              }],
            };
          }),
        },
        estimatedReadingTime: 4,
      },
    },
  };
};
