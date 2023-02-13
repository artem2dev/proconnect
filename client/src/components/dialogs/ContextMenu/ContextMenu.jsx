import { Box, Text } from '@chakra-ui/react';
import React, { useEffect, useRef, useState } from 'react';

export default function ContextMenu({
  children: child,
  options = [{ label: 'Label', cb: () => alert('callback!!') }],
  withHeightOffset = false,
}) {
  const [contextVisible, setContextVisible] = useState(false);
  const [contextOffset, setContextOffset] = useState({ x: 0, y: 0, height: 0 });

  const childRef = useRef(null);
  const contextRef = useRef(null);

  const childComponent = React.cloneElement(child, {
    ref: childRef,
  });

  useEffect(() => {
    const domEl = childRef.current;
    if (childRef.current) {
      domEl.addEventListener('click', handleChildClick);
      window.addEventListener('scroll', handleViewPortChange);
      window.addEventListener('resize', handleViewPortChange);
    }

    return () => {
      if (domEl) {
        domEl.removeEventListener('click', handleChildClick);
      }
      window.removeEventListener('scroll', handleViewPortChange);
      window.removeEventListener('resize', handleViewPortChange);
    };
  }, []);

  function handleViewPortChange() {
    const { top, left, height } = childRef.current?.getBoundingClientRect();
    setContextOffset({ top, left, height });
  }

  function handleChildClick() {
    const { top, left, height } = childRef.current?.getBoundingClientRect();

    setContextOffset({ top, left, height });
    setContextVisible(true);
  }

  return (
    <>
      {contextVisible && (
        <Box position={'fixed'} left='0' top='0' w='100%' h='100%' zIndex='3' onClick={() => setContextVisible(false)}>
          <Box
            position={'fixed'}
            top={`${withHeightOffset ? contextOffset.top + contextOffset.height : contextOffset.top}px !important`}
            left={`${contextOffset.left}px !important`}
            backgroundColor='#131821'
            padding={5}
            transform='translate(-30%, 0px)'
            borderRadius={'10px'}
            maxW={300}
            zIndex='4'
            ref={contextRef}
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            {options.map((option) => {
              return (
                <Text
                  align='center'
                  onClick={option.cb}
                  key={option.label}
                  sx={{ cursor: 'pointer' }}
                  _hover={{ backgroundColor: 'gray', color: 'black' }}
                >
                  {option.label}
                </Text>
              );
            })}
          </Box>
        </Box>
      )}
      {childComponent}
    </>
  );
}
