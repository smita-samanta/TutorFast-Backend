
export default
(to: Object): Function =>
  (from: Object): Function =>
    (key: string): any =>
      to[key] = from[key]
;
