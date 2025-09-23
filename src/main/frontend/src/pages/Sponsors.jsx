import { useState } from "react";
import Navigation from "../components/Navigation";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import BillDetails from "../components/BillDetails";
import { Dialog } from "primereact/dialog";
import Api from "../components/Api";
import { billLinkTemplate } from "../components/utils";

function Sponsors({ billList, loadDate, actionCodes, sessionDates }) {
  const [subList, setSubList] = useState([]);
  const [modal, showModal] = useState(false);
  const [selectedBill, setSelectedBill] = useState({});

  const sponsorMap = new Map();
  const _sponsorMap = new Map();
  billList.map((bill) => {
    // sponsor
    if (!_sponsorMap.has(bill.sponsorID)) {
      const legCount = {
        name: bill.primarySponsor,
        count: 1,
        floor: 0,
        chamber: bill.sponsorChamber,
        leadership: bill.leadershipPosition,
        sponsorId: bill.sponsorID,
      };
      _sponsorMap.set(bill.sponsorID, legCount);
    } else {
      let legCount = _sponsorMap.get(bill.sponsorID);
      legCount.count = legCount.count + 1;
    }
    // floor sponsor
    if (!_sponsorMap.has(bill.floorSponsorID)) {
      const legCount = {
        name: bill.floorSponsor,
        count: 0,
        floor: 1,
        chamber: bill.sponsorChamber == "Rep." ? "Sen." : "Rep.",
        leadership: bill.flLeadershipPosition,
        sponsorId: bill.floorSponsorID,
      };
      _sponsorMap.set(bill.floorSponsorID, legCount);
    } else {
      let legCount = _sponsorMap.get(bill.floorSponsorID);
      legCount.floor = legCount.floor + 1;
    }
  });
  for (let [key, value] of _sponsorMap) {
    if (key != null && key != '') {
      sponsorMap.set(key, value);
    }
  }

  const showList = (legObject) => {
    const billsForCode = billList.filter((bill) => {
      if (bill.sponsorID == legObject.sponsorId) {
        return bill;
      } else if (bill.floorSponsorID == legObject.sponsorId) {
        return bill;
      }
    });
    console.log('showList', 'setSubList', billsForCode);
    setSubList(billsForCode);
    buildSponsor(legObject);
  };

  const onRowClicked = (row) => {
    row.originalEvent.preventDefault();
    showList(row.data);
  };

  const onDetailRowClicked = (row) => {
    row.originalEvent.preventDefault();
    setSelectedBill(row.data);
    showModal(true);
  };

  const buildSponsor = (legObject) => {
    let sponsorPath = Api.HOUSE_URL + legObject.sponsorId;
    if (legObject.chamber == "Sen.") {
      sponsorPath = Api.SENATE_URL + legObject.sponsorId;
    }
    let div = "<a target='_blank' href=" + sponsorPath + ">";
    div += "<span className='pi pi-external-link'></span>";
    div += `${legObject.chamber} ${legObject.name}`;
    div += "</a>";
    div += "</div>";
    document.getElementById("sponsorName").innerHTML = window.decodeURI(div);
  };

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
        <BillDetails bill={selectedBill} hideTrackingToggle={false} />
      </Dialog>
    );
  };

  sponsorMap.delete("");

  const sponsorList = [...sponsorMap.values()];
  sponsorList.forEach((legCount) => {
    legCount.total = legCount.count + legCount.floor;
  });

  return (
    <>
      <Navigation loadDate={loadDate} sessionDates={sessionDates} />
      <div id="container">
        <div className="pageTitle">Sponsors: {sponsorMap.size}</div>
        <div
          style={{
            maxWidth: "35%",
            minWidth: "35%",
            height: "92vh",
            maxHeight: "92vh",
            padding: "5px",
            borderRight: "1px #ccc solid",
            float: "left",
            position: "relative",
            overflowY: "auto",
          }}
        >
          <DataTable
            id="dataTable"
            size="small"
            value={sponsorList}
            tableStyle={{ minWidth: "100%", cursor: "pointer" }}
            stripedRows
            style={{ width: "100%" }}
            dataKey="name"
            onRowClick={onRowClicked}
            emptyMessage="Select a status to show bills"
            sortField="total"
            sortOrder={-1}
            rowHover
          >
            <Column field="chamber" header="" sortable></Column>
            <Column field="name" header="Sponsor" sortable></Column>
            <Column field="leadership" header="Position" sortable></Column>
            <Column field="count" header="Bills" sortable></Column>
            <Column field="floor" header="Fl Sp" sortable></Column>
            <Column field="total" header="Total" sortable></Column>
          </DataTable>
        </div>
        <div
          style={{
            maxWidth: "64%",
            minWidth: "64%",
            minHeight: "98%",
            float: "left",
            padding: "5px",
            margin: "5px",
          }}
        >
          <div
            id="sponsorName"
            style={{
              fontSize: "1.25em",
              fontWeight: "bold",
              paddingBottom: "5px",
              color: "#666",
            }}
          ></div>
          <DataTable
            id="dataTable"
            size="small"
            value={subList}
            tableStyle={{ minWidth: "100%" }}
            stripedRows
            style={{ width: "100%" }}
            dataKey="billNumber"
            emptyMessage="Select a status to show bills"
            onRowDoubleClick={onDetailRowClicked}
            sortField="billNumber"
            sortOrder={-1}
          >
            <Column
              field="billNumber"
              header="#"
              body={billLinkTemplate}
              sortable
            ></Column>
            <Column field="shortTitle" header="Title"></Column>
            <Column field="primarySponsor" header="Sponsor" sortable></Column>
            <Column field="floorSponsor" header="Fl Sponsor" sortable></Column>
            <Column field="actionCodeDesc" header="Last Action" sortable></Column>
            <Column field="lastActionDate" header="Date" sortable></Column>
            <Column field="ownerDesc" header="Owner" sortable></Column>
          </DataTable>
          {showModal && <DetailModal />}
        </div>
      </div>
    </>
  );
}

export default Sponsors;
