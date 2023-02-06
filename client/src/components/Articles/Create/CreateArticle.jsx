import { Button, Flex, FormLabel, Image, Input, Text, Textarea } from '@chakra-ui/react';
import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createArticle, createArticles } from '../../../api/articles';

export const CreateArticle = () => {
  const [currentFile, setCurrentFile] = useState(null);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const file = e?.target?.files?.[0];

    setCurrentFile(file);
  };

  const fileRef = useRef(null);
  const formRef = useRef(null);

  const onSubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);

    try {
      const { data: savedArticle } = await createArticle(fd);

      navigate(`/article/${savedArticle.id}`);
    } catch (err) {
      console.log(err);
    }

    return false;
  };
  return (
    <Flex alignItems={'center'} flexDir={'column'}>
      <Flex>
        <Text variant={'title'}>Create Post:</Text>
      </Flex>
      <Flex flexDir='column' width={'100%'}>
        <form onSubmit={onSubmit} ref={formRef}>
          <FormLabel as='legend' mt='10px'>
            Title:
          </FormLabel>
          <Input type={'text'} name='title' formTarget='text' />
          <FormLabel as='legend' mt='10px'>
            Body:
          </FormLabel>
          <Textarea name='content' />
          <FormLabel as='legend' mt='10px'>
            Optional image:
          </FormLabel>
          {currentFile && (
            <Flex flexDir='column' align='center' mb='10px'>
              <Image
                height='200px'
                style={{ objectFit: 'scale-down' }}
                m='15px'
                src={URL.createObjectURL(currentFile)}
              />
              <Button
                width={'300px'}
                mt='20px'
                onClick={() => {
                  setCurrentFile(null);
                  fileRef.current.value = '';
                }}
              >
                Remove Image
              </Button>
            </Flex>
          )}
          <Input type='file' height={'50px'} padding='10px' name='image' onChange={handleFileChange} ref={fileRef} />
          <Button width={'500px'} mt='20px' type='submit'>
            Submit
          </Button>
        </form>
      </Flex>
    </Flex>
  );
};

export default CreateArticle;
