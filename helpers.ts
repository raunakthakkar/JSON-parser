import { ITokenType } from "./src/types";

const TokenMapping = {
  "BraceOpen": "BraceClose",
  "BracketOpen": "BracketClose",
}
export const pushValueToMap = (str: string, currIndx: number = 0, map: any) => {
  let obj: ITokenType = {
    token: "String",
    data: "",
  };
  let curr = currIndx;
  let char = str[curr];
  let value = "";

  if (char == '"') {
    curr++; //consuming de-limiter
    char = str[curr];
    while (char !== '"') {
      value = value + char;
      curr++;
      char = str[curr];
    }
    if (char == '"') {
      curr++;
      char = str[curr];
    }
    obj.token = "String";
    obj.data = value;
    map.push({ token: obj.token, data: obj.data });
  } else if (/[0-9]/.test(char)) {
    // if its a number or a word character
    value = "";
    while (/[0-9]/.test(char)) {
      value += char;
      curr++;
      char = str[curr];
    }
    obj.token = "Number";
    obj.data = value;
    map.push({ token: obj.token, data: obj.data });
  } else if (str.substring(currIndx, currIndx + 4) == "true") {
    obj.token = "True";
    obj.data = "true";
    curr = curr + 4;
    map.push({ token: obj.token, data: obj.data });
  } else if (str.substring(currIndx, currIndx + 5) == "false") {
    obj.token = "False";
    obj.data = "false";
    curr = curr + 5;
    map.push({ token: obj.token, data: obj.data });
  } else if (str.substring(currIndx, currIndx + 4) == "null") {
    obj.token = "Null";
    obj.data = "null";
    curr = curr + 4;
    map.push({ token: obj.token, data: obj.data });
  } else if (char == '['){
    obj.token = 'BracketOpen';
    obj.data = '[';
    map.push({ token: obj.token, data: obj.data });
    if(str[curr + 1] !== ']'){
      curr = pushValueToMap(str.substring(curr),currIndx,map);
    }else{ 
      obj.token = 'BracketClose';
      obj.data = ']';
      map.push({ token: obj.token, data: obj.data });
    }
  }
  return curr;
};

export const parseObject = (arr:ITokenType[]) => {

  return {}
} 
export const parseArray = (arr:ITokenType[]) =>{
  return []
}

export function getSubArrayByToken(token: string, startIndex: number, tokenArr: ITokenType[]): ITokenType[] {
  let balance = 0;
  let subArray: ITokenType[] = [];

  for (let i = startIndex; i < tokenArr.length; i++) {
    const currentToken = tokenArr[i].token;
    subArray.push(tokenArr[i]);

    if (currentToken === token) {
      balance++;
    } else if (currentToken === TokenMapping[(token as keyof typeof TokenMapping)]) {
      balance--;
    }

    if (balance === 0) {
      break;
    }
  }

  return subArray;
}