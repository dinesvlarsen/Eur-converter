# Eur converter
A simple Eur converter, which gets conversion data from [fawazahmed0/currency-api](https://github.com/fawazahmed0/currency-api). 
It also uses [ipinfo](https://ipinfo.io/) to get your location.
We also use the [restcountries](https://restcountries.com/) api to look up what your countries currency is, which we default to on load(assuming we got your location, if not it will default to Norwegian krones).


## How to run on your local machine
- Navigate to **BlogThing/app** and run **npm install**
- To start localhost navigate to **BlogThing/app** and run **npm run dev**
- The key to the ipinfo is in a Netlify env variable, so to get it to work on your local machine you have to replace the key used in app/src/Converter.vue.
```js
async getUserCity() {

const ipinfo_key = import.meta.env.YOUR_KEY_HERE); //<-- YOUR KEY HERE

const response = await fetch(

`https://ipinfo.io/json?token=${ipinfo_key}`

);

const { city } = await response.json();

return city;

},
```


**Made with:**
> 
> [Vue.js](https://vuejs.org/), [restcountries](https://restcountries.com/), [ipinfo](https://ipinfo.io/), [fawazahmed0/currency-api](https://github.com/fawazahmed0/currency-api)
>
