import userData from './userData.json';

const service = ()=>
new Promise((res,rej)=>{
    setTimeout(()=>{
        res(userData);
    },5000);
})

export default service;