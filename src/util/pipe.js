export default
(fn: func): func =>
  (arg: object): object => {
    fn(arg);
    return arg;
  }
;
