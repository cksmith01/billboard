import React, { useState } from "react";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { getListNames, addBillByListName } from "./listUtil";

function BulkSelect({ billNumArray, callBack }) {
  console.log('BulkSelect', callBack);
  const [selectedListName, setSelectedListName] = useState("None");
  const listNames = getListNames();
  const listOptions = new Array({ name: "None", code: "None" });
  for (let i = 0; i < listNames.length; i++) {
    listOptions[listOptions.length] = {
      name: listNames[i],
      code: listNames[i],
    };
  }

  const changeTrackingList = (e) => {
    setSelectedListName(e.target.value);
  };

  const addAllBills = (e) => {
    e.preventDefault();
    if (selectedListName === "None") {
      alert("You must select a valid list");
      return;
    }
    for (let i = 0; i < billNumArray.length; i++) {
      addBillByListName(selectedListName, billNumArray[i]);
    }
    callBack();
  };

  return (
    <div style={{ padding: "3px" }}>
      <div className="label" style={{ fontWeight: "bold", marginTop: "3px" }}>
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
      &nbsp;
      <Button
        onClick={addAllBills}
        title="Add Bills To List"
        style={{ scale: ".9", fontSize: "1em" }}
        icon="pi pi-plus pi2"
        type="button"
      >
        &nbsp; Add Bills
      </Button>
    </div>
  );
}

export default BulkSelect;
