import { useState, useRef, useEffect } from "react";
import Navigation from "../components/Navigation";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import Api from "../components/Api";
import { getSessionDate } from "../components/getSessionDate";
import "primeicons/primeicons.css";
import {billLinkTemplate} from "../components/utils"
import BillDetails from "../components/BillDetails";
import { Dialog } from "primereact/dialog";

function Committees({ billList, actionCodes, loadDate, sessionDates }) {
  const [subList, setSubList] = useState([]);
  const [modal, showModal] = useState(false);
  const [selectedBill, setSelectedBill] = useState({});
  const [committees, setCommittees] = useState([]);
  const [loading, setLoading] = useState(false);
  const year = getSessionDate();

  const loadData = async () => {
    // setLoading(true);
    const api = Api.get();
    await api
      .doGet("/api/v1/bill/committee/list/" + year)
      .then((response) => response.json())
      .then((data) => {
        setCommittees(data);
      })
      .catch((err) => {
        console.error(err);
      });
      // setLoading(false);
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line
  }, []);

  const committeeMap = new Map();
  // loop through the committees and find the ones that have bills
  const committeesWithBills = committees.filter((committee) => {
    const billsForCommittee = billList.filter((bill) => {
      if (bill.owner == committee.ownerID) {
        return bill;
      }
    });
    committeeMap.set(committee.ownerID, billsForCommittee);
    return committee;
  });

  const showList = (event) => {
    setSubList(committeeMap.get(event.target.id));
  };

  const onDetailRowClicked = (row) => {
    row.originalEvent.preventDefault();
    setSelectedBill(row.data);
    showModal(true);
  };

  const dataTableExport = useRef(null);

  const onRowClicked = (row) => {
    row.originalEvent.preventDefault();
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

  const buildCommitteeLink = (commId) => {
    return (
      <>
        {
          <a
            href={
              "https://le.utah.gov/committee/committee.jsp?year=" +
              year +
              "&com=" +
              commId
            }
            target="_blank"
          >
            {/* &raquo; */}
            <span
              className="pi pi-external-link pi2"
              style={{ fontSize: "80%" }}
            ></span>
          </a>
        }
      </>
    );
  };

  const getLabel = (code) => {
    const labels = committees.filter((item) => {
      if (item.ownerID === code) {
        return item.description;
      }
    });
    return labels[0].description;
  };

  const getClass = (code) => {
    // if ([...committeeMap.get(code)].length > 0) {
    //   return "linkDiv2";
    // }
    return "linkDiv";
  };

  const showWebCommittees = () => {
    window.open("https://le.utah.gov/asp/interim/Main.asp", "_blank");
  };

  return (
    <>
      <Navigation loadDate={loadDate} sessionDates={sessionDates} />
      <div id="container">
        <div className="pageTitle">
          <Button
            onClick={showWebCommittees}
            title="Website Committees"
            style={{ transform: "scale(.7)" }}
            icon="pi pi-external-link pi2"
          ></Button>
          Standing Committees
        </div>
        <div
          style={{
            maxWidth: "30%",
            minWidth: "30%",
            height: "92vh",
            maxHeight: "92vh",
            padding: "5px",
            borderRight: "1px #ccc solid",
            float: "left",
            position: "relative",
            overflowY: "auto",
          }}
        >
          {[...committeeMap.keys()].map((key, row) => (
            <div style={{ padding: "5px" }} key={key+row}>
              {buildCommitteeLink(key)} &nbsp;
              <span className={getClass(key)} onClick={showList} id={key}>
                {getLabel(key)}: {[...committeeMap.get(key)].length}
              </span>{" "}
            </div>
          ))}
          {committeeMap.size == 0 && (
            <h4 style={{ textIndent: "10px" }}>
              There are no bills in committee
            </h4>
          )}
          <div className="techNote">
            Note: clicking on the bullet will take you to the committee page for
            the year
          </div>
        </div>
        <div
          style={{
            maxWidth: "69%",
            minWidth: "69%",
            minHeight: "98%",
            float: "left",
            padding: "5px",
            margin: "5px",
          }}
        >
          <DataTable
            size="small"
            value={subList}
            tableStyle={{ minWidth: "100%" }}
            paginator
            rows={25}
            stripedRows
            loading={loading}
            totalRecords={subList.length}
            rowsPerPageOptions={[25, 50, 100, 500, 1000]}
            paginatorTemplate="FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink RowsPerPageDropdown"
            currentPageReportTemplate="{first} to {last} of {totalRecords}"
            style={{ width: "100%" }}
            dataKey="billNumber"
            ref={dataTableExport}
            onRowClick={onRowClicked}
            onRowDoubleClick={onDetailRowClicked}
            emptyMessage="No bills found."
          >
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
              filterField="shortTitle"
              filterPlaceholder="Search by Title"
            ></Column>
            <Column
              field="primarySponsor"
              header="Sponsor"
              sortable
              filterField="primarySponsor"
              // style={{ whiteSpace: "nowrap" }}
            ></Column>
            <Column field="actionCodeDesc" header="Action" sortable></Column>
            <Column
              field="lastActionDate"
              header="Action Date"
              filterField="lastActionDate"
              sortable
            ></Column>
            <Column
              field="ownerDesc"
              header="Owner"
              sortable
              filterField="ownerDesc"
            ></Column>
          </DataTable>
          {showModal && <DetailModal />}
        </div>
      </div>
    </>
  );
}

export default Committees;
