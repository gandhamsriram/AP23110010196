/**
 * Debounce utility
 * Delays invoking `fn` until `delay` ms have elapsed since the last call.
 *
 * @param {Function} fn - The function to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} - Debounced function with a .cancel() method
 */
export const debounce = (fn, delay = 300) => {
  let timerId;

  const debounced = (...args) => {
    clearTimeout(timerId);
    timerId = setTimeout(() => fn(...args), delay);
  };

  debounced.cancel = () => clearTimeout(timerId);

  return debounced;
};
