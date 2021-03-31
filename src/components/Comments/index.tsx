import { useState, useRef, useEffect } from 'react';
import styles from './styles.module.scss';

export type MappingType =
  | 'pathname'
  | 'url'
  | 'title'
  | 'og:title'
  | 'issue-number'
  | 'issue-term';

export type Theme =
  | 'github-light'
  | 'github-dark'
  | 'preferred-color-scheme'
  | 'github-dark-orange'
  | 'icy-dark'
  | 'dark-blue'
  | 'photon-dark';

interface CommentProps {
  repo: string;
  issueMap: MappingType;
  issueTerm?: string;
  issueNumber?: number;
  label?: string;
  theme: Theme;
}

export default function Comments({
  issueTerm,
  issueMap,
  repo,
  theme,
  issueNumber,
  label,
}: CommentProps): JSX.Element {
  const [pending, setPending] = useState(true);
  const reference = useRef<HTMLDivElement>(null);

  if (issueMap === 'issue-term' && issueTerm === undefined) {
    throw Error(
      "Property 'issueTerm' must be provided with issueMap 'issue-term'"
    );
  }

  if (issueMap === 'issue-number' && issueNumber === undefined) {
    throw Error(
      "Property 'issueNumber' must be provided with issueMap 'issue-number'"
    );
  }

  useEffect(() => {
    const scriptElement = document.createElement('script');
    scriptElement.src = 'https://utteranc.es/client.js';
    scriptElement.async = true;
    scriptElement.defer = true;
    scriptElement.setAttribute('repo', repo);
    scriptElement.setAttribute('crossorigin', 'annonymous');
    scriptElement.setAttribute('theme', theme);
    scriptElement.onload = () => setPending(false);

    if (label) {
      scriptElement.setAttribute('label', label);
    }

    if (issueMap === 'issue-number') {
      scriptElement.setAttribute('issue-number', issueNumber.toString());
    } else if (issueMap === 'issue-term') {
      scriptElement.setAttribute('issue-term', issueTerm);
    } else {
      scriptElement.setAttribute('issue-term', issueMap);
    }
    reference.current.appendChild(scriptElement);
  }, [issueMap, issueNumber, issueTerm, label, repo, theme]);

  return (
    <div className={styles.comments}>
      <div className={styles.utterances} ref={reference}>
        {pending && <p>Loading Comments...</p>}
      </div>
    </div>
  );
}
