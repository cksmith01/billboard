/*
  THIS COMPONENT IS NO LONGER BEING USED !!!  SEE "MyLists"
*/

import { useState, useEffect } from "react";
import Navigation from "../components/Navigation";
import { DataTable } from "primereact/datatable";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
// import { FilterMatchMode, FilterOperator } from "primereact/api";
import {
  billLinkTemplate,
  sponsorTemplate,
  flSponsorTemplate,
  fiscalTemplate,
  ownerTemplate
} from "../components/utils";
import { Dialog } from "primereact/dialog";
import BillDetails from "../components/BillDetails";
import {
  addRemoveBill,
  getBillArray,
  billExists,
  getBillList,
} from "../components/billList";

// import { retrofitBillList } from "../components/listUtil";

function MyList({ billList, actionCodes, loadDate, sessionDates }) {
  const [modal, showModal] = useState(false);
  const [selectedBill, setSelectedBill] = useState({});
  const [subList, setSubList] = useState([]);
  // retrofitBillList();

  const onRowClicked = (row) => {
    row.originalEvent.preventDefault();
    setSelectedBill(row.data);
    showModal(true);
  };

  const loadBillList = () => {
    setSubList(getBillArray(billList));
  };

  const addBill = (params) => {
    let billNum = prompt("Enter a bill # (Ex: HB0001)");
    let billsToAdd = [];
    if (billNum != null && billNum != "") {
      billNum = billNum.toUpperCase();
      if (billExists(billNum, billList)) {
        const newList = addRemoveBill(billNum, true);
        setSubList(getBillArray(billList));
      } else {
        alert("No bill found with #: " + billNum);
      }
    }
  };

  const removeBill = (event) => {
    event.preventDefault();
    const billNum = event.target.id;
    if (billNum === null || billNum === "") {
      alert("we dont have a bill number");
    } else {
      const newList = addRemoveBill(billNum, false);
      setSubList(getBillArray(billList));
    }
  };

  const loadList = (list) => {
    if (list.length > 0) {
      setSubList(getBillArray(billList));
    }
  };

  const buildRemoveButton = (cell, row) => {
    return (
      <>
        <Button
          id={cell.billNumber}
          onClick={removeBill}
          title="Delete"
          style={{ transform: "scale(.8)" }}
        >
          X
        </Button>
      </>
    );
  };

  useEffect(() => {
    loadBillList();
    // eslint-disable-next-line
  }, []);

  const DetailModal = () => {
    return (
      <Dialog
        header={`${selectedBill.billNumber} - ${selectedBill.primarySponsor}`}
        position="top-right"
        visible={modal}
        onHide={() => showModal(false)}
        style={{ width: "45vw" }}
        breakpoints={{ "960px": "75vw", "641px": "100vw" }}
      >
        <BillDetails bill={selectedBill} hideTrackingToggle={true} />
      </Dialog>
    );
  };

  return (
    <>
      <Navigation loadDate={loadDate} sessionDates={sessionDates} />
      <div id="container">
        <div className="pageTitle">
          <div style={{ float: "left", width: "49%" }}>My List</div>
          <div style={{ float: "right", width: "49%", textAlign: "center" }}>
            <Button
              onClick={addBill}
              title="Add Bill"
              style={{ transform: "scale(.9)" }}
              icon="pi pi-list pi2"
            >
              &nbsp; Add Bill
            </Button>
          </div>
        </div>

        <DataTable
          id="dataTable"
          size="small"
          value={subList}
          tableStyle={{ minWidth: "100%" }}
          paginator
          rows={50}
          stripedRows
          totalRecords={subList.length}
          rowsPerPageOptions={[25, 50, 100, 500, 1000]}
          paginatorTemplate="FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink RowsPerPageDropdown"
          currentPageReportTemplate="{first} to {last} of {totalRecords}"
          style={{ width: "100%" }}
          dataKey="billNumber"
          onRowDoubleClick={onRowClicked}
          emptyMessage="..."
          sortField="lastActionDate"
          sortOrder={-1}
        >
          <Column field="" header="" body={buildRemoveButton}></Column>
          <Column field="sessionID" header="Session" sortable></Column>
          <Column
            field="billNumber"
            header="#"
            body={billLinkTemplate}
            sortable
            filterPlaceholder="Bill #"
          ></Column>
          <Column
            field="shortTitle"
            header="Title"
            // filter
            filterField="shortTitle"
            filterPlaceholder="Search by Title"
          ></Column>
          <Column
            field="primarySponsor"
            header="Sponsor"
            body={sponsorTemplate}
            sortable
            filterField="primarySponsor"
            style={{ whiteSpace: "nowrap" }}
          ></Column>
          <Column
            field="floorSponsor"
            header="Fl. Sponsor"
            body={flSponsorTemplate}
            sortable
            filterField="floorSponsor"
            style={{ whiteSpace: "nowrap" }}
          ></Column>
          <Column
            field="fiscalTotal"
            header="Total $"
            sortable
            body={fiscalTemplate}
          ></Column>
          <Column
            field="actionCodeDesc"
            header="Last Action"
            sortable
            filterField="actionCodeDesc"
          ></Column>
          <Column
            field="lastActionDate"
            header="Action Date"
            filterField="lastActionDate"
            sortable
          ></Column>
          <Column
            field="ownerDesc"
            header="Owner"
            body={ownerTemplate}
            filterField="owner"
            sortable
          ></Column>
          <Column
            field="subjectList"
            header="Subjects"
            filter
            filterField="subjectList"
          ></Column>
          <Column
            field="sectionsAffected"
            header="Code Sections"
            filter
            filterField="sectionsAffected"
          ></Column>
        </DataTable>
      </div>

      {showModal && <DetailModal />}
    </>
  );
}

export default MyList;
