import { useEffect, useState } from 'react';
import { getArticles } from '../../api/articles';
import { Flex, Text } from '@chakra-ui/react';
import Article from './Article';
import { useParams } from 'react-router-dom';

const ArticlesList = ({ article }) => {
  const [articles, setArticles] = useState([]);
  const { userName } = useParams();

  useEffect(() => {
    const onSuccess = ({ data }) => {
      const userPosts = data.filter((articleInfo) => articleInfo.author.userName === userName);
      setArticles(userPosts);
    };

    const onError = () => {
      setArticles({});
    };

    getArticles(userName).then(onSuccess).catch(onError);
  }, [userName]);

  return (
    <Flex flexDirection={'column'} gap={'10px'} w={'100%'}>
      {!articles.length && (
        <Flex
          w={'100%'}
          gap={'6px'}
          bgColor='RGBA(0, 0, 0, 0.2)'
          rounded={8}
          border={'1px'}
          borderColor={'gray.800'}
          minH={'76px'}
        >
          <Text fontSize={'28px'} color={'gray.600'} m={'auto'} textAlign={'center'} w={'100%'}>
            The user has no posts
          </Text>
        </Flex>
      )}
      {articles.map((article) => (
        <Article key={article.id} article={article}></Article>
      ))}
    </Flex>
  );
};

export default ArticlesList;
