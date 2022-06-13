import React, { useEffect, useState, useRef } from 'react';
import TextField from '@material-ui/core/TextField';

export function InputField({ setInputValue, inputValue, getRootProps }) {
  const [rows, setRows] = useState('');
  const ref = useRef(null);

  useEffect(() => {
    let cleanedUp = false;
    const { innerHeight } = window;
    setRows(Math.round(innerHeight * 0.045));

    const resize = async () => {
      if (!cleanedUp) {
        window.addEventListener('resize', () => {
          const { innerHeight } = window;
          setRows(Math.round(innerHeight * 0.045));
        });
      }
    };
    resize();
    const cleanup = () => {
      cleanedUp = true;
    };
    return cleanup;
  }, []);

  const input = inputValue ? inputValue : '';

  return (
    <div {...getRootProps()}>
      <TextField
        ref={ref}
        id='outlined-basic'
        label='Supported Format: Final Draft (fdx), text file, and a spec script style text'
        placeholder='Input script or drop script file here'
        variant='outlined'
        multiline
        fullWidth
        rows={rows}
        onChange={(event) => {
          setInputValue(event.target.value);
        }}
        value={input}
      />
    </div>
  );
}
