import userData from "../data/userData.json";

const service = () =>
  new Promise((res,rej) => {
    setTimeout(() => {
      res(userData);
    }, 500);
  });

export default service;
