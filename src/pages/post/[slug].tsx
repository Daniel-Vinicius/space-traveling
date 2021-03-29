import { GetStaticPaths, GetStaticProps } from 'next';
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
      // <>Carregando </>
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

  const postWithDateFormated = {
    ...post,
    first_publication_date: format(
      new Date(post.first_publication_date),
      "dd MMM' 'yyyy",
      {
        locale: ptBR,
      }
    ),
  };

  return (
    <>
      <Header />
      <div className={commonStyles.container}>
        <div className={styles.preview}>
          <img src={postWithDateFormated.data.banner.url} alt="Banner" />
        </div>
        <main className={styles.contentContainer}>
          <h1>{postWithDateFormated.data.title}</h1>
          <div className={commonStyles.info}>
            <p>
              <FiCalendar /> {postWithDateFormated.first_publication_date}
            </p>
            <p>
              <FiUser /> {postWithDateFormated.data.author}
            </p>
            <p>
              <FiClock /> 4 min
            </p>
          </div>
          {postWithDateFormated.data.content.map(section => (
            <section
              key={section.body[0].text}
              className={styles.sectionContent}
            >
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

  return {
    props: {
      post: response,
    },
    revalidate: 3600,
  };
};
