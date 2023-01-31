import { Box, Flex } from '@chakra-ui/react';
import { useState } from 'react';
import { useCallback } from 'react';
import { useEffect } from 'react';
import { getArticles } from '../../api/articles';
import Article from './Article/Article';

export default function ArticlesScroll() {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    if (!articles.length) {
      getArticles().then(({ data }) => {
        setArticles(data);
      });
    }
  }, []);
  const articleItems = useCallback(
    () => articles?.map((article, index) => <Article {...{ article }} key={index} />),
    [articles],
  );

  return (
    <Flex maxH={'100%'} maxWidth={'100%'} justifyContent={'center'}>
      <Flex justifyContent={'center'} flexDirection={'column'}>
        {articles.length && articleItems()}
      </Flex>
    </Flex>
  );
}
