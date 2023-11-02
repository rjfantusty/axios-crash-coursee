// https://axios-http.com/docs/req_config      watch this first
// import { axios } from 'axios';

// const {data} = await axios.post('https://httpbin.org/post', {
//     firstName: 'Fred',
//     lastName: 'Flintstone',
//     orders: [1, 2, 3],
//     photo: document.querySelector('#fileInput').files
//   }, {
//     headers: {
//       'Content-Type': 'multipart/form-data'
//     },
//     params: {
//       _limit: 12
//     }

//   }
// )
// KEEP IN MIND THIS SYNTAX OF AXIOS

// axios.post('url',{data},{config})

// BUT IN CASE OF GET REQUEST

// axios.post('url',{config})

// GET REQUEST
function getTodos() {
  console.log('GET Request');
  axios
    .get('https://jsonplaceholder.typicode.com/todos',{ params:{ _limit:10 }  })
    .then(res=>showOutput(res))
    .catch(err=>{console.log(err)})
}

// POST REQUEST
function addTodo() {
  console.log('POST Request');
  axios
  .post('https://jsonplaceholder.typicode.com/todos',{
    title: "Raj ka data",
    completed:false

  })
  .then(res=>showOutput(res))
  .catch(err=>console.error(err))

}

// PUT REQUEST
function updateTodo() {
  console.log('PUT Request');
  axios
  .put('https://jsonplaceholder.typicode.com/todos/200',{
      title:"put new data",
  
  })
  .then(res=>showOutput(res))
  .catch(err=>console.log(err))
}

// PATCH REQUEST

function patchTodo() {
  console.log('PATCH Request');
  axios
  .patch('https://jsonplaceholder.typicode.com/todos/200',{
    title:'patch data or update data',
  })
  .then(res=>showOutput(res))
  .catch(err=>console.log(err))
}


// DELETE REQUEST
function removeTodo() {
  console.log('DELETE Request');
  axios
  .delete('https://jsonplaceholder.typicode.com/todos/200')
  .then(res=>showOutput(res))
  .catch(err=>console.log(err))
}

// SIMULTANEOUS DATA
function getData() {
  console.log('Simultaneous Request');
// by using .all method we can make simultenous reqs. and in response we will get array of res
  axios
  .all([   
    axios.get('https://jsonplaceholder.typicode.com/todos?_limit=5'),
    axios.get('https://jsonplaceholder.typicode.com/posts?_limit=5')
  ])
  // .then(res=>{
  //   console.log(res[0]) instead of duing this res[0] and res[1]  we have spread method in axios
  //   console.log(res[1])
  //   showOutput(res[1])   
  // })
  .then(axios.spread((todos,posts)=>{
    showOutput(posts)
  }))
  .catch(err=>console.log(err))
}

// CUSTOM HEADERS
// for set custom header we pass the config object as a third parameter in a post req
function customHeaders() {
  console.log('Custom Headers');
  let config={
    headers:{
      'Content-Type':'application/json',
      Authorization:'sometoken note it always set by server res '
      // app.get('/', (req, res) => {
      //   res.cookie('token', '1234567890', {
      //     expires: new Date(Date.now() + 3600000),
      //     path: '/',
      //     domain: 'localhost'
      //   });
      //   res.send('Cookie set!');
      // });
    }
  }

//   When you set axios.defaults.headers.common["X-auth-token"] = 'sometoken', you are configuring Axios, a popular JavaScript library for making HTTP requests, to include a custom HTTP header named "X-auth-token" with the value 'sometoken' in every outgoing HTTP request made by Axios.

// Here's what each part of the code does:

// axios.defaults is an Axios object that stores default settings and configurations for all Axios requests.
// axios.defaults.headers is an object that stores default headers for all Axios requests. This object contains different header settings, such as common, get, post, and others, which allow you to set headers for specific HTTP request methods.
// axios.defaults.headers.common is a property within axios.defaults.headers where you can set headers that will be applied to all request methods (GET, POST, PUT, DELETE, etc.).
// ["X-auth-token"] is the header name you want to set. In this case, "X-auth-token" is a custom header name that you can define to carry some authentication or authorization token. It's not a standard HTTP header; it's just a name you've chosen for your application.
// 'sometoken' is the value you want to set for the "X-auth-token" header.

  axios
  .post('https://jsonplaceholder.typicode.com/todos',
  {title:'raj',
  completed:true},config)
  .then(res=>showOutput(res))
  .catch(err=>console.log(err))

}

// CREATE AXIOS INSTANCE 
const axiosInstance=axios.create({
  // other custom setting
  baseURL:"https://jsonplaceholder.typicode.com"
})

axios

// request through instance axios obj
function transformResponse() {
  console.log('Request throgh instance');
  axiosInstance.get('/comments?_limit=5')
  .then(res=>showOutput(res))
  .catch(err=>console.log(err))
}

// ERROR HANDLING
function errorHandling() {
  console.log('Error Handling');
  axios.get('https://jsonplaceholder.typicode.com/todods')
  .then(data=>console.log(data))
  .catch(err=>console.error(err.response)) // it will print the error resoponse object 
  // {config
  //   : 
  //   {url: 'https://jsonplaceholder.typicode.com/todods', method: 'get', headers: {…}, transformRequest: Array(1), transformResponse: Array(1), …}
  //   data: {}
  //   headers:  {cache-control: 'max-age=43200', content-length: '2', content-type: 'application/json; charset=utf-8', expires: '-1', pragma: 'no-cache'}
  //   request
  //   : 
  //   XMLHttpRequest {readyState: 4, timeout: 0, withCredentials: false, upload: XMLHttpRequestUpload, onreadystatechange: ƒ, …}
  //   status
  //   : 
  //   404
  //   statusText
  //   : 
  //   ""}

}

// CANCEL TOKEN
function cancelToken() {
  console.log('Cancel Token');
}

// INTERCEPTING REQUESTS & RESPONSES
// if want to do any thing in config  before sending request or before receiving response then we use interceptors
// Add a request interceptor

// axios.interceptors.request.use(function (config) {
//   // Do something before request is sent
//   return config;
// }, function (error) {
//   // Do something with request error
//   return Promise.reject(error);
// });

// // Add a response interceptor
// axios.interceptors.response.use(function (response) {
//   // Any status code that lie within the range of 2xx cause this function to trigger
//   // Do something with response data
//   return response;
// }, function (error) {
//   // Any status codes that falls outside the range of 2xx cause this function to trigger
//   // Do something with response error
//   return Promise.reject(error);
// });

axios.interceptors.request.use((config=>{
  const date = new Date();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();

  console.log(`${config.method.toUpperCase()} reqest is sent to ${config.url} at ${hours}:${minutes}:${seconds}`)
  return config
}),(err)=>{
  return Promise.reject(err);
})

// AXIOS INSTANCES

// Show output in browser
function showOutput(res) {
  document.getElementById('res').innerHTML = `
  <div class="card card-body mb-4">
    <h5>Status: ${res.status}</h5>
  </div>

  <div class="card mt-3">
    <div class="card-header">
      Headers
    </div>
    <div class="card-body">
      <pre>${JSON.stringify(res.headers, null, 2)}</pre>
    </div>
  </div>

  <div class="card mt-3">
    <div class="card-header">
      Data
    </div>
    <div class="card-body">
      <pre>${JSON.stringify(res.data, null, 2)}</pre>
    </div>
  </div>

  <div class="card mt-3">
    <div class="card-header">
      Config
    </div>
    <div class="card-body">
      <pre>${JSON.stringify(res.config, null, 2)}</pre>
    </div>
  </div>
`;
}

// Event listeners
document.getElementById('get').addEventListener('click', getTodos);
document.getElementById('post').addEventListener('click', addTodo);
document.getElementById('update').addEventListener('click', updateTodo);
document.getElementById('patch').addEventListener('click', patchTodo);
document.getElementById('delete').addEventListener('click', removeTodo);
document.getElementById('sim').addEventListener('click', getData);
document.getElementById('headers').addEventListener('click', customHeaders);
document
  .getElementById('transform')
  .addEventListener('click', transformResponse);
document.getElementById('error').addEventListener('click', errorHandling);
document.getElementById('cancel').addEventListener('click', cancelToken);
