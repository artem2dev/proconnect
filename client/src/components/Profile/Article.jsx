import { Avatar, Box, Button, Flex, FormLabel, IconButton, Image, Input, Text } from '@chakra-ui/react';
import React, { useRef, useState } from 'react';
import { config } from '../../config/app.config';
import { useNavigate } from 'react-router-dom';
import { BiChat, BiLike, BiSend, BiShare } from 'react-icons/bi';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { commentArticle, deleteCommentArticle, dislikeArticle, likeArticle } from '../../api/articles';
import { useSelector } from 'react-redux';

const Article = ({ article }) => {
  const [comments, setComments] = useState(article.comments);
  const navigate = useNavigate();
  const [likedByUser, setLikedByUser] = useState(article?.likedByUser);
  const currentUser = useSelector((state) => state.user);
  const [articleState, setArticleState] = useState(article);
  const [isCommenting, setIsCommenting] = useState(false);
  const [commentText, setCommentText] = useState('');
  const commentInputRef = useRef(null);

  const onSendComment = () => {
    if (commentText.trim()) {
      commentArticle(commentText.trim(), articleState.id).then(({ data: savedComment }) => {
        setArticleState((prevState) => ({
          ...prevState,
          comments: [...prevState.comments, savedComment],
        }));
        setComments((prevComments) => [...prevComments, savedComment]);
      });

      setIsCommenting(false);
      setCommentText('');
    }
  };

  const handleInputView = () => {
    if (!isCommenting) {
      setTimeout(() => {
        if (commentInputRef.current) {
          const rect = commentInputRef.current.getBoundingClientRect();
          const isInViewport = rect.top >= 0 && rect.bottom <= window.innerHeight;

          if (!isInViewport) {
            commentInputRef.current.scrollIntoView({
              behavior: 'smooth',
              block: 'end',
            });
            window.scrollBy(0, 50);
          }

          commentInputRef.current.focus();
        }
      }, 50);
    }
  };

  const handleDeleteComment = (commentId) => () => {
    deleteCommentArticle(commentId)
      .then(() => {
        setComments((prevComments) => prevComments.filter((comment) => comment.id !== commentId));
        setArticleState((prevArticleState) => ({
          ...prevArticleState,
          comments: prevArticleState?.comments.filter((comment) => comment.id !== commentId),
        }));
      })
      .catch(console.error);
  };

  const handleLike = () => {
    if (likedByUser) {
      dislikeArticle(article.id)
        .then(() => setLikedByUser(false))
        .catch((err) => console.error(err));
    } else {
      likeArticle(article.id)
        .then(() => setLikedByUser(true))
        .catch((err) => console.error(err));
    }
  };

  const HoverContextMenu = ({ options }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <Flex
        position='relative'
        marginLeft='auto'
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
      >
        <Box
          style={{
            transform: 'rotate(90deg)',
            transformOrigin: 'center',
          }}
          marginLeft='auto'
        >
          <IconButton
            variant='ghost'
            colorScheme='gray'
            aria-label='See menu'
            icon={<BsThreeDotsVertical />}
            backgroundColor='RGBA(0, 0, 0, 0)'
            _hover={{ backgroundColor: 'RGBA(0, 0, 0, 0)' }}
            zIndex='2'
          />
        </Box>
        {isOpen && (
          <Box
            position='absolute'
            top='100%'
            left={'-14'}
            bg='gray.800'
            p='2'
            borderRadius='md'
            boxShadow='lg'
            zIndex='3'
            minW={'160px'}
          >
            {options.map((option, index) => (
              <Box
                key={index}
                p='2'
                color='white'
                _hover={{ backgroundColor: 'gray.700', cursor: 'pointer' }}
                onClick={option.cb}
              >
                {option.label}
              </Box>
            ))}
          </Box>
        )}
      </Flex>
    );
  };

  const likedStyle = {
    backgroundColor: '#4164e3',
    hoverColor: '#274b9f',
  };

  const unlikedStyle = {
    backgroundColor: 'gray.800',
    hoverColor: 'gray.600',
  };

  return (
    <Flex
      flexDirection={'column'}
      key={article.id}
      w={'100%'}
      gap={'6px'}
      bgColor='RGBA(0, 0, 0, 0.2)'
      rounded={8}
      border={'1px'}
      borderColor={'gray.800'}
      p={3}
    >
      <Flex justifyContent={'flex-start'} gap={'10px'}>
        <Flex flexDirection={'row'}>
          <Avatar
            src={config.API + '/media/image/' + article?.author?.id}
            onClick={() => {
              window.scrollTo(0, 0);
              navigate(`/profile/${article.author.userName}`);
            }}
            cursor={'pointer'}
          ></Avatar>
        </Flex>
        <Flex flexDirection={'column'}>
          <Text
            fontWeight={'medium'}
            onClick={() => {
              window.scrollTo(0, 0);
              navigate(`/profile/${article.author.userName}`);
            }}
            cursor={'pointer'}
            alignSelf={'start'}
          >
            {article.author.firstName} {article.author.lastName}
          </Text>
          <Text color={'gray.500'}>
            {new Date(article.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </Text>
        </Flex>
        <HoverContextMenu
          options={[
            { label: 'Save', cb: () => alert('Save!') },
            { label: 'Remove', cb: () => alert('Remove!') },
            { label: 'Report', cb: () => alert('Report!') },
            { label: 'Box 3', cb: () => alert('Box 3!') },
            { label: 'Box 4', cb: () => alert('Box 4!') },
          ]}
        />
      </Flex>
      <Flex flexDirection={'column'} gap={'6px'}>
        {article?.title && (
          <Text fontSize={'2xl'} fontWeight={'bold'} overflowWrap={'anywhere'}>
            {article?.title}
          </Text>
        )}
        <Text overflowWrap={'anywhere'}>{article?.content}</Text>
      </Flex>
      {article?.media && (
        <Image
          objectFit='cover'
          src={`${config.API}/media/static/image/${article?.media.id}`}
          alt='Chakra UI'
          height='300px'
          style={{ objectFit: 'scale-down' }}
          transition='all 0.2s'
          m={2}
        />
      )}
      <Flex gap={'10px'} mt={2}>
        <Button
          max-width={'10px'}
          display='flex'
          justify='center'
          variant='ghost'
          leftIcon={<BiLike />}
          backgroundColor={likedByUser ? likedStyle.backgroundColor : unlikedStyle.backgroundColor}
          _hover={{ backgroundColor: likedByUser ? likedStyle.hoverColor : unlikedStyle.hoverColor }}
          onClick={handleLike}
        ></Button>
        <Button
          max-width={'10px'}
          display='flex'
          justify='center'
          variant='ghost'
          leftIcon={<BiChat />}
          backgroundColor={isCommenting ? likedStyle.backgroundColor : 'gray.800'}
          _hover={{ backgroundColor: isCommenting ? likedStyle.hoverColor : 'gray.600' }}
          onClick={() => {
            setIsCommenting(!isCommenting);
            setCommentText('');
            handleInputView();
          }}
        ></Button>
        <Button
          max-width={'10px'}
          display='flex'
          justify='center'
          variant='ghost'
          leftIcon={<BiShare />}
          backgroundColor={'gray.800'}
          _hover={{ backgroundColor: 'gray.600' }}
        ></Button>
      </Flex>
      <Flex flexDirection={'column'}>
        {comments.length > 0 && (
          <Flex flexDirection={'column'} gap={'16px'}>
            <hr
              style={{
                border: '1px solid var(--chakra-colors-gray-800)',
                width: '75%',
                margin: '15px auto auto auto',
              }}
            />
            {comments?.map((comment) => {
              return (
                <Flex flexDirection={'column'} gap={'6px'} key={comment.id}>
                  <Flex gap={'10px'} position='relative'>
                    <Flex flexDirection={'row'}>
                      <Avatar
                        src={config.API + '/media/image/' + comment.author?.id}
                        onClick={() => {
                          window.scrollTo(0, 0);
                          navigate(`/profile/${comment.author.userName}`);
                        }}
                        cursor={'pointer'}
                      ></Avatar>
                    </Flex>
                    <Flex flexDirection={'column'} flex={'1'}>
                      <Text
                        fontWeight={'medium'}
                        onClick={() => {
                          window.scrollTo(0, 0);
                          navigate(`/profile/${comment.author.userName}`);
                        }}
                        cursor={'pointer'}
                        alignSelf={'start'}
                      >
                        {comment.author.firstName} {comment.author.lastName}
                      </Text>
                      <Text overflowWrap={'anywhere'} whiteSpace={'pre-wrap'}>
                        {comment.comment}
                      </Text>
                    </Flex>
                    <Flex position='absolute' right='-1' top='-2'>
                      <HoverContextMenu
                        options={
                          currentUser?.id === comment.author?.id
                            ? [
                                { label: 'Remove', cb: handleDeleteComment(comment.id) },
                                { label: 'Report', cb: () => alert('Словил кринж!') },
                              ]
                            : [{ label: 'Report', cb: () => alert('Словил кринж!') }]
                        }
                      >
                        <Box
                          style={{
                            transform: 'rotate(90deg)',
                            transformOrigin: 'center',
                          }}
                        >
                          <IconButton
                            variant='ghost'
                            colorScheme='gray'
                            aria-label='See menu'
                            icon={<BsThreeDotsVertical />}
                            backgroundColor='gray.800'
                            _hover={{ backgroundColor: 'gray.600' }}
                            zIndex='2'
                          />
                        </Box>
                      </HoverContextMenu>
                    </Flex>
                  </Flex>
                </Flex>
              );
            })}
          </Flex>
        )}
        {isCommenting && (
          <Flex flexDir='column' mt='15px'>
            <FormLabel> Comment something about this:</FormLabel>
            <Flex>
              <Input
                ref={commentInputRef}
                variant='filled'
                placeholder='Type here...'
                flex='1'
                resize='none'
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    onSendComment();
                  }
                }}
              />
              <Button
                flex='0.05'
                rightIcon={<BiSend style={{ width: '20px', height: '20px' }} />}
                ml='5px'
                pl='12px'
                height={'40px'}
                onClick={onSendComment}
              />
            </Flex>
          </Flex>
        )}
      </Flex>
    </Flex>
  );
};

export default Article;
