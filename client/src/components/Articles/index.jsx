import { Flex } from '@chakra-ui/react';
import { useCallback, useEffect, useState } from 'react';
import { getArticles } from '../../api/articles';
import React from 'react';
import Article from './Article';

export default function ArticlesScroll() {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    if (!articles.length) {
      getArticles().then(({ data }) => {
        setArticles(data);
      });
    }
  }, [articles?.length]);

  const articleItems = useCallback(
    () => articles?.map((article, index) => <Article {...{ article }} key={index} />),
    [articles],
  );

  return (
    <Flex maxH={'100%'} flexDirection={'column'} gap={'10px'} w={'100%'}>
      {!!articles.length && articleItems()}
    </Flex>
  );
}
