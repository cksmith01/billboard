import { useState } from "react";
import Navigation from "../components/Navigation";
import StatusCard from "../components/StatusCard";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import BillDetails from "../components/BillDetails";
import { Dialog } from "primereact/dialog";
import {
  billLinkTemplate,
  sponsorTemplate,
  flSponsorTemplate,
  ownerTemplate
} from "../components/utils";

function BillStatus({ billList, loadDate, actionCodes, sessionDates }) {
  const [subList, setSubList] = useState([]);
  const [modal, showModal] = useState(false);
  const [selectedBill, setSelectedBill] = useState({});

  const showList = (event) => {
    const billsForCode = billList.filter((bill) => {
      if (bill.lastActionCode == event.target.id) {
        return bill;
      }
    });
    setSubList(billsForCode);
  };

  const onRowClicked = (row) => {
    row.originalEvent.preventDefault();
    setSelectedBill(row.data);
    showModal(true);
  };

  const DetailModal = () => {
    return (
      <Dialog
      header={`${selectedBill.billNumber} ${selectedBill.shortTitle} - ${selectedBill.primarySponsor}`}
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

  return (
    <>
      <Navigation loadDate={loadDate} sessionDates={sessionDates} />
      <div id="container">
        <div className="pageTitle">Bill Status: {billList.length}</div>
        <div
          style={{
            maxWidth: "25%",
            minWidth: "25%",
            height: "92vh",
            maxHeight: "92vh",
            padding: "5px",
            borderRight: "1px #ccc solid",
            float: "left",
            position: "relative",
            overflowY: "auto",
          }}
        >
          <StatusCard
            cardTitle="LRGC"
            statusCodeList="LRGCRS,LENROLL,LNUMBER,LRGCRH,LPASSREV,LLFA,"
            billList={billList}
            actionCodes={actionCodes}
            showListCallback={showList}
          />
          <StatusCard
            cardTitle="LFA"
            statusCodeList="LFA4,LFA2,LFA3,"
            billList={billList}
            actionCodes={actionCodes}
            showListCallback={showList}
          />
          <StatusCard
            cardTitle="House"
            statusCodeList="H3RDTORUL,HAMEND,HAMENDFAIL,HAMENDOUT,HAOUT,HCC,HCIRCLED,HCONCUR,HCR,HCRAMD,HCRAMDCON,HCRCON,HCRRJT,HCRRUL,HCRRULAMD,HCRRULSUB,HCRRULSUBA,HCRSUB,HCRSUBAMD,HCRSUBAMDC,HCRSUBCON,HCRTBLD,HCRTBLDA,HCRTBLDS,HCRTBLDSA,HECS,HFAIL,HFILED,HHOLD,HINTENT,HLIFTCAL,HLIFTCOM,HLIFTRUL,HLIFTRULTA,HMAKESPEC,HMOTREC,HMOTRECF,HMOTRECP,HMOVE3RD,HNOTICREC,HONCURCAL,HOVERGLITV,HOVERRIDE,HPASS123SP,HPASS23SP,HPASS3,HPLACETC,HREAD1,HREAD123SP,HREAD12SP,HREAD2,HREAD23SP,HREAD2RUL,HREAD2SP,HREAD3,HREC,HRECALL,HRECEDE,HRECENRP,HRECLFA,HRECLRGC,HRECONCUR,HRECPRINT,HRECS,HREFUSE,HRETRULFIS,HRR,HRUL3RD,HRULAMD,HRULSUB,HRULSUBAMD,HSENTLFA,HSIGN,HSIGNS,HSOUT,HSUB,HSUBFAIL,HSUSPEND,HTABLE,HTOGOV,HTOLTGOV,HTOPRINT,HTOPRINTEN,HTOSEN,HTOSTAND,HUNCIRCLED,"
            billList={billList}
            actionCodes={actionCodes}
            showListCallback={showList}
          />
          <StatusCard
            cardTitle="Senate"
            statusCodeList="S2NDTORUL,S3RDTORUL,SAMEND,SAMENDFAIL,SAMENDOUT,SAOUT,SCC,SCIRCLED,SCONCUR,SCR,SCRAMD,SCRAMDCON,SCRCON,SCRRJT,SCRRUL,SCRRULAMD,SCRRULSUB,SCRRULSUBA,SCRSEC,SCRSUB,SCRSUBAMD,SCRSUBAMDC,SCRSUBCON,SCRSUBNOT,SCRSUBTBLD,SCRTBLD,SCRTBLDA,SCRTBLDS,SCRTBLDSA,SECS,SFAIL,SFILED,SFILEDEXP,SHOLD,SINTENT,SLIFTCAL,SLIFTCOM,SLIFTRUL,SLIFTTBL,SMAKESPEC,SMOTREC,SMOTRECF,SMOTRECP,SMOVE2ND,SMOVE3RD,SNOTICREC,SON2ND,SON2TBL,SON3TBL,SONCURCAL,SOVERGLITV,SOVERRIDE,SPASS12,SPASS123,SPASS123SP,SPASS12SP,SPASS2,SPASS23,SPASS23SP,SPASS2SP,SPASS3,SPLACETC,SPRNTRET,SREAD1,SREAD123SP,SREAD12SP,SREAD2,SREAD23SP,SREAD2SP,SREAD3,SREAD3SP,SREC,SRECALL,SRECEDE,SRECENRP,SRECH,SRECLFA,SRECLRGC,SRECONCUR,SRECPRINT,SREFUSE,SRETRUL,SRETSEC,SRR,SRUL2ND,SRUL3RD,SRULAMD,SRULCAL,SRULES,SSENTLFA,SSENTPRES,SSIGN,SSIGNH,SSOUT,SSUB,SSUBFAIL,SSUBRUL,SSUBRULAMD,SSUBTOC,SSUSPEND,STABLE,STOGOV,STOHAMD,STOHCOR,STOHOU,STOHOUEXP,STOLTGOV,STOPRESEXP,STOPRINT,STOPRINTEN,STOSTAND,SUNCIRCLED,"
            billList={billList}
            actionCodes={actionCodes}
            showListCallback={showList}
          />
          <StatusCard
            cardTitle="Committee"
            statusCodeList="CCAMD,CCSUB,CONCOMDIS,CONCOMREP,HCAAG,HCAAMD,HCAAMDOUT,HCAAOUT,HCACONCAL,HCAFAV,HCAFAVFAIL,HCAHELD,HCALIFT,HCAMOVE,HCANOCNSDR,HCANOLIFT,HCARCON,HCARUL,HCASOUT,HCASUB,HCATBL,HCATBLFAIL,HCCOMAPP,HCOMFINALP,HCOMREPADP,HCOMREPFL,SCAAG,SCAAMD,SCAAMDOUT,SCAAOUT,SCACONCAL,SCAFAV,SCAFAVFAIL,SCAHELD,SCALIFT,SCAMOVE,SCANOCNSDR,SCANOLIFT,SCARCON,SCARUL,SCASOUT,SCASUB,SCATBL,SCATBLFAIL,SCCOMAPP,SCOMFINALP,SCOMREPADP,SCOMREPFL,"
            billList={billList}
            actionCodes={actionCodes}
            showListCallback={showList}
          />
          <StatusCard
            cardTitle="Governor"
            statusCodeList="GDECLINE,GNOSIGN,GOVLVETO,GPRESENT,GRETH,GRETS,GSIGN,GVETO,"
            billList={billList}
            actionCodes={actionCodes}
            showListCallback={showList}
          />
        </div>
        <div
          style={{
            maxWidth: "73%",
            minWidth: "73%",
            minHeight: "98%",
            float: "left",
            padding: "5px",
            margin: "5px",
          }}
        >
          <DataTable
            id="dataTable"
            size="small"
            value={subList}
            tableStyle={{ minWidth: "100%" }}
            paginator
            rows={25}
            stripedRows
            totalRecords={subList.length}
            rowsPerPageOptions={[25, 50, 100, 500, 1000]}
            paginatorTemplate="FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink RowsPerPageDropdown"
            currentPageReportTemplate="{first} to {last} of {totalRecords}"
            style={{ width: "100%" }}
            dataKey="billNumber"
            onRowDoubleClick={onRowClicked}
            emptyMessage="Select a status to show bills"
            sortField="lastActionDate"
            sortOrder={-1}
          >
            {/* <Column field="sessionID" header="Session" sortable></Column> */}
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
              field="actionCodeDesc"
              header="Last Action"
              sortable
              filterField="actionCodeDesc"
            ></Column>
            <Column
              field="lastActionDate"
              header="Action Date"
              sortable
              filterField="lastActionDate"
            ></Column>
            <Column
              field="ownerDesc"
              sortable
              header="Owner"
              body={ownerTemplate}
              filterField="owner"
            ></Column>
          </DataTable>
          {showModal && <DetailModal />}
        </div>
      </div>
    </>
  );
}

export default BillStatus;
