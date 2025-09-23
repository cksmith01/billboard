import React from "react";
import { formatPercent } from "../components/utils";

function StatusCard({
  cardTitle,
  statusCodeList,
  billList,
  actionCodes,
  showListCallback,
}) {
  let cardTotal = 0;

  const codeMap = new Map();
  const codeArray = statusCodeList.split(",");

  // loop through the actionCodes and find the ones that apply
  const usedCodes = actionCodes.filter((code) => {
    if (code.type === "action") {
      if (statusCodeList.indexOf(code.code + ",") > -1) {
        const billsForCode = billList.filter((bill) => {
          if (bill.lastActionCode == code.code) {
            return bill;
          }
        });
        if (billsForCode.length > 0) {
          codeMap.set(code.code, billsForCode);
          cardTotal += billsForCode.length;
        }
        return code;
      }
    }
  });

  let _list = "";
  codeArray.map((code) => {
    _list += "'" + code + "',";
  });

  const getLabel = (code) => {
    const labels = actionCodes.filter((item) => {
      if (item.type === "action" && item.code === code) {
        return item.description;
      }
    });
    if (labels[0] === undefined) {
      return "?";
    }
    return labels[0].description;
  };

  const getClass = (code) => {
    if ([...codeMap.get(code)].length > 0) {
      return "statusCardLink";
    }
    return "statusCardLink";
  };

  return (
    <>
      <div className="statusCardTitle" id={cardTitle}>
        {cardTitle}: {cardTotal} &nbsp;(
        {formatPercent(cardTotal / billList.length)})
      </div>
      <div>
        {[...codeMap.keys()].map((key, row) => (
          <div className={getClass(key)} onClick={showListCallback} key={key} id={key}>
            {getLabel(key)}: {[...codeMap.get(key)].length}
          </div>
        ))}
      </div>
    </>
  );
}

export default StatusCard;
