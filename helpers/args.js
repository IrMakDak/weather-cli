const getArgs = (args) => {
  const res = {};

  const [executer, file, ...rest] = args;

  rest.forEach((arg, index, array) => {
    if (arg.charAt(0) === "-") {
      if (index == array.length - 1) {
        res[arg.substring(1)] = true;
      } else if (array[index + 1].charAt(0) !== "-") {
        res[arg.substring(1)] = array[index + 1];
      } else {
        res[arg.substring(1)] = true;
      }
    }
  });
  return res;
};

export { getArgs };
