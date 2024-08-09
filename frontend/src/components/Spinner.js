import { Spinner as Loader } from 'react-bootstrap';
import React from 'react';

const spinnerStyle = {
  position: 'absolute',
  top: 'calc(50% - 1rem)',
  left: 'calc(50% - 1rem)'
};

const Spinner = () => (
  <Loader
    style={spinnerStyle}
    animation="border"
    role="status"
    variant="primary"
  />

  // <Loader style={spinnerStyle} animation="border" />
);

export default Spinner;
