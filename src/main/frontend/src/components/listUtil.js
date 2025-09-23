import LocalStorage from "../components/LocalStorage";
import Cookies from "js-cookie";

/**
 * @returns returns a Map object of all bills being tracked
 *
 * key = list name
 * values = an array of bill numbers
 */
export const getBillMap = () => {
  return LocalStorage.create().getBillMap();
};

/**
 * Removes the bill number for any list that its included in
 * and the updates local storage
 * @param {*} billNumber
 */
export const removeBill = (billNumber) => {
  const billMap = LocalStorage.create().getBillMap();
  const _billMap = new Map();
  for (const [key, value] of billMap.entries()) {
    const _values = [];
    for (var i = 0; i < value.length; i++) {
      if (billNumber !== value[i].toUpperCase()) {
        _values[_values.length] = value[i];
      }
    }
    _billMap.set(key, _values);
  }
  LocalStorage.create().storeBillMap(_billMap);
};

/**
 * retrieves the bill map from storage, updates the list and
 * the updates the bill map in local storage
 * @param {*} listName the name of the list it should be added to
 * @param {*} billNumber
 */
export const addBillByListName = (listName, billNumber) => {
  if (billNumber == null || billNumber == "") {
    return;
  }
  if (listName == null || listName == "") {
    return;
  }
  billNumber = billNumber.toUpperCase();
  removeBill(billNumber);
  const billMap = LocalStorage.create().getBillMap();
  const values = billMap.get(listName);

  for (let i = 0; i < values.length; i++) {
    if (values[i] === billNumber) {
      return;
    }
  }
  values[values.length] = billNumber;
  billMap.set(listName, values);
  LocalStorage.create().storeBillMap(billMap);
};

/**
 * retrieves the bill map from storage, updates the list and
 * the updates the bill map in local storage
 * @param {*} index the index of the list it should be added to
 * @param {*} billNumber
 */
export const addBillByListIndex = (index, billNumber) => {
  const listNames = getListNames();
  return addBillByListName(listNames[index], billNumber);
};

/**
 * @param {*} billNumber string
 * @returns an Array of lists that the bill # is found in
 */
export const trackingList = (billNumber) => {
  const hitList = [];
  if (billNumber == null || billNumber === undefined) {
    return hitList;
  }
  const billMap = LocalStorage.create().getBillMap();
  for (const [key, value] of billMap.entries()) {
    for (var i = 0; i < value.length; i++) {
      if (billNumber === value[i]) {
        hitList[hitList.length] = key;
        break;
      }
    }
  }
  return hitList;
};

/**
 * @param {*} billNumber
 * @returns boolean indicating if the bill is on one or more lists
 */
export const isBillTracked = (billNumber) => {
  return trackingList(billNumber).length > 0;
};

/**
 * @returns returns an array of tracking list names
 */
export const getListNames = () => {
  const billMap = LocalStorage.create().getBillMap();
  return Array.from(billMap.keys());
};

/**
 * @param {*} listName the name of the list in the underlying bill map
 * @param {*} fullList the full list of bills
 * @returns returns a list of bill objects based on the list name
 */
export const getBillListByName = (listName, fullList) => {
  const billMap = LocalStorage.create().getBillMap();
  const billNumArray = billMap.get(listName);
  if (billNumArray == undefined || billNumArray == null) return [];
  const list = new Array();
  for (var i = 0; i < billNumArray.length; i++) {
    for (var j = 0; j < fullList.length; j++) {
      if (fullList[j].billNumber === billNumArray[i].toUpperCase()) {
        list.push(fullList[j]);
        break;
      }
    }
  }
  return list;
};

/**
 * @param {*} index the pointer to the underlying bill map
 * @param {*} fullList the full list of bills
 * @returns returns a list of bill objects based on the index
 */
export const getBillListByIndex = (index, fullList) => {
  const billMap = LocalStorage.create().getBillMap();
  const listName = [...billMap.keys()][index];
  return getBillListByName(listName, fullList);
};

export const removeBillListByIndex = (index) => {
  const billMap = LocalStorage.create().getBillMap();
  const listName = [...billMap.keys()][index];
  billMap.delete(listName);
  LocalStorage.create().storeBillMap(billMap);
};

export const changeListName = (index, newName) => {
  const billMap = LocalStorage.create().getBillMap();
  const listName = [...billMap.keys()][index];
  const listValues = billMap.get(listName);
  billMap.delete(listName);
  billMap.set(capitalize(newName), listValues);
  LocalStorage.create().storeBillMap(billMap);
};

/**
 * this function fetches the bill list from a cookie (billboard-bill-list)
 * and creates a map object (key = "My List") and converts the list from a
 * comma seperated string to an array, a stores new map object in local storage
 */
export const retrofitBillList = () => {
  const billMap = LocalStorage.create().getBillMap();
  if (billMap != null) {
    return;
  }
  const listStr = Cookies.get("billboard-bill-list");
  if (listStr != null && listStr.length > 0 && listStr.indexOf(",") > -1) {
    const _values = listStr.split(",");
    const values = [];
    for (let i = 0; i < _values.length; i++) {
      const item = _values[i];
      if (item !== null && item !== "" && item.length === 6) {
        values.push(item.toUpperCase());
      }
    }
    _billMap.set("My List", values);
  } else {
    _billMap.set("My List", []);
  }
  LocalStorage.create().storeBillMap(_billMap);
  Cookies.remove("billboard-bill-list");
};

/**
 * function checks to see if the name already exists, if not, it will create
 * an empty array and add it to the map, then update the bill map in local storage
 * @param {*} listName
 */
export const addListName = (listName) => {
  const billMap = LocalStorage.create().getBillMap();
  [...billMap.keys()].forEach((item) => {
    if (item === listName) {
      return;
    }
  });
  billMap.set(capitalize(listName), []);
  LocalStorage.create().storeBillMap(billMap);
};

export const billNumberExistsInList = (billNumber, billList) => {
  const billMap = LocalStorage.create().getBillMap();
};

export const capitalize = (str) => {
  if (str == null) {
    str = "";
  }
  return str.replace(/(^\w{1})|(\s+\w{1})/g, (letter) => letter.toUpperCase());
};

export const trackingListWithDefault = (billNumber, defaultValue) => {
  let tList = trackingList(billNumber);
  if (tList.length === 0) {
    tList[0] = defaultValue;
  }
  return tList[0];
};


