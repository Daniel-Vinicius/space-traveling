import { GetStaticPaths, GetStaticProps } from 'next';
import { FiCalendar, FiUser, FiClock } from 'react-icons/fi';
import Header from '../../components/Header';

import { getPrismicClient } from '../../services/prismic';

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

export default function Post(): JSX.Element {
  return (
    <>
      <Header />
      <div className={commonStyles.container}>
        <img className={styles.preview} src="/banner.png" alt="Banner" />
        <main className={styles.contentContainer}>
          <h1>Criando um app CRA do zero </h1>
          <div className={commonStyles.info}>
            <p>
              <FiCalendar /> 15 Mar 2021
            </p>
            <p>
              <FiUser /> Daniel Vinicius
            </p>
            <p>
              <FiClock /> 4 min
            </p>
          </div>
          <div className={styles.content}>
            <h3>Algo</h3>
            <p>
              Lorem ipsum dolor sit amet. Ola Pessoal Pessoal ola São São ola
              Pessoal Uhuuuu Demais Pessoal São São ola Demais ola Batatas
              Batatas. Ola Pessoal Demais ola Pessoal São ola São Demais Batatas
              Pessoal ola Pessoal. Batatas São São ola Uhuuuu São! Pessoal
              Batatas ola Demais Pessoal ola Uhuuuu Demais Pessoal Batatas ola
              São Demais.
            </p>
            <p>
              Lorem ipsum dolor sit amet. Uhuuuu Uhuuuu ola São Pessoal ola
              Pessoal Demais Pessoal. Uhuuuu Batatas ola Pessoal Batatas Uhuuuu
              ola Uhuuuu Demais. Uhuuuu Demais Demais ola Uhuuuu Pessoal . Ola
              Batatas Demais ola Batatas Batatas São ola Uhuuuu Demais? Ola
              Uhuuuu Pessoal Uhuuuu Batatas São Uhuuuu Demais ola Pessoal Uhuuuu
              Pessoal Demais Pessoal. Uhuuuu Demais Demais São Ola Batatas.
              Uhuuuu Demais São Uhuuuu ola São Batatas ola Uhuuuu Uhuuuu Pessoal
              Uhuuuu ola Pessoal. Batatas Uhuuuu Pessoal Uhuuuu Batatas Uhuuuu
              ola Pessoal Pessoal ola Pessoal São ola Demais? Lorem ipsum dolor
              sit amet. Uhuuuu Uhuuuu ola São Pessoal ola Pessoal Demais
              Pessoal. Uhuuuu Batatas ola Pessoal Batatas Uhuuuu ola Uhuuuu
              Demais. Uhuuuu Demais Demais ola Uhuuuu Pessoal . Ola Batatas
              Demais ola Batatas Batatas São ola Uhuuuu Demais? Ola Uhuuuu
              Pessoal Uhuuuu Batatas São Uhuuuu Demais ola Pessoal Uhuuuu
              Pessoal Demais Pessoal. Uhuuuu Demais Demais São Ola Batatas.
              Uhuuuu Demais São Uhuuuu ola São Batatas ola Uhuuuu Uhuuuu Pessoal
              Uhuuuu ola Pessoal. Batatas Uhuuuu Pessoal Uhuuuu Batatas Uhuuuu
              ola Pessoal Pessoal ola Pessoal São ola Demais?
            </p>
          </div>
        </main>
      </div>
    </>
  );
}

// export const getStaticPaths = async () => {
//   const prismic = getPrismicClient();
//   const posts = await prismic.query(TODO);

//   // TODO
// };

// export const getStaticProps = async context => {
//   const prismic = getPrismicClient();
//   const response = await prismic.getByUID(TODO);

//   // TODO
// };
