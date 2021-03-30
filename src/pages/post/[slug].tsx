import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { FiCalendar, FiUser, FiClock } from 'react-icons/fi';

import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

import Prismic from '@prismicio/client';

import { RichText } from 'prismic-dom';
import { useRouter } from 'next/router';
import { getPrismicClient } from '../../services/prismic';

import Header from '../../components/Header';

import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';

interface Post {
  first_publication_date: string | null;
  data: {
    title: string;
    next_post?: {
      uid: string;
      title: string;
    };
    prev_post?: {
      uid: string;
      title: string;
    };
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

export default function Post({ post }: PostProps): JSX.Element {
  const router = useRouter();

  if (router.isFallback) {
    return (
      <p
        style={{
          position: 'absolute',
          top: '50%',
          bottom: '50%',
          left: '50%',
          right: '50%',
        }}
      >
        Carregando...
      </p>
    );
  }

  const average_reading_time_calc = post.data.content.reduce((acc, content) => {
    const textBody = RichText.asText(content.body);
    const split = textBody.split(' ');
    const number_words = split.length;

    const result = Math.ceil(number_words / 200);
    return acc + result;
  }, 0);

  const postWithDateFormatedAndReadingTime = {
    ...post,
    first_publication_date: format(
      new Date(post.first_publication_date),
      "dd MMM' 'yyyy",
      {
        locale: ptBR,
      }
    ),
    data: {
      ...post.data,
      average_reading_time: average_reading_time_calc,
    },
  };

  const { data, first_publication_date } = postWithDateFormatedAndReadingTime;
  const {
    author,
    banner,
    content,
    title,
    next_post,
    prev_post,
    average_reading_time,
  } = data;

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <Header />
      <div className={commonStyles.container}>
        <div className={styles.preview}>
          <img src={banner.url} alt="Banner" />
        </div>
        <main className={styles.contentContainer}>
          <h1>{title}</h1>
          <div className={commonStyles.info}>
            <p>
              <FiCalendar /> {first_publication_date}
            </p>
            <p>
              <FiUser /> {author}
            </p>
            <p>
              <FiClock />
              {average_reading_time} min
            </p>
          </div>
          {content.map(section => (
            <section key={section.heading} className={styles.sectionContent}>
              <h3>{section.heading}</h3>
              <div
                className={styles.content}
                // eslint-disable-next-line react/no-danger
                dangerouslySetInnerHTML={{
                  __html: RichText.asHtml(section.body),
                }}
              />
            </section>
          ))}
          <footer className={styles.footer}>
            {prev_post.uid ? (
              <Link href={`/post/${prev_post.uid}`}>
                <div className={styles.previous}>
                  <span>{prev_post.title}</span>
                  <a>Post anterior</a>
                </div>
              </Link>
            ) : (
              <div />
            )}
            {next_post.uid ? (
              <Link href={`/post/${next_post.uid}`}>
                <div className={styles.next}>
                  <span>{next_post.title}</span>
                  <a>Próximo post</a>
                </div>
              </Link>
            ) : (
              <div />
            )}
          </footer>
        </main>
      </div>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const prismic = getPrismicClient();
  const postsResponse = await prismic.query(
    [Prismic.Predicates.at('document.type', 'post')],
    {
      pageSize: 10,
      fetch: ['post.uid'],
    }
  );

  const slugsArray = postsResponse.results.map(post => ({
    params: { slug: post.uid },
  }));

  return {
    paths: slugsArray,
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const prismic = getPrismicClient();
  const { slug } = params;

  const response = await prismic.getByUID('post', String(slug), {});

  const nextPost = await prismic.query(
    [
      Prismic.Predicates.at('document.type', 'post'),
      Prismic.Predicates.dateAfter(
        'document.first_publication_date',
        response.first_publication_date
      ),
    ],
    {
      pageSize: 1,
    }
  );

  const prevPost = await prismic.query(
    [
      Prismic.Predicates.at('document.type', 'post'),
      Prismic.Predicates.dateBefore(
        'document.first_publication_date',
        response.first_publication_date
      ),
    ],
    {
      pageSize: 1,
    }
  );

  const next_post = Boolean(nextPost.results[0]);
  const prev_post = Boolean(prevPost.results[0]);

  const post = {
    uid: response.uid,
    first_publication_date: response.first_publication_date,
    data: {
      title: response.data.title,
      next_post: {
        uid: next_post ? nextPost.results[0].uid : null,
        title: next_post ? nextPost.results[0].data.title : null,
      },
      prev_post: {
        uid: prev_post ? prevPost.results[0].uid : null,
        title: prev_post ? prevPost.results[0].data.title : null,
      },
      subtitle: response.data.subtitle,
      author: response.data.author,
      banner: {
        url: response.data.banner.url,
      },
      content: response.data.content.map(content => {
        return {
          heading: content.heading,
          body: [...content.body],
        };
      }),
    },
  };

  return {
    props: {
      post,
    },
    revalidate: 3600,
  };
};
