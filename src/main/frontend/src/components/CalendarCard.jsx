import React from "react";
import { billLinkTemplate, formatPercent } from "./utils";

function CalendarCard({ cardTitle, ownerCodes, billList }) {
  const codeMap = new Map();
  let codeArray = [ownerCodes];

  const cardId = cardTitle.replaceAll(" ", "_");

  if (ownerCodes.indexOf(",") > -1) {
    codeArray = ownerCodes.split(",");
  }

  // loop through the owner code to find matches
  const fullList = new Array();
  for (let index = 0; index < ownerCodes.length; index++) {
    const ownerCode = codeArray[index];
    const billsForCode = billList.filter((bill) => {
      if (bill.owner == ownerCode) {
        return bill;
      }
    });

    if (billsForCode != null && billsForCode.length > 0) {
      fullList.push(...billsForCode);
    }
  }

  const getClass = (bill) => {
    let clsName = ""
    if (bill.actionCode === "HCIRCLED" || bill.actionCode === "SCIRCLED") {
      clsName = "billCircled";
    }
    if (bill.fiscalBill === "Y") {
      clsName += " fiscalBill";
    }
    if (bill.fiscalImpact === "Y") {
      clsName += " fiscalImpact";
    }
    return clsName;
  };

  return (
    <>
      <div key={cardId} className="statusCardTitle">
        {cardTitle} ({fullList.length})
      </div>
      <div style={{ padding: "5px", textIndent: "5px" }}>
        {fullList.map((bill) => (
          <div
            key={bill.billNumber}
            className={getClass(bill)}
            style={{ padding: "2px", fontSize: "95%", margin: "2px" }}
          >
            {billLinkTemplate(bill)} {bill.shortTitle}
          </div>
        ))}
      </div>
    </>
  );
}

export default CalendarCard;
