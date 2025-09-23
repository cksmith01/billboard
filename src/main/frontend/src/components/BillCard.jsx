import React from "react";

function BillCard({ billList, targetCode, cardTitle }) {
  const subset = billList.filter((bill) => {
    return bill.actionCode === targetCode;
  });

  return (
    <div className="card">
      <div className="cardTitle">{cardTitle} ({subset.length})</div>
        {subset.map((bill, i) => {
            return (
                <div
                  className="cardBill"
                  title={`${bill.primarySponsor}: ${bill.shortTitle}`}
                >
                  {bill.billNumber}
                </div>
            );
        })}
    </div>
  );
}

export default BillCard;
