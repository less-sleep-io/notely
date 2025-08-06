import { useState } from "react";

const useSearchParam = (param: string) => {
  const [searchParams, setSearchParams] = useState(
    new URLSearchParams(window.location.search),
  );
  const [value, setValue] = useState(searchParams.get(param));

  const setParam = (key: string, value: string) => {
    searchParams.set(key, value);
    setSearchParams(new URLSearchParams(searchParams));
    setValue(value);
    window.history.replaceState({}, "", `?${searchParams.toString()}`);
  };

  return { setParam, value };
};

export default useSearchParam;
