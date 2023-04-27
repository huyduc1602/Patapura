import { useRef, useEffect } from 'react';

const usePrevious = function <T>(value: T) {
  const ref = useRef<T>();
  
  useEffect(() => {
    ref.current = value;
  });
  
  return ref.current;
};

export default usePrevious;
