import { useState, useEffect } from "react";
import Navigation from "../components/Navigation";
import { DataTable } from "primereact/datatable";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import {
  billLinkTemplate,
  ownerTemplate,
  moneyAbbr,
} from "../components/utils";
import { Dialog } from "primereact/dialog";
import BillDetails from "../components/BillDetails";
import { TabView, TabPanel } from "primereact/tabview";
import {
  removeBill,
  getBillListByIndex,
  getBillMap,
  addListName,
  addBillByListIndex,
  removeBillListByIndex,
  changeListName,
} from "../components/listUtil";
import TimeLineMini from "../components/TimeLineMini";

function MyLists({ billList, actionCodes, loadDate, sessionDates }) {

  const [activeIndex, setActiveIndex] = useState(-1);
  const [subList, setSubList] = useState([]);
  const [modal, showModal] = useState(false);
  const [selectedBill, setSelectedBill] = useState({});

  const billMap = getBillMap();

  const showList = (e) => {
    setActiveIndex(e.index);
    setSubList(getBillListByIndex(e.index, billList));
  };

  const onRowClicked = (row) => {
    row.originalEvent.preventDefault();
    setSelectedBill(row.data);
    showModal(true);
  };

  const buildRemoveButton = (cell, row) => {
    return (
      <>
        <Button
          id={cell.billNumber}
          onClick={deleteBill}
          title="Delete"
          style={{ transform: "scale(.7)" }}
        >
          X
        </Button>
      </>
    );
  };

  const deleteBill = (event) => {
    event.preventDefault();
    const billNum = event.target.id;
    if (billNum === null || billNum === "") {
      alert("we dont have a bill number");
    } else {
      removeBill(billNum);
      setSubList(getBillListByIndex(activeIndex, billList));
    }
  };

  const addNewList = (event) => {
    event.preventDefault();
    const newListName = prompt(
      "Enter the name of the new list you'd like to create."
    );
    if (newListName === null || newListName === "") {
    } else if (newListName === "None" || newListName === "none") {
      alert("None can not be used as a list name");
    } else {
      addListName(newListName);
      setActiveIndex(activeIndex + 1);
    }
  };

  const addNewBill = (event) => {
    event.preventDefault();
    if (activeIndex == -1) {
      alert("You must select a list first.");
      return;
    }
    const billNumber = prompt("Enter the bill number you'd like to add.");
    if (billNumber === null || billNumber === "") {
      //console.log("addNewBill: we dont have a bill #");
    } else {
      addBillByListIndex(activeIndex, billNumber);
      setSubList(getBillListByIndex(activeIndex, billList));
      this.billMap = getBillMap();
    }
  };

  const deleteBillList = (event) => {
    event.preventDefault();
    if (activeIndex == -1) {
      alert("You must select a list first.");
      return;
    }
    const doDelete = confirm(
      "Are you sure? This will remove the entire list permanently."
    );
    if (doDelete) {
      removeBillListByIndex(activeIndex);
      setActiveIndex(-1);
      setSubList([]);
    }
  };

  const changeBillListName = (event) => {
    event.preventDefault();
    if (activeIndex == -1) {
      alert("You must select a list first.");
      return;
    }
    const newListName = prompt("Enter a new name for this list...");
    if (newListName != null && newListName != "") {
      changeListName(activeIndex, newListName);
      setActiveIndex(-1);
      setSubList([]);
    }
  };

  useEffect(() => {
    showList({ index: 0 });
    // eslint-disable-next-line
  }, []);

  const createHeader = (key) => {
    let c = 0;
    if (billMap.get(key) != null) {
      c = billMap.get(key).length;
    }
    return key + " (" + c + ")";
  };

  const renderTimeline = (bill) => {
    return <TimeLineMini bill={bill} />;
  };

  const titleAndSponsor = (bill) => {
    let amount = moneyAbbr(bill);
    let clsNm = "revenue";
    if (amount.indexOf("(") === 0) {
      clsNm = "cost";
    }
    if (amount === "0") {
      clsNm = "zero";
    }
    return (
      <>
        <b>{bill.shortTitle}</b>
        <br />
        <i>{bill.primarySponsor}</i>
        &nbsp; &nbsp; &nbsp; <span className={clsNm}>{amount}</span>
      </>
    );
  };

  const DetailModal = () => {
    return (
      <Dialog
        header={`${selectedBill.billNumber} ${selectedBill.shortTitle} - ${selectedBill.primarySponsor}`}
        position="top-right"
        visible={modal}
        onHide={() => showModal(false)}
        style={{ width: "45vw" }}
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
          <div style={{ width: "10%", float: "left" }}>My Lists</div>
          <div className="warning" style={{ width: "600px", float: "left"}}>
            Warning: This feature stores your data in the browsers local storage.
            Which means clearing your browser cache will delete this information.
            </div>
          <div
            style={{
              width: "30%",
              float: "right",
              textAlign: "right",
              paddingRight: "100px",
            }}
          >
            <Button
              onClick={addNewList}
              title="Add New List"
              type="button"
              icon="pi pi-list pi2"
              id="newListButton"
            >
              &nbsp; New List
            </Button>
          </div>
        </div>
        <TabView activeIndex={activeIndex} onTabChange={showList}>
          {[...billMap.keys()].map((key) => (
            <TabPanel key={key} header={createHeader(key)}></TabPanel>
          ))}
        </TabView>
        <div style={{ marginTop: "-32px" }}>
          <DataTable
            id="dataTable"
            size="small"
            value={subList}
            tableStyle={{ minWidth: "100%" }}
            stripedRows
            totalRecords={subList.length}
            style={{ width: "100%" }}
            dataKey="billNumber"
            onRowDoubleClick={onRowClicked}
            emptyMessage="..."
            sortField="lastActionDate"
            sortOrder={-1}
          >
            <Column field="" header="" body={buildRemoveButton}></Column>
            <Column
              field="billNumber"
              header="#"
              body={billLinkTemplate}
              sortable
              filterPlaceholder="Bill #"
            ></Column>
            <Column
              header="Title / Sponsor / Fiscal Total"
              body={titleAndSponsor}
            ></Column>
            <Column
              header="Timeline"
              body={renderTimeline}
              style={{ minWidth: "220px", paddingTop: "5px" }}
            ></Column>
            <Column
              field="actionCodeDesc"
              header="Last Action"
              sortable
              filterField="actionCodeDesc"
              style={{ paddingLeft: "5px" }}
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
          </DataTable>
          {showModal && <DetailModal />}
          <div style={{ width: "49%", float: "left", padding: "5px" }}>
            <Button
              onClick={addNewBill}
              title="Add Bill To List"
              style={{ scale: "1", fontSize: "1em" }}
              icon="pi pi-plus pi2"
              type="button"
            >
              &nbsp; Add Bill
            </Button>
          </div>
          <div
            style={{
              width: "49%",
              float: "right",
              textAlign: "right",
              padding: "5px",
            }}
          >
            <Button
              onClick={changeBillListName}
              title="Change List Name"
              style={{ scale: "1", fontSize: "1em" }}
              icon="pi pi-pencil pi2"
              type="button"
            >
              &nbsp; Change Name
            </Button>{" "}
            <Button
              onClick={deleteBillList}
              title="Remove Bill List"
              style={{ scale: "1", fontSize: "1em" }}
              icon="pi pi-trash pi2"
              type="button"
            >
              &nbsp; Delete List
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

export default MyLists;
