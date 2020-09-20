import React from 'react';

import unified from 'unified';
import remark from 'remark-parse';
import raw from 'rehype-raw';
import frontmatter from 'remark-frontmatter';
import attr from 'remark-attr';
import remark2rehype from 'remark-rehype';
import rehype2react from 'rehype-react';
import { DATA_PATH } from '../config';
import { Link } from 'react-router-dom';

const processor = unified()
  .use(remark, { commonmark: true })
  .use(frontmatter)
  .use(attr)
  .use(remark2rehype, {
    allowDangerousHtml: true,
  })
  .use(raw)
  .use(rehype2react, {
    createElement: React.createElement,
    Fragment: ({ children }) => <div className="md">{children}</div>,
    components: {
      h1: ({ children }) => <h1>{children}</h1>,
      img: ({ src, alt, ...rest }) => {
        let normalized_src = src;
        while (normalized_src.charAt(0) === '/')
          normalized_src = normalized_src.substr(1);
        if (!normalized_src.match(/^https:?\/\//))
          normalized_src = `${DATA_PATH}/${normalized_src}`;

        return (
          <div className="md-img">
            <img src={normalized_src} alt={alt} {...rest} />
            <div className="md-img-alt">{alt}</div>
          </div>
        );
      },
      a: ({ href, children, ...rest }) => {
        if (href.match(/^[a-zA-Z0-9+.-]+:/) || href.startsWith('//'))
          return (
            <a href={href} {...rest}>
              {children}
            </a>
          );
        return (
          <Link to={href} {...rest}>
            {children}
          </Link>
        );
      },
    },
  })
  .freeze();

const Markdown = ({ source }) => {
  if (source === null) return null;
  return processor.processSync(source).result;
};

export default Markdown;
