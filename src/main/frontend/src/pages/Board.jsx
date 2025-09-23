import React, { useState, useRef, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { InputText } from "primereact/inputtext";
import Navigation from "../components/Navigation";
import BillDetails from "../components/BillDetails";
import { Dialog } from "primereact/dialog";
import { CSVLink } from "react-csv";
import { getSessionDate } from "../components/getSessionDate";
import {
  sponsorTemplate,
  flSponsorTemplate,
  billLinkTemplate,
  fiscalTemplate,
  formatPercent,
} from "../components/utils";
import BulkAdd from "../components/BulkAdd";
import TimeLineMini from "../components/TimeLineMini";
// import { Toast } from 'primereact/toast';
        

function Board(props) {
  const year = getSessionDate();
  const [modal, showModal] = useState(false);
  const [addModal, showAddModal] = useState(false);

  const [selectedBill, setSelectedBill] = useState({});
  const [bulkAddList, setBulkAddList] = useState([]);
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [baseFilters, setBaseFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    billNumber: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
    },
    primarySponsor: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
    },
    floorSponsor: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
    },
    shortTitle: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
    },
    subjectList: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
    },
    sectionsAffected: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
    },
    actionCodeDesc: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
    },
    ownerDesc: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
    },
    lastActionDate: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
    },
  });
  const [filters, setFilters] = useState(baseFilters);
  let counts = { house: [], senate: [], resolution: [] };

  const dataTableExport = useRef(null);

  function buildCounts(bills) {
    let _counts = { house: [], senate: [], resolution: [] };

    bills.map((bill) => {
      if (bill.billNumber.startsWith("HB")) {
        _counts.house[_counts.house.length] = bill.billNumber;
      } else if (bill.billNumber.startsWith("SB")) {
        _counts.senate[_counts.senate.length] = bill.billNumber;
      } else {
        _counts.resolution[_counts.resolution.length] = bill.billNumber;
      }
      counts = _counts;
    });
  }

  const exportCSV = (selectionOnly) => {
    dataTableExport.current.exportCSV({ selectionOnly });
  };

  const onRowClicked = (row) => {
    row.originalEvent.preventDefault();
    setSelectedBill(row.data);
    showModal(true);
  };

  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    let _filters = { ...filters };
    _filters["global"].value = value;
    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  // const showToast = () => {
  //   // toast.current.show({sticky: true, severity: 'info', summary: 'No Records', detail: 'Currently there are no records to display.  '});
  //   alert("Currently there are no records to display.  If this is the first time the application has run, it will take up to 25 min for it to populate the data.");
  // }

  // useEffect(()=>{
  //   setTimeout(()=>{
  //     if (effectRan.current = true && props.billList.length === 0) {
  //         console.log('no bill data found');
  //         showToast();
  //     }
  //   }, 2000);
  //   effectRan.current = true;
  // }, []);

  const buildAction = (cell, row) => {
    return (
      <>
        {
          <span
            title={`${cell.lastActionDate} ${cell.actionDesc} (${cell.actionCode})`}
          >
            {cell.actionCodeDesc}
          </span>
        }
      </>
    );
  };

  function showCount(event) {
    console.log(
      "showCount",
      "list: " + event.target.id,
      counts[event.target.id]
    );
  }

  const clearFilter = (e) => {
    setFilters(baseFilters);
    setGlobalFilterValue("");
  };

  buildCounts(props.billList);

  const selectUnselected = () => {
    const unselected = document.getElementsByClassName("untracked");
    const idList = new Array();
    for (let i = 0; i < unselected.length; i++) {
      const element = unselected[i];
      idList.push(element.id);
    }
    if (idList.length > 250) {
      alert("Bulk add is limited to 50 bills at a time");
    } else {
      setBulkAddList(idList);
      showAddModal(true);
    }
  };

  const closeBulkAdd = () => {
    setBulkAddList([]);
    showAddModal(false);
  };

  const renderTimeline = (bill) => {
    return <TimeLineMini bill={bill} />;
  };

  const renderHeader = () => {
    return (
      <div className="" style={{ backgroundColor: "#fff", margin: "5px" }}>
        <span className="p-input-icon-left">
          <i className="pi pi-search pi2" />
          <InputText
            value={globalFilterValue}
            onChange={onGlobalFilterChange}
            placeholder="Global Search"
            id="searchField"
            size={50}
          />
        </span>
        <span style={{ paddingLeft: "50px" }}>
          <Button
            type="button"
            icon="pi pi-download pi2"
            rounded
            onClick={() => exportCSV()}
            data-pr-tooltip="CSV"
          >
            &nbsp; Export Data
          </Button>{" "}
          &nbsp;
          <Button
            type="button"
            icon="pi pi-check pi2"
            rounded
            onClick={selectUnselected}
          >
            &nbsp; Select
          </Button>
        </span>
      </div>
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
        <BillDetails bill={selectedBill} />
      </Dialog>
    );
  };

  const BulkAddModal = () => {
    return (
      <Dialog
        header="Add To Tracking List..."
        position="top-right"
        visible={addModal}
        onHide={() => showAddModal(false)}
        style={{ width: "45vw" }}
      >
        <BulkAdd
          billNumArray={bulkAddList}
          billList={props.billList}
          callBack={closeBulkAdd}
        />
      </Dialog>
    );
  };

  return (
    <>
      <Navigation loadDate={props.loadDate} sessionDates={props.sessionDates} />
      <div id="container">
        <div>
          <div className="pageTitle" style={{ width: "250px", float: "left" }}>
            All Bills: {props.billList.length}
          </div>
          &nbsp; &nbsp; &nbsp; &nbsp;
          <div className="subTitle" style={{ width: "60%", float: "left" }}>
            <span className="mutedLink" onClick={showCount} id="house">
              House: {counts.house.length}
              &nbsp;(
              {formatPercent(counts.house.length / props.billList.length)})
            </span>{" "}
            &nbsp; &nbsp;
            <span className="mutedLink" onClick={showCount} id="senate">
              Senate: {counts.senate.length}
              &nbsp;(
              {formatPercent(counts.senate.length / props.billList.length)})
            </span>{" "}
            &nbsp; &nbsp;
            <span className="mutedLink" onClick={showCount} id="resolution">
              Resolutions: {counts.resolution.length}
              &nbsp;(
              {formatPercent(counts.resolution.length / props.billList.length)})
            </span>
          </div>
        </div>
        <DataTable
          size="small"
          stripedRows={true}
          value={props.billList}
          tableStyle={{ minWidth: "100%" }}
          paginator
          rows={15}
          totalRecords={props.billList.length}
          rowsPerPageOptions={[10, 15, 25, 50, 100, 500, 1000]}
          paginatorTemplate="FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink RowsPerPageDropdown"
          currentPageReportTemplate="{first} to {last} of {totalRecords}"
          style={{ width: "100%" }}
          dataKey="billNumber"
          filters={filters}
          header={renderHeader}
          ref={dataTableExport}
          onRowDoubleClick={onRowClicked}
          globalFilterFields={[
            "billNumber",
            "shortTitle",
            "primarySponsor",
            "floorSponsor",
            "subjectList",
            "sectionsAffected",
            "actionCodeDesc",
            "newlyOwnedBy",
            "ownerDesc",
          ]}
          emptyMessage="If this is the first time the application has run, it will take up to 25min to aggregate the data for display."
          exportFilename={"BillList"}
          sortField="lastActionDate"
          sortOrder={-1}
        >
          {/* <Column field="sessionID" header="Session" sortable></Column> */}
          <Column
            field="billNumber"
            header="#"
            body={billLinkTemplate}
            sortable
            filter
            filterField="billNumber"
            filterPlaceholder="Bill #"
          ></Column>
          <Column
            field="shortTitle"
            header="Title"
            filter
            filterField="shortTitle"
            filterPlaceholder="Search by Title"
          ></Column>
          <Column
            field="primarySponsor"
            header="Sponsor"
            body={sponsorTemplate}
            sortable
            filter
            filterField="primarySponsor"
            filterPlaceholder="Sponsor"
            style={{ whiteSpace: "nowrap" }}
          ></Column>
          <Column
            field="floorSponsor"
            header="Fl. Sponsor"
            body={flSponsorTemplate}
            sortable
            filter
            filterField="floorSponsor"
            filterPlaceholder="Floor Sponsor"
            style={{ whiteSpace: "nowrap" }}
          ></Column>
          <Column
            field="fiscalTotal"
            header="Total $"
            sortable
            body={fiscalTemplate}
            style={{ whiteSpace: "nowrap" }}
          ></Column>
          <Column
            field="actionCodeDesc"
            header="Last Action"
            body={buildAction}
            sortable
            filter
            filterField="actionCodeDesc"
            filterPlaceholder="Last Action"
          ></Column>
          <Column
            field="lastActionDate"
            header="Date"
            sortable
            filter
            filterField="lastActionDate"
            filterPlaceholder="Last Action Date"
            style={{ maxWidth: "110px" }}
          ></Column>
          <Column
            field="ownerDesc"
            header="Owner"
            filter
            filterField="ownerDesc"
            filterPlaceholder="Owner"
            sortable
          ></Column>
          <Column
            field="subjectList"
            header="Subjets"
            filter
            filterField="subjectList"
            filterPlaceholder="Subject"
          ></Column>
          {/* <Column header="Timeline" body={renderTimeline}></Column> */}
        </DataTable>
      </div>
      {showModal && <DetailModal />}
      {showAddModal && <BulkAddModal />}
      <div
        style={{ width: "500px", float: "left", padding: "0", margin: "0" }}
        className="techNote"
      >
        <ol>
          <li>
            Double click a row to see more information, or add the bill to your
            tracking list
          </li>
          <li>
            Default sort order is last action date ... so you can see what has
            changed most recently
          </li>
          <li>
            Global search, searches the following fields...
            <br />
            Bill #, title, sponsor, floor sponsor, action, subjects, code
            sections, and owner
          </li>
        </ol>
      </div>
      <div style={{ textAlign: "right", padding: "10px" }}>
        <button type="button">
          <CSVLink data={props.billList} filename={"BillData" + year}>
            <i className="pi pi-download pi2"></i>
            &nbsp; Download Dataset
          </CSVLink>
        </button>
      </div>
    </>
  );
}

export default Board;
