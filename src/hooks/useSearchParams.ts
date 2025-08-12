import { useState } from "react";

const useSearchParam = (param: string) => {
  const [searchParams, setSearchParams] = useState(
    new URLSearchParams(window.location.search),
  );
  const [value, setValue] = useState(searchParams.get(param));

  const setParam = (value: string) => {
    searchParams.set(param, value);
    setSearchParams(new URLSearchParams(searchParams));
    setValue(value);
    window.history.replaceState({}, "", `?${searchParams.toString()}`);
  };

  return { setParam, value };
};

export default useSearchParam;
