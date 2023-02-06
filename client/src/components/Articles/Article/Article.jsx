import {
  Avatar,
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Flex,
  Heading,
  Image,
  Text,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { BiChat, BiLike, BiShare } from 'react-icons/bi';
import { useParams } from 'react-router-dom';
import { getArticle } from '../../../api/articles';
import { config } from '../../../config/app.config';

export const Article = ({ article }) => {
  const { id } = useParams();
  const [articleData, setArticleData] = useState(article ?? null);
  const [imageToggle, setImageToggle] = useState(false);

  useEffect(() => {
    if (id && !articleData) {
      getArticle(id)
        .then(({ data }) => {
          setArticleData(data);
        })
        .catch(console.log);
    }
  });

  return (
    <Card maxW='xl' maxH={'100%'} mt={'5'}>
      <CardHeader>
        <Flex spacing='4'>
          <Flex flex='1' gap='4' alignItems='center' flexWrap='wrap'>
            <Avatar name='Segun Adebayo' src='https://bit.ly/sage-adebayo' />

            <Box display={'flex'} alignItems={'flex-start'} flexDirection={'column'}>
              <Heading size='sm'>{articleData?.author?.firstName + ' ' + articleData?.author?.lastName}</Heading>
              <Text>{articleData?.title}</Text>
            </Box>
          </Flex>
          {/* <IconButton variant='ghost' colorScheme='gray' aria-label='See menu' icon={<BsThreeDotsVertical />} /> */}
        </Flex>
      </CardHeader>
      <CardBody maxH={'300px'} padding='0px 20px 10px 20px'>
        <Text maxH={'100%'} textOverflow={'initial'}>
          {articleData?.content}
        </Text>
      </CardBody>
      {articleData?.media && (
        <Image
          objectFit='cover'
          src={`${config.API}/media/static/image/${articleData?.media.bucketName}`}
          alt='Chakra UI'
          height='300px'
          style={{ objectFit: 'scale-down' }}
          onClick={() => setImageToggle(!imageToggle)}
          transition='all 0.2s'
        />
      )}

      <CardFooter
        justify='space-between'
        flexWrap='wrap'
        sx={{
          '& > button': {
            minW: '136px',
          },
        }}
      >
        <Button flex='0.25' variant='ghost' leftIcon={<BiLike />}>
          Like
        </Button>
        <Button flex='0.25' variant='ghost' leftIcon={<BiChat />}>
          Comment
        </Button>
        <Button flex='0.25' variant='ghost' leftIcon={<BiShare />}>
          Share
        </Button>
      </CardFooter>
    </Card>
  );
};

export default Article;
