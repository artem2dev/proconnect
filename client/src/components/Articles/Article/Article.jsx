import {
  Avatar,
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Flex,
  FormLabel,
  Heading,
  IconButton,
  Image,
  Text,
  Textarea,
} from '@chakra-ui/react';
import React, { useEffect, useMemo, useState } from 'react';
import { BiChat, BiLike, BiSend, BiShare } from 'react-icons/bi';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { useNavigate, useParams } from 'react-router-dom';
import { commentArticle, dislikeArticle, getArticle, likeArticle } from '../../../api/articles';

const styles = {
  btnHover: { color: 'lime' },
  contextMenu: {
    flexDir: 'column',
    position: 'absolute',
    backgroundColor: '#131821',
    paddingTop: '50px',
    paddingBottom: '10px',
    w: '150px',
    right: '-40px',
    top: '15px',
    borderRadius: '10px',
  },
  actionHover: {
    backgroundColor: '#9d9d9d',
  },
};
export const Article = ({ article }) => {
  const { id } = useParams();
  const [articleData, setArticleData] = useState(article ?? null);
  const [imageToggle, setImageToggle] = useState(false);
  const [contextVisible, setContextVisible] = useState(false);
  const [isCommenting, setIsCommenting] = useState(false);
  const [commentText, setCommentText] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    if (id && !articleData) {
      handleGetArticle(id);
    }
  });

  const handleLike = () => {
    if (articleData.likedByUser) {
      return dislikeArticle(article.id).then(() => handleGetArticle(article.id));
    }
    return likeArticle(article.id).then(() => handleGetArticle(article.id));
  };

  const handleGetArticle = (articleId) => {
    getArticle(articleId)
      .then(({ data }) => {
        setArticleData({ ...articleData, ...data });
      })
      .catch(console.log);
  };

  const comments = useMemo(() => {
    if (!articleData?.comments) {
      return null;
    }

    return articleData.comments.map((comment) => (
      <Flex flex='1' gap='4' alignItems='center' flexWrap='wrap' mt={5}>
        <Avatar
          name={articleData?.author?.firstName + ' ' + articleData?.author?.lastName}
          src={''}
          _hover={{ cursor: 'pointer' }}
        />

        <Box
          display={'flex'}
          alignItems={'flex-start'}
          flexDirection={'column'}
          onClick={id ? null : () => navigate(`/article/${articleData.id}`)}
          _hover={{ cursor: 'pointer' }}
        >
          <Heading size='sm'>{articleData?.author?.firstName + ' ' + articleData?.author?.lastName}</Heading>
          <Text>{comment.comment}</Text>
        </Box>
      </Flex>
    ));
  }, [articleData?.comments]);

  return (
    <Card width={id ? '100%' : '760px'} maxH={'100%'} mt={'5'}>
      <CardHeader>
        <Flex spacing='4'>
          <Flex flex='1' gap='4' alignItems='center' flexWrap='wrap'>
            <Avatar
              name={articleData?.author?.firstName + ' ' + articleData?.author?.lastName}
              src={''}
              _hover={{ cursor: 'pointer' }}
            />

            <Box
              display={'flex'}
              alignItems={'flex-start'}
              flexDirection={'column'}
              onClick={id ? null : () => navigate(`/article/${articleData.id}`)}
              _hover={{ cursor: 'pointer' }}
            >
              <Heading size='sm'>{articleData?.author?.firstName + ' ' + articleData?.author?.lastName}</Heading>
              <Text>{articleData?.title}</Text>
            </Box>
          </Flex>
          <IconButton
            variant='ghost'
            colorScheme='gray'
            aria-label='See menu'
            icon={<BsThreeDotsVertical />}
            backgroundColor='#131821'
            zIndex='2'
            onClick={() => setContextVisible(!contextVisible)}
          />
          {contextVisible && (
            <Flex sx={styles.contextMenu} onMouseLeave={() => setContextVisible(false)}>
              <Box cursor='pointer' _hover={styles.btnHover}>
                Save
              </Box>
              <Box cursor='pointer' _hover={styles.btnHover}>
                Remove
              </Box>
              <Box cursor='pointer' _hover={styles.btnHover}>
                Report
              </Box>
              <Box cursor='pointer' _hover={styles.btnHover}>
                Box 3
              </Box>
              <Box cursor='pointer' _hover={styles.btnHover}>
                Box 4
              </Box>
            </Flex>
          )}
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
          src={`http://localhost:5000/media/static/image/${articleData?.media.bucketName}`}
          alt='Chakra UI'
          height='300px'
          style={{ objectFit: 'scale-down' }}
          onClick={() => setImageToggle(!imageToggle)}
          transition='all 0.2s'
        />
      )}

      <CardFooter flexDir='column'>
        <Flex justify='space-between' flexWrap='wrap'>
          <Flex
            sx={{
              '& > button': {
                ml: '5px',
              },
              '& > button > span': {
                ml: '5px',
              },
            }}
          >
            <Button
              max-width={'10px'}
              display='flex'
              justify='center'
              variant='ghost'
              leftIcon={<BiLike />}
              style={articleData?.likedByUser ? { backgroundColor: '#4164e3' } : {}}
              _hover={styles.actionHover}
              onClick={handleLike}
            ></Button>
            <Button
              max-width={'10px'}
              display='flex'
              justify='center'
              variant='ghost'
              leftIcon={<BiChat />}
              onClick={() => setIsCommenting(!isCommenting)}
              _hover={styles.actionHover}
            ></Button>
            <Button
              max-width={'10px'}
              display='flex'
              justify='center'
              variant='ghost'
              leftIcon={<BiShare />}
              _hover={styles.actionHover}
            ></Button>
          </Flex>
          <Flex
            flexDir='row'
            justify='space-between'
            wrap
            ml='10px'
            sx={{
              '& > p': {
                fontSize: '16px',
                ml: '10px',
                mt: '8px',
              },
            }}
          >
            <Text>{`Views: ${articleData?.views ?? 99}`}</Text>
            <Text>{`Likes: ${articleData?.likes}`}</Text>
          </Flex>
        </Flex>
        {isCommenting && (
          <Flex flexDir='column' mt='15px'>
            <FormLabel> Comment something about this:</FormLabel>
            <Flex>
              <Textarea flex='1' resize='none' onChange={(e) => setCommentText(e.target.value)} />
              <Button
                flex='0.05'
                rightIcon={<BiSend />}
                ml='5px'
                pl='12px'
                onClick={() => commentArticle(commentText, articleData.id)}
              />
            </Flex>
          </Flex>
        )}
        {comments}
      </CardFooter>
    </Card>
  );
};

export default Article;
