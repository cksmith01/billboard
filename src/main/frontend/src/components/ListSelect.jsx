import React, { useState } from "react";
import { Dropdown } from "primereact/dropdown";
import {
  addBillByListName,
  trackingListWithDefault,
  getListNames,
  removeBill,
} from "./listUtil";

function ListSelect({ bill }) {
  const [selectedListName, setSelectedListName] = useState(
    trackingListWithDefault(bill.billNumber, "None")
  );
  const listNames = getListNames();
  const listOptions = new Array({ name: "None", code: "None" });
  for (let i = 0; i < listNames.length; i++) {
    listOptions[listOptions.length] = {
      name: listNames[i],
      code: listNames[i],
    };
  }

  const changeTrackingList = (e) => {
    if (e.target.value === "None") {
      removeBill(bill.billNumber);
    } else {
      addBillByListName(e.target.value, bill.billNumber);
    }
    setSelectedListName(e.target.value);
  };

  return (
    <div style={{ padding: "3px" }}>
      <div className="label" style={{ fontWeight: "bold", marginTop:'3px' }}>
        Tracking List
      </div>
      &nbsp;
      <Dropdown
        value={selectedListName}
        onChange={changeTrackingList}
        options={listOptions}
        optionLabel="name"
        optionValue="name"
      />
    </div>
  );
}

export default ListSelect;
