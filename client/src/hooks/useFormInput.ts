import React, {useEffect, useState} from "react";

const useFormInput = ([value, setValue]: [string, React.Dispatch<any>], pattern?: RegExp) => {
  const [valid, setValid] = useState(false);

  useEffect(() => {
    if (pattern) {
      setValid(pattern.test(value))
    }
  },[value]);

  const reset = () => {
    setValue('');
  }

  const formAttributeObj = {
    value,
    onChange: (e: React.FormEvent<HTMLInputElement>) => setValue(e.currentTarget.value)
  }

  return pattern ? {value, formAttributeObj, reset, valid} : {value, formAttributeObj, reset};
} 

export default useFormInput;