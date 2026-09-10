// const API_URL = "https://api.yourdomain.com/adpl/";
const API_URL = "https://api.yourdomain.com/adp/v4";
let data = new FormData();

export default async function LoginComplete(username, password) {
  data.set("username", username); //data.set() overwrites the data with the same key, unlike data.append() which causes error in our login process. Error may look like: I was getting a problem, after entering a wrong password or username once, even if u enter the right credentials it shows the same error...
  data.set("password", password);

  let requestOptions = {
    method: "POST",
    body: data,
    redirect: "follow",
  };
  // for (const value of data.values()) {
  // }
  const res = await fetch(API_URL + "login", requestOptions);

  const response = await res.json();

  return response;
}
