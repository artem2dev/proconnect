import { extendTheme } from '@chakra-ui/react';

export const theme = extendTheme({
  config: {
    initialColorMode: 'dark',
  },
  colors: {
    brand: {
      black: '#151f21',
      blue: '#4164e3',
      cadet: '#8998a8',
      dark: '#243156',
      gray: '#2D3748',
      green: '#36c537',
      light: '#e9ebee',
      pure: '#fafafb',
      slate: '#77889a',
      white: '#e3e4e7',
      yellow: '#ed9b13',
    },
  },
  components: {
    Button: {
      variants: {
        solid: {
          p: '6',
          color: 'white',
          bg: 'brand.blue',
          _hover: { bg: 'brand.blue' },
          _active: { bg: 'brand.blue' },
          _focus: { boxShadow: 'none' },
        },
        outline: {
          bg: 'transparent',
          borderWidth: '1px',
          color: 'brand.cadet',
          borderColor: 'brand.light',
          _hover: { bg: 'brand.white' },
          _active: { bg: 'brand.light' },
          _focus: { boxShadow: 'none' },
        },
        ghost: {
          color: 'white',
          bg: 'rgba(0, 0, 0, 0.25)',
          _hover: { bg: 'rgba(0, 0, 0, 0.25)' },
          _active: { bg: 'rgba(0, 0, 0, 0.35)' },
          _focus: { boxShadow: 'none' },
        },
        link: {
          p: '0',
          height: 'full',
          bg: 'transparent',
          color: 'gray.300',
          rounded: 'none',
          fontWeight: 400,
          textDecoration: 'none',
          _hover: { color: '#0d6efd', textDecoration: 'none' },
          _focus: { boxShadow: 'none' },
        },
        blue: {
          paddingRight: '5',
          paddingLeft: '5',
          height: '8',
          color: 'black',
          _focus: { boxShadow: 'none' },
          size: 'xs',
          bgColor: 'brand.white',
          width: 'full',
          rounded: 'lg',
          _hover: {
            bgColor: '#fcfdfeda',
          },
          _active: {
            bgColor: '#fcfdfeb2',
          },
          boxShadow: 'md',
        },
      },
      defaultProps: {
        variant: 'blue',
      },
    },
    Text: {
      variants: {
        default: {
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          textAlign: 'left',
        },
        title: {
          fontSize: '24px !important',
        },
      },
      defaultProps: {
        variant: 'default',
      },
    },
    Tabs: {
      baseStyle: {
        tab: {
          _focus: {
            boxShadow: 'none',
          },
        },
      },
    },
    Card: {
      variants: {
        default: {
          bgColor: 'RGBA(65, 100, 227, 0.9)',
        },
      },
      defaultProps: {
        variant: 'default',
      },
    },
  },
});
