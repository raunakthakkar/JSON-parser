import { parseArray, parseObject, pushValueToMap, getSubArrayByToken } from "./helpers";
import { ITokenType, TokenType } from "./src/types";

const dummyValue = {
  key: "value",
  "key-n": 101,
  "key-o": {
    nested:{
      age: 20,
    },
  },
  // "key-l": [],
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
    let JSONobj: Record<string, any> = {};
    let tokenIndx = 0;
    let currToken = tokenArr[tokenIndx].token;
    while (tokenIndx !== tokenArr.length - 1) {
      currToken = tokenArr[tokenIndx].token;
      if (currToken == "Colon") {
        const objKey = tokenArr[tokenIndx - 1].data;
        const objValue = tokenArr[tokenIndx + 1];
        try {
          switch (objValue.token) {
            case "BraceOpen": {
              const subArr = getSubArrayByToken(
                objValue.token,
                ++tokenIndx,
                tokenArr
              );
              console.log(subArr);
              JSONobj[objKey] = parseObject(subArr);
              tokenIndx = tokenIndx + subArr.length;
              continue;
            }
            case "BraceOpen": {
              const subArr = getSubArrayByToken(
                objValue.token,
                tokenIndx,
                tokenArr
              );
              JSONobj[objKey] = parseArray(subArr);
              tokenIndx = tokenIndx + subArr.length;
              continue;
            }
            default: {
              JSONobj[objKey] = objValue.data;
            }
          }
        } catch (e) {
          console.error(e);
        }
      }
      tokenIndx++;
    }

    return JSONobj;
  }
}

console.log(MyJSONParser.parse(dummyValue));
