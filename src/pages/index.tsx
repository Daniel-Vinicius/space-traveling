import { GetStaticProps } from 'next';
import { FiCalendar, FiUser } from 'react-icons/fi';
import Link from 'next/link';

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

export default function Home(): JSX.Element {
  return (
    <div className={commonStyles.container}>
      <Link href="/post/como-utilizar-hooks">
        <div className={styles.post}>
          <h2>Como utilizar Hooks</h2>
          <span>Pensando em sincronização em vez de ciclos de vida.</span>
          <div className={commonStyles.info}>
            <p>
              <FiCalendar /> 15 Mar 2021
            </p>
            <p>
              <FiUser /> Daniel Vinicius
            </p>
          </div>
        </div>
      </Link>
      <Link href="/post/como-utilizar-hooks">
        <div className={styles.post}>
          <h2>Como utilizar Hooks</h2>
          <span>Pensando em sincronização em vez de ciclos de vida.</span>
          <div className={commonStyles.info}>
            <p>
              <FiCalendar /> 15 Mar 2021
            </p>
            <p>
              <FiUser /> Daniel Vinicius
            </p>
          </div>
        </div>
      </Link>

      <div className={styles.morePosts}>
        <button className={styles.morePosts} type="button">
          Carregar mais posts
        </button>
      </div>
    </div>
  );
}

// export const getStaticProps = async () => {
//   // const prismic = getPrismicClient();
//   // const postsResponse = await prismic.query(TODO);

//   // TODO
// };
