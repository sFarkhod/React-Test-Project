import { RequestMethods } from "../interfaces/IRequestMethods";
import { MD5 } from "crypto-js"


interface AuthorizationHeaders {
  Key: string;
  Sign: string;
}

const generateAuthHeaders = (
  method: RequestMethods,
  url: string,
  body: any,
  userKey: string,
  userSecret: string
): AuthorizationHeaders => {


  
  let signString = `${method}${url}`;

  
  // Conditionally include bodyString if body is not null
  if (body !== null) {
    const bodyString = JSON.stringify(body);
    signString += bodyString + userSecret;
  } else{
    signString += userSecret;
  }

  console.log(signString);
  
  const sign = MD5(signString).toString();

  return {
    Key: userKey,
    Sign: sign,
  };
};

export default generateAuthHeaders;
