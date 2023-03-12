import {
  Button,
  Flex,
  FormLabel,
  Icon,
  Image,
  Input,
  Modal,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  Textarea,
} from '@chakra-ui/react';
import React, { useRef, useState } from 'react';
import { MdDeleteForever } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { createArticle } from '../../../api/articles';
import './style.css';

export const CreateArticle = ({ isOpen, onClose }) => {
  const [currentFile, setCurrentFile] = useState(null);
  const navigate = useNavigate();

  const onModalClose = () => {
    onClose();
    setCurrentFile(null);
  };

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

    onModalClose();

    return false;
  };

  return (
    <Modal isCentered={true} onClose={onModalClose} isOpen={isOpen}>
      <ModalOverlay />
      <ModalContent paddingX={10} paddingY={2}>
        <ModalHeader>
          <Flex>
            <Text variant={'title'}>Create Post:</Text>
          </Flex>
        </ModalHeader>
        <Flex flexDir='column' width={'100%'}>
          <form onSubmit={onSubmit} ref={formRef}>
            <FormLabel as='legend'>Title:</FormLabel>
            <Input type={'text'} name='title' formTarget='text' />
            <FormLabel as='legend' mt='10px'>
              Body:
            </FormLabel>
            <Textarea name='content' />
            <FormLabel as='legend' mt='10px'>
              Optional image:
            </FormLabel>
            {currentFile && (
              <Flex justifyContent={'center'}>
                <Flex flexDir='column' align='center' mb='10px' pos={'relative'} width={'fit-content'}>
                  <Image
                    height='200px'
                    borderRadius={5}
                    style={{ objectFit: 'scale-down' }}
                    src={URL.createObjectURL(currentFile)}
                  />
                  <Button
                    w={'min-content'}
                    minW={'min-content'}
                    h={'min-content'}
                    p={0}
                    m={0}
                    bgColor={'red'}
                    _hover={{}}
                    _active={{}}
                    position={'absolute'}
                    top={1}
                    right={1}
                    onClick={() => setCurrentFile(null)}
                  >
                    <Icon fontSize='26' as={MdDeleteForever} />
                  </Button>
                </Flex>
              </Flex>
            )}
            {/* {!currentFile && ( */}
            <label className='input-file'>
              <Input
                type='file'
                height={'50px'}
                padding='10px'
                name='image'
                onChange={handleFileChange}
                ref={fileRef}
              />
              <span>Choose file</span>
            </label>
            {/* // )} */}
            <ModalFooter paddingX={0}>
              <Button type='submit'>Submit</Button>
            </ModalFooter>
          </form>
        </Flex>
      </ModalContent>
    </Modal>
  );
};

export default CreateArticle;
