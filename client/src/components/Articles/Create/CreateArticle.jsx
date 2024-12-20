import { Button, Flex, Modal, ModalContent, ModalFooter, ModalOverlay, Text, Textarea } from '@chakra-ui/react';
import React, { useRef, useState } from 'react';
import { createArticle } from '../../../api/articles';
import './style.css';

export const CreateArticle = ({ isOpen, onClose }) => {
  const [currentFile, setCurrentFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  const onModalClose = () => {
    onClose();
    setCurrentFile(null);
    setImagePreview(null);
  };

  const handleFileDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);

    const file = e.dataTransfer?.files?.[0];
    if (file) {
      setCurrentFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setCurrentFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleFileRemove = (e) => {
    e.stopPropagation();
    setCurrentFile(null);
    setImagePreview(null);

    fileInputRef.current.value = null;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData();

    const content = e.target.elements.content.value;
    fd.append('title', '');
    fd.append('content', content);

    if (currentFile) {
      fd.append('image', currentFile);
    }

    try {
      const response = await createArticle(fd);
      console.log('Article created successfully:', response.data);
    } catch (err) {
      console.error('Error creating article:', err);
    }

    onModalClose();
  };

  return (
    <Modal isCentered={true} onClose={onModalClose} isOpen={isOpen} size='4xl'>
      <ModalOverlay />
      <ModalContent paddingX={10} paddingY={4} backgroundColor={'gray.900'}>
        <Flex flexDir='column' width={'100%'}>
          <form onSubmit={onSubmit}>
            <Textarea
              name='content'
              placeholder='Write something...'
              height='150px'
              my={5}
              required
              borderColor={'gray.600'}
              style={{
                textAlign: 'left',
                paddingTop: '5px',
                paddingLeft: '10px',
                resize: 'none',
                overflowY: 'auto',
              }}
              _hover={{
                borderColor: 'gray.400',
              }}
              _focus={{
                borderColor: 'white',
                boxShadow: 'none',
              }}
            />
            <Flex
              justifyContent='center'
              alignItems='center'
              border='1px dashed'
              borderColor={dragOver ? 'gray.300' : 'gray.600'}
              borderRadius='md'
              height='330px'
              backgroundColor={dragOver ? 'gray.800' : 'transparent'}
              onDrop={!currentFile ? handleFileDrop : null}
              onDragOver={!currentFile ? handleDragOver : null}
              onDragLeave={!currentFile ? handleDragLeave : null}
              onClick={!currentFile ? () => fileInputRef.current.click() : null}
              cursor={!currentFile && 'pointer'}
              _hover={
                !currentFile
                  ? {
                      backgroundColor: 'gray.800',
                      borderColor: 'gray.300',
                    }
                  : null
              }
            >
              {imagePreview ? (
                <Flex flexDir='column' align='center'>
                  <img
                    src={imagePreview}
                    alt='Selected Preview'
                    style={{
                      width: '100%',
                      height: 'auto',
                      maxHeight: '250px',
                      objectFit: 'contain',
                    }}
                  />
                  <Button
                    mt={4}
                    onClick={handleFileRemove}
                    width='120px'
                    _hover={{ backgroundColor: 'rgba(255,255,255,0.7)' }}
                  >
                    Remove File
                  </Button>
                </Flex>
              ) : (
                <Text color='gray.500' userSelect='none'>
                  Drag and drop your image here, or click to select a file.
                </Text>
              )}
            </Flex>
            <input ref={fileInputRef} type='file' style={{ display: 'none' }} onChange={handleFileSelect} />
            <ModalFooter paddingX={0} mt={4}>
              <Button type='submit' width='250px' margin={'auto'} _hover={{ backgroundColor: 'rgba(255,255,255,0.7)' }}>
                Add Post
              </Button>
            </ModalFooter>
          </form>
        </Flex>
      </ModalContent>
    </Modal>
  );
};

export default CreateArticle;
