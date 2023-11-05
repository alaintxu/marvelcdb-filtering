import axios from "axios";

export default axios.create({
  baseURL: "https://es.marvelcdb.com/api/public/",
  //baseURL: 'https://api.rawg.io/api',
  /*params: {
    key: 'c7b18323a47d40c394ea5b01966b1f5'
  }*/
})