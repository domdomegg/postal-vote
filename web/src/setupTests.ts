import '@testing-library/jest-dom';

// react-router v7 pulls in TextEncoder/TextDecoder at import time, which the
// jsdom environment bundled with react-scripts does not define. Node has had
// both as globals since v11; this only bridges them into jsdom.
import { TextDecoder, TextEncoder } from 'util';

if (typeof global.TextEncoder === 'undefined') {
  global.TextEncoder = TextEncoder;
  global.TextDecoder = TextDecoder as typeof global.TextDecoder;
}
