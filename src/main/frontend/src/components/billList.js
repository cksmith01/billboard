/** 
 * this is depreicated and should be removed after some time
*/

import Cookies from "js-cookie";
import LocalStorage from "./LocalStorage";

export const addRemoveBill = (billNumber, add) => {
  let list = LocalStorage.create().get("billboard-bill-list");
  if (list == null) {
    list = Cookies.get("billboard-bill-list");
  }

  if (list == null) {
    list = "";
  }
  if (!list.endsWith(",")) {
    list = list + ",";
  }

  if (add) {
    if (list.indexOf(billNumber) === -1) {
      list += billNumber + ",";
    }
  } else {
    if (list.indexOf(billNumber + ",") > -1) {
      const p1 = list.indexOf(billNumber);
      const f = list.substring(0, p1);
      const b = list.substring(p1 + 7);
      list = f + b;
    }
  }

  list = list.toUpperCase();
  LocalStorage.create().store("billboard-bill-list", list);
  Cookies.set("billboard-bill-list", list, { expires: 90 });
  return list;
};

export const isTracked = (billNumber) => {
  let list = LocalStorage.create().get("billboard-bill-list");
  if (list == null) {
    list = Cookies.get("billboard-bill-list");
  }
  if (list == null) {
    list = "";
  }
  return list.indexOf(billNumber) > -1;
};

export const getBillList = () => {
  let list = LocalStorage.create().get("billboard-bill-list");
  if (list == null) {
    list = Cookies.get("billboard-bill-list");
  }
  return list;
};

export const getBillArray = (billList) => {
  let list = LocalStorage.create().get("billboard-bill-list");
  if (list == null) {
    list = Cookies.get("billboard-bill-list");
  }
  let subSet = [];
  if (list.length > 0) {
    subSet = billList.filter((bill) => {
      if (list.indexOf(bill.billNumber) > -1) {
        return bill;
      }
    });
    return subSet;
  }
  return [];
};

export const billExists = (billNum, billList) => {
  let r = false;
  billList.map((bill) => {
    if (billNum === bill.billNumber) {
      r = true;
    }
  });
  return r;
};
