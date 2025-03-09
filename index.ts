import { parseArray, parseObject, pushValueToMap, getSubArrayByToken } from "./helpers";
import { ITokenType, TokenType } from "./src/types";

const dummyValue = [
  {
    classs: "13",
    name: "John",
    classes:[{id:'french'},{id:'english'}],
    age: 30,
    isStudent: true,
    isTeacher: false,
    isNull: null,
    subjects: ["Maths", "Science"],
  },
  {
    classs: "14",
    name: "John-bhai",
    classes:[{id:'science'},{id:'arts'}],
    age: 56,
    isStudent: true,
    isTeacher: false,
    isNull: null,
    subjects: ["Maths", "Science"],
  },
  1,
  2,
  'a'
];
const dummyValue2 = {
  classs: "13",
  name: "John",
  classes:[{id:'french'},{id:'english'}],
  age: 30,
  isStudent: true,
  isTeacher: false,
  isNull: null,
  subjects: ["Maths", "Science"],
};

const TokenMap = new Map<string | RegExp, TokenType>();
TokenMap.set("{", "BraceOpen");
TokenMap.set("}", "BraceClose");
TokenMap.set("[", "BracketOpen");
TokenMap.set("]", "BracketClose");
TokenMap.set(":", "Colon");
TokenMap.set(",", "Comma");
TokenMap.set("true", "True");
TokenMap.set("false", "False");
TokenMap.set(/^[0-9]$/gm, "Number");
TokenMap.set(/^[a-zA-Z]$/gm, "String");
TokenMap.set("null", "Null");

class MyJSONParser {
  static parse(json: Record<string, any>) {
    const jsonStr = MyJSONParser.stringify(json);
    const tokenArr = MyJSONParser.createTokenMap(jsonStr);
    return MyJSONParser.parseTokenArr(tokenArr);
  }
  static stringify(json: Record<string, any>) {
    // handle for ERROR cases
    return JSON.stringify(json);
  }
  static createTokenMap(jsonStr: string) {
    const tokenArr: ITokenType[] = [];
    let curr = 0;
    while (curr < jsonStr.length) {
      if (TokenMap.has(jsonStr[curr])) {
        var value = TokenMap.get(jsonStr[curr])!;
        tokenArr.push({ token: value, data: jsonStr[curr] });
        curr++;
      } else {
        curr = pushValueToMap(jsonStr, curr, tokenArr);
      }
    }
    return tokenArr;
  }
  static parseTokenArr(tokenArr: ITokenType[]) {
    let tokenIndx = 0;
    let currToken = tokenArr[tokenIndx].token;
    let JSONobj: Record<string, any> | Array<any> = currToken === 'BraceOpen' ? {} : [];
    while (tokenIndx !== tokenArr.length - 1) {
      if(tokenIndx >= tokenArr.length){
        break;  
      }
      const currToken = tokenArr[tokenIndx].token;
      if(currToken === 'BraceOpen'){
        const subArr = getSubArrayByToken(
          currToken,
          tokenIndx,
          tokenArr
        );
         const parsedObj = parseObject(subArr);
         if(Array.isArray(JSONobj)){
          JSONobj = JSONobj.concat(parsedObj);
        }else{
          JSONobj = {...JSONobj,...parsedObj};
        }
        tokenIndx = tokenIndx + subArr.length;
        continue;
      }else if(currToken === 'BracketOpen'){
        const subArr = getSubArrayByToken(
          currToken,
          tokenIndx,
          tokenArr
        );

        const parsedArr = parseArray(subArr);
        if(Array.isArray(JSONobj)){
          JSONobj = JSONobj.concat(parsedArr);
        }else{
          JSONobj = {...JSONobj,...parsedArr};
        }
        tokenIndx = tokenIndx + subArr.length;
        continue;
      }
      tokenIndx++;
    }

    return JSONobj;
  }
}

console.dir(MyJSONParser.parse(dummyValue),{depth: null});
console.dir(MyJSONParser.parse(dummyValue2),{depth: null});