import React from "react";
import { Button } from "primereact/button";
import Api from "../components/Api";
import ListSelect from "./ListSelect";
import TimeLine from "./TimeLine";

function BillDetails({ bill }) {
  // console.log("BillDetails: bill", bill);

  const formatCurrency = (value) => {
    if (value == null || value == "") {
      value = 0;
    }
    return value.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
      minimumFractionDigits: 0,
    });
  };

  const showJson = () => {
    window.open(bill.json + Api.USER_JSON_KEY, "_blank");
  };

  const showBill = () => {
    window.open(bill.link, "_blank");
  };

  return (
    <div style={{ width: "100%", paddingLeft: "20px", fontSize: "90%" }}>
      <ListSelect bill={bill} />
      <TimeLine bill={bill} />
      <div className="flex justify-between p5 clearfix">
        <span className="fw-b">Description</span>: {bill.longTitle}
      </div>
      <div className="flex justify-between p5">
        <span className="fw-b">Provisions</span>: {bill.provisions}
      </div>
      <div className="flex justify-between p5">
        <span className="fw-b">Special Clauses</span>: {bill.clauses}
      </div>
      <div className="flex justify-between p5">
        <span className="fw-b">Monies</span>: {bill.monies}
      </div>
      <div className="flex justify-between p5">
        &nbsp; &nbsp; &nbsp; &nbsp;
        <span className="fw-b">One Time</span>: {formatCurrency(bill.onetime)}
        &nbsp; &nbsp; &nbsp; &nbsp;
        <span className="fw-b">Ongoing</span>: {formatCurrency(bill.ongoing)}
        &nbsp; &nbsp; &nbsp; &nbsp;
        <span className="fw-b">Total</span>: {formatCurrency(bill.fiscalTotal)}
      </div>
      <div className="flex justify-between p5">
        <span className="fw-b">Effective Date</span>: {bill.effectiveDate}
        {/* &nbsp; &nbsp; &nbsp;
        <span className="fw-b">Impact</span>: {bill.impact} */}
      </div>
      <div className="flex justify-between p5">
        <span className="fw-b">Sections Affected</span>: {bill.sectionsAffected}
      </div>
      <div className="flex justify-between p5">
        <span className="fw-b">Subjects</span>: {bill.subjectList}
      </div>
      <div className="flex justify-between p5">
        <span className="fw-b">Last Action</span>: {bill.actionCodeDesc}
        <br />
        &nbsp; &nbsp; <span className="fw-b">Location</span>: {bill.actionDesc}
        <br />
        &nbsp; &nbsp; <span className="fw-b">Date</span>: {bill.lastActionDate}
      </div>
      <div className="flex justify-between p5">
        <span className="fw-b">Owner</span>: {bill.ownerDesc} ({bill.owner})
      </div>
      <div className="flex justify-between p5">
        <span className="fw-b">Real Bill #</span>: {bill.realBillNumber}
      </div>
      <div className="flex justify-between p5">
        <span className="fw-b">Attorney</span>: {bill.attorney}
      </div>
      <div className="flex justify-between p5">
        <span className="fw-b">LRGC Analyst</span>: {bill.lrgcAnalyst}
        &nbsp; &nbsp; &nbsp;
        <span className="fw-b">Fiscal Analyst</span>: {bill.lfaAnalyst}
      </div>
      <div className="flex justify-between p5">
        <Button
          onClick={showJson}
          title="JSON"
          style={{ transform: "scale(.7)" }}
          icon="pi pi-code"
        ></Button>
        &nbsp;
        <Button
          onClick={showBill}
          title="Go To Bill"
          style={{ transform: "scale(.7)" }}
          icon="pi pi-external-link"
        ></Button>
      </div>
    </div>
  );
}

export default BillDetails;
