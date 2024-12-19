import { Avatar, Box, Button, Flex, IconButton, Image, Input, Text } from '@chakra-ui/react';
import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BiChat, BiSend, BiShare } from 'react-icons/bi';
import { RxCross2 } from 'react-icons/rx';
import { FaPencilAlt } from 'react-icons/fa';
import { FaHeart } from 'react-icons/fa';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { commentArticle, deleteCommentArticle, dislikeArticle, likeArticle } from '../../../api/articles';
import { useSelector } from 'react-redux';
import { config } from '../../../config/app.config';
import './style.css';

const Article = ({ article, deleteArticle }) => {
  const [comments, setComments] = useState(article.comments);
  const navigate = useNavigate();
  const [likedByUser, setLikedByUser] = useState(article?.likedByUser);
  const currentUser = useSelector((state) => state.user);
  const [articleState, setArticleState] = useState(article);
  const [isCommenting, setIsCommenting] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [articleLikesCount, setArticleLikesCount] = useState(article?.likesCount || 0);
  const [articleCommentsCount, setArticleCommentsCount] = useState(article?.commentsCount || 0);
  const commentInputRef = useRef(null);
  const [detailedComment, setDetailedComment] = useState(null);

  const mouseEnterDetailedComment = (commentId) => {
    setDetailedComment(commentId);
  };

  const mouseLeaveDetailedComment = () => {
    setDetailedComment(null);
  };

  const onSendComment = () => {
    if (commentText.trim()) {
      commentArticle(commentText.trim(), articleState.id).then(({ data: savedComment }) => {
        setArticleState((prevState) => ({
          ...prevState,
          comments: [...prevState.comments, savedComment],
        }));
        setComments((prevComments) => [...prevComments, savedComment]);
        setArticleCommentsCount(articleCommentsCount + 1);
      });

      setIsCommenting(false);
      setCommentText('');
    }
  };

  const handleInputView = () => {
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
  };

  const handleDeleteComment = (commentId) => () => {
    deleteCommentArticle(commentId)
      .then(() => {
        setComments((prevComments) => prevComments.filter((comment) => comment.id !== commentId));
        setArticleState((prevArticleState) => ({
          ...prevArticleState,
          comments: prevArticleState?.comments.filter((comment) => comment.id !== commentId),
        }));
        setArticleCommentsCount(articleCommentsCount - 1);
      })
      .catch(console.error);
  };

  const handleLike = () => {
    if (likedByUser) {
      dislikeArticle(article.id)
        .then(({ data }) => {
          setLikedByUser(false);
          setArticleLikesCount(data.likesCount);
        })
        .catch((err) => console.error(err));
    } else {
      likeArticle(article.id)
        .then(({ data }) => {
          setLikedByUser(true);
          setArticleLikesCount(data.likesCount);
        })
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
    color: '#e90d0d',
    hoverColor: '#272e3a',
  };

  const unlikedStyle = {
    color: '#ffffff',
    hoverColor: '#272e3a',
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
          <Flex gap={2}>
            <Text
              fontWeight={'medium'}
              onClick={() => {
                window.scrollTo(0, 0);
                navigate(`/profile/${article.author.userName}`);
              }}
              cursor={'pointer'}
              alignSelf={'start'}
              _hover={{ color: 'gray.400' }}
            >
              {article.author.firstName} {article.author.lastName}
            </Text>
          </Flex>
          <Text color={'gray.500'} fontSize={'15'}>
            {new Date(article.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </Text>
        </Flex>
        <HoverContextMenu
          options={[
            { label: 'Save', cb: () => alert('Save') },
            { label: 'Remove', cb: () => deleteArticle(article.id) },
            { label: 'Report', cb: () => alert('Report') },
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
          display='flex'
          justify='center'
          variant='ghost'
          iconSpacing={0}
          leftIcon={<FaHeart size={'18px'} />}
          backgroundColor={likedByUser ? '#274b9f' : 'gray.800'}
          _hover={{ backgroundColor: likedByUser ? likedStyle.hoverColor : unlikedStyle.hoverColor }}
          onClick={handleLike}
        >
          {articleLikesCount > 0 ? (
            <Text marginLeft={'5px'} fontSize={'14px'}>
              {articleLikesCount}
            </Text>
          ) : null}
        </Button>
        <Button
          display='flex'
          justify='center'
          variant='ghost'
          iconSpacing={0}
          leftIcon={<BiChat size={'18px'} />}
          backgroundColor={isCommenting ? '#274b9f' : 'gray.800'}
          _hover={{ backgroundColor: '#272e3a' }}
          onClick={() => {
            setIsCommenting(!isCommenting);
            setCommentText('');
            handleInputView();
          }}
        >
          {articleCommentsCount > 0 ? (
            <Text marginLeft={'5px'} fontSize={'14px'}>
              {articleCommentsCount}
            </Text>
          ) : null}
        </Button>
        <Button
          display='flex'
          justify='center'
          variant='ghost'
          iconSpacing={0}
          leftIcon={<BiShare size={'18px'} />}
          backgroundColor={'gray.800'}
          _hover={{ backgroundColor: '#272e3a' }}
        ></Button>
      </Flex>
      <Flex flexDirection={'column'}>
        {comments?.length > 0 && (
          <Flex flexDirection={'column'} gap={'16px'}>
            <hr
              style={{
                border: '0.5px solid var(--chakra-colors-gray-800)',
                width: '100%',
                marginTop: '10px',
              }}
            />
            {comments?.map((comment, index) => {
              return (
                <Flex flexDirection={'column'} key={comment.id}>
                  <Flex
                    gap={'10px'}
                    position='relative'
                    onMouseEnter={() => mouseEnterDetailedComment(comment.id)}
                    onMouseLeave={mouseLeaveDetailedComment}
                  >
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
                        _hover={{ color: 'gray.400' }}
                      >
                        {comment.author.firstName} {comment.author.lastName}
                      </Text>

                      <Text overflowWrap={'anywhere'} whiteSpace={'pre-wrap'}>
                        {comment.comment}
                      </Text>

                      <Flex gap={2}>
                        <Text color={'gray.500'} fontSize={'15'}>
                          {new Date(comment.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </Text>
                        <Text
                          fontSize={'15'}
                          cursor={'pointer'}
                          _hover={{ color: 'gray.400' }}
                          onClick={() => {
                            setIsCommenting(true);
                            setCommentText(`${comment.author.firstName}, `);
                            handleInputView();
                          }}
                        >
                          Reply
                        </Text>
                      </Flex>

                      {index !== comments?.length - 1 ? (
                        <hr
                          style={{
                            border: '1px solid var(--chakra-colors-gray-800)',
                            margin: '10px 0px -5px 0px',
                          }}
                        />
                      ) : null}
                    </Flex>
                    {comment.id === detailedComment &&
                      (article?.authorId === currentUser?.id ? (
                        <Flex position='absolute' right='1' top='1' gap={1}>
                          {currentUser?.id === comment.author?.id ? (
                            <FaPencilAlt className='edit-comment' onClick={() => alert('Изменил, проверяй')} />
                          ) : null}
                          <RxCross2 className='delete-comment' onClick={handleDeleteComment(comment.id)} />
                        </Flex>
                      ) : currentUser?.id === comment.author?.id ? (
                        <Flex position='absolute' right='1' top='1' gap={1}>
                          <FaPencilAlt className='edit-comment' onClick={() => alert('Изменил, проверяй')} />
                          <RxCross2 className='delete-comment' onClick={handleDeleteComment(comment.id)} />
                        </Flex>
                      ) : null)}
                  </Flex>
                </Flex>
              );
            })}
          </Flex>
        )}
        {isCommenting && (
          <Flex flexDir='column' mt='15px'>
            <Flex>
              <Input
                ref={commentInputRef}
                variant='filled'
                placeholder='Comment something about this...'
                flex='1'
                resize='none'
                value={commentText}
                _hover={''}
                _focus={{
                  border: null,
                  borderColor: '#1f2129',
                  bgColor: '#1f2129',
                  caretColor: 'white',
                  color: 'white',
                }}
                onChange={(e) => setCommentText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    onSendComment();
                  }
                }}
              />
              <Button
                flex='0.05'
                rightIcon={<BiSend size={'20px'} color='white' />}
                _hover={{ backgroundColor: '#272e3a' }}
                ml='10px'
                bgColor={'#274b9f'}
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
