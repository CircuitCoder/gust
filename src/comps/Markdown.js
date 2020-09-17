import React from 'react';

import unified from 'unified';
import parse from 'remark-parse';
import frontmatter from 'remark-frontmatter';
import remark2rehype from 'remark-rehype';
import rehype2react from 'rehype-react';

const processor = unified().use(
  parse, { commonmark: true },
).use(
  frontmatter,
).use(
  remark2rehype,
).use(
  rehype2react, {
    createElement: React.createElement,
  }
).freeze();

const Markdown = ({ source }) => {
  return processor.processSync(source).result
}

export default Markdown;
