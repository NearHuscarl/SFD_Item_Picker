const fse = require("fs-extra");

/**
 * @typedef {Object} DataNode
 * @property {string} property
 * @property {string} value
 * @property {string} childrenData
 * @property {DataNode[]} children
 */

/**
 * @param {string} filePath
 * @return {Promise<DataNode[]>}
 */
async function parseSFDX(filePath) {
  const data = await fse.readFile(filePath, "utf8");
  const trimmedData = removeComment(data).replace(/(\n|\r\n|\t|\s)/g, "");

  return processData(trimmedData);
}

/**
 * @param {string} data
 * @return {DataNode[]}
 */
function processData(data) {
  /** @type {DataNode[]} */
  const dataNodes = [];
  let property = "";
  let str1 = "";

  try {
    const anyOf1 = /(\(|=)/;
    const str2 = data;
    let str3 = "";
    let anyOf2 = new RegExp("");

    for (
      let index1 = indexOfRegex(str2, anyOf1);
      index1 !== -1;
      index1 = indexOfRegex(str3, anyOf2)
    ) {
      property = data.substr(0, index1);
      data = data.substr(index1, data.length - index1);

      if (data[0] === "=") {
        const num = data.indexOf(";");
        if (num === -1) {
          throw new Error(
            `Parse Error: Expected ';' at end of value for property '${property}'`
          );
        }
        str1 = data.substr(1, num - 1);
        data = data.substr(num + 1, data.length - num - 1);
        dataNodes.push(handleChildNode(property, str1, ""));
      } else {
        const num1 = data.indexOf(")");
        if (num1 === -1) {
          throw new Error(
            `Parse Error: Expected ')' at end of value for property '${property}'`
          );
        }
        str1 = data.substr(1, num1 - 1);
        data = data.substr(num1 + 1, data.length - num1 - 1);
        if (data[0] !== "{") {
          throw new Error(
            `Parse Error: Expected start of data '{' after value for property '${property}'`
          );
        }
        let num2 = -1;
        let num3 = 1;
        for (let index2 = 1; index2 < data.length; index2++) {
          if (data[index2] === "{") {
            num3++;
          } else if (data[index2] === "}") {
            num3--;
            if (num3 === 0) {
              num2 = index2;
              break;
            }
          }
        }
        if (num2 === -1) {
          throw new Error(
            `Parse Error: Expected '}' not found for property '${property}'`
          );
        }
        const childNodes = data.substr(1, num2 - 1);
        data = data.substr(num2 + 1, data.length - num2 - 1);
        dataNodes.push(handleChildNode(property, str1, childNodes));
      }
      str3 = data;
      anyOf2 = /(\(|=)/;
    }
  } catch (e) {
    throw new Error(
      `Parse Error: Error at property '${property}' with value '${str1}'\\r\\n${e}`
    );
  }
  return dataNodes;
}

/**
 * @param {string} property
 * @param {string} value
 * @param {string} childNodes
 * @return {DataNode}
 */
function handleChildNode(property, value, childNodes) {
  const anyOf = /(\s|{|}|=|;)/;
  const num1 = indexOfRegex(property, anyOf);
  if (num1 !== -1) {
    throw new Error(
      `Parse Error: Property '${property}' contains invalid chars at index ${num1}`
    );
  }
  const num2 = indexOfRegex(value, anyOf);
  if (num2 !== -1) {
    throw new Error(
      `Parse Error: Value ${value} for Property '${property}' contains invalid chars at index ${num2}`
    );
  }
  /** @type {DataNode} */
  const dataNode = { property, value };
  if (childNodes === "") {
    return dataNode;
  }
  dataNode.children = processData(childNodes);
  return dataNode;
}

/**
 * @param {string} data
 * @return {string}
 */
function removeComment(data) {
  return data.replace(/\/\/.*/, "");
}

/**
 * @param {string} text
 * @param {RegExp} re
 * @param {number} startPos
 * @return {number}
 */
function indexOfRegex(text, re, startPos = 0) {
  const indexInSuffix = text.slice(startPos).search(re);
  return indexInSuffix < 0 ? indexInSuffix : indexInSuffix + startPos;
}

module.exports = {
  parseSFDX,
};
