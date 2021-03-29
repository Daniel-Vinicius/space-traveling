import { GetStaticPaths, GetStaticProps } from 'next';
import { FiCalendar, FiUser, FiClock } from 'react-icons/fi';

import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

import consola from 'consola';
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
        <img
          className={styles.preview}
          src={postWithDateFormated.data.banner.url}
          alt="Banner"
        />
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
          {/* <div
            className={styles.content}
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{
              __html: postWithDateFormated.data.content[0].heading,
            }}
          /> */}
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

  const arrayContentBody = response.data.content.map(content => content.body);

  const arrayContentHeading = response.data.content.map(
    content => content.heading
  );

  // consola.fatal(response.data.content);
  // consola.fatal(arrayContentBody);
  // consola.fatal(arrayContentHeading);
  // consola.fatal(response.data.content[0].body);
  consola.fatal(arrayContentHeading[response.data.content.length - 1]);

  const post = {
    first_publication_date: response.first_publication_date,
    uid: response.uid,
    data: {
      title: response.data.title,
      subtitle: response.data.subtitle,
      banner: {
        url: response.data.banner.url,
      },
      author: response.data.author,
      content: [
        {
          heading: arrayContentHeading[0],
          body: arrayContentBody,
        },
      ],
    },
  };

  // consola.fatal(post.data.content);

  return {
    props: {
      post,
    },
    revalidate: 3600,
  };
};
