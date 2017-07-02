
export default
(from: {}): Function =>
  (to: {} = {}, key: string): {} => {
    if (from[key] !== undefined) to[key] = from[key];

    return to;
  }
;
