import clsx, { type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// Makes sure classNames are appropriately merged
// and any conflicts are resolved, making the component
// styling more consistent and maintainable.
const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

export default cn;
