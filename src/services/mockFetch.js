import productsData from "../data/productsData";

export const mockFetchProducts = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const shouldFail = Math.random() < 0.5; // 50% chance of failure
      if (shouldFail) {
        reject("Failed to load products");
      } else {
        resolve(productsData);
      }
    }, 1000);
  });
};