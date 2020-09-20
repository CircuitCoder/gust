import React from 'react';

import unified from 'unified';
import parse from 'remark-parse';
import frontmatter from 'remark-frontmatter';
import remark2rehype from 'remark-rehype';
import rehype2react from 'rehype-react';

const processor = unified()
  .use(parse, { commonmark: true })
  .use(frontmatter)
  .use(remark2rehype)
  .use(rehype2react, {
    createElement: React.createElement,
    Fragment: ({ children }) => <div className="md">{children}</div>,
    components: {
      h1: ({ children }) => <h1>{ children }</h1>
    },
  })
  .freeze();

const Markdown = ({ source }) => {
  if(source === null) return null;
  return processor.processSync(source).result;
};

export default Markdown;
