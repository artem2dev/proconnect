/* eslint-disable react-hooks/exhaustive-deps */
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
  Input,
  Text,
} from '@chakra-ui/react';
import React, { useEffect, useMemo, useState } from 'react';
import { AiFillEye } from 'react-icons/ai';
import { BiChat, BiLike, BiSend, BiShare } from 'react-icons/bi';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

import { commentArticle, deleteCommentArticle, dislikeArticle, getArticle, likeArticle } from '../../../api/articles';
import { config } from '../../../config/app.config';
import ContextMenu from '../../dialogs/ContextMenu/ContextMenu';

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
  const [isCommenting, setIsCommenting] = useState(false);
  const [commentText, setCommentText] = useState('');

  const currentUser = useSelector((state) => state.user);

  const navigate = useNavigate();

  useEffect(() => {
    if (id && !articleData) {
      handleGetArticle(id);
    }
  }, [articleData]);

  const handleLike = () => {
    if (articleData.likedByUser) {
      return dislikeArticle(articleData.id).then(() => {
        setArticleData({ ...articleData, likedByUser: false });
        handleGetArticle(articleData.id);
      });
    }

    return likeArticle(articleData.id).then(() => {
      setArticleData({ ...articleData, likedByUser: true });
      handleGetArticle(articleData.id);
    });
  };

  const handleGetArticle = (articleId) => {
    getArticle(articleId)
      .then(({ data }) => {
        setArticleData({ ...articleData, ...data });
      })
      .catch(console.error);
  };

  const handleDeleteComment = (commentId) => () => {
    deleteCommentArticle(commentId)
      .then(() => {
        setArticleData({
          ...articleData,
          comments: articleData?.comments.filter((comment) => comment.id !== commentId),
        });
      })
      .catch(console.error);
  };

  const comments = useMemo(() => {
    if (!articleData?.comments) {
      return null;
    }

    return articleData.comments.map((comment) => {
      return (
        <Flex flex='1' gap='4' alignItems='center' flexWrap='nowrap' mt={5} key={comment.id} dir='row'>
          <Avatar
            name={comment?.author?.firstName + ' ' + comment?.author?.lastName}
            src={`${config.API}/media/image/` + comment?.author?.id}
            _hover={{ cursor: 'pointer' }}
          />
          <Flex justify='space-between' w='100%'>
            <Box
              display={'flex'}
              alignItems={'flex-start'}
              flexDirection={'column'}
              onClick={() => navigate(`/profile/${comment.author.userName}`)}
              _hover={{ cursor: 'pointer' }}
            >
              <Heading size='sm'>{comment?.author?.firstName + ' ' + comment?.author?.lastName}</Heading>
              <Text>{comment.comment}</Text>
            </Box>
            <ContextMenu
              options={
                currentUser?.id === comment.author?.id
                  ? [
                      { label: 'Remove', cb: handleDeleteComment(comment.id) },
                      { label: 'Report', cb: () => alert('Словил кринж!') },
                    ]
                  : [{ label: 'Report', cb: () => alert('Словил кринж!') }]
              }
            >
              <Box>
                <IconButton
                  variant='ghost'
                  colorScheme='gray'
                  aria-label='See menu'
                  icon={<BsThreeDotsVertical />}
                  backgroundColor='#131821'
                  zIndex='2'
                />
              </Box>
            </ContextMenu>
          </Flex>
        </Flex>
      );
    });
  }, [articleData]);
  return (
    <Card width={id ? '100%' : '760px'} maxH={'100%'} mt={'5'}>
      <CardHeader>
        <Flex spacing='4'>
          <Flex flex='1' gap='4' alignItems='center' flexWrap='wrap'>
            <Avatar
              name={articleData?.author?.firstName + ' ' + articleData?.author?.lastName}
              src={`${config.API}/media/image/` + articleData?.author?.id}
              _hover={{ cursor: 'pointer' }}
            />

            <Box
              display={'flex'}
              alignItems={'flex-start'}
              flexDirection={'column'}
              onClick={id ? null : () => navigate(`/article/${articleData.id}`)}
              _hover={{ cursor: 'pointer' }}
            >
              <Text fontSize={'2xl'} whiteSpace={'nowrap'} maxW={'600px'}>
                {articleData?.title}
              </Text>
              <Heading size='md' fontSize={'sm'}>
                {articleData?.author?.firstName + ' ' + articleData?.author?.lastName}
              </Heading>
            </Box>
          </Flex>
          <ContextMenu
            options={[
              { label: 'Save', cb: () => alert('Save!') },
              { label: 'Remove', cb: () => alert('Remove!') },
              { label: 'Report', cb: () => alert('Report!') },
              { label: 'Box 3', cb: () => alert('Box 3!') },
              { label: 'Box ', cb: () => alert('Box 4!') },
            ]}
            withHeightOffset
          >
            <Box>
              <IconButton
                variant='ghost'
                colorScheme='gray'
                aria-label='See menu'
                icon={<BsThreeDotsVertical />}
                backgroundColor='#131821'
                zIndex='2'
              />
            </Box>
          </ContextMenu>
        </Flex>
      </CardHeader>
      <CardBody maxH={'2000px'} padding='0px 20px 10px 20px'>
        <Text maxH={'100%'} style={{ whiteSpace: 'pre-line' }} textOverflow={'initial'}>
          {articleData?.content}
        </Text>
      </CardBody>
      {articleData?.media && (
        <Image
          objectFit='cover'
          src={`${config.API}/media/static/image/${articleData?.media.id}`}
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
            <Box
              width={'50px'}
              display={'flex'}
              alignItems={'center'}
              justifyContent={'space-around'}
              flexDirection={'row'}
            >
              <AiFillEye />
              <Text>{articleData?.views ?? 99}</Text>
            </Box>
          </Flex>
        </Flex>
        {comments}
        {isCommenting && (
          <Flex flexDir='column' mt='15px'>
            <FormLabel> Comment something about this:</FormLabel>
            <Flex>
              <Input
                variant='filled'
                placeholder='Type here...'
                flex='1'
                resize='none'
                onChange={(e) => setCommentText(e.target.value)}
              />
              <Button
                flex='0.05'
                rightIcon={<BiSend style={{ width: '20px', height: '20px' }} />}
                ml='5px'
                pl='12px'
                height={'40px'}
                onClick={() => {
                  commentArticle(commentText, articleData.id).then(({ data: savedComment }) => {
                    setArticleData({ ...articleData, comments: [...articleData?.comments, savedComment] });
                  });
                }}
              />
            </Flex>
          </Flex>
        )}
      </CardFooter>
    </Card>
  );
};

export default Article;
