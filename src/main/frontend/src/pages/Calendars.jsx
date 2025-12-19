import { useState, useEffect } from "react";
import Api from "../components/Api";
import Navigation from "../components/Navigation";
import CalendarCard from "../components/CalendarCard";
import { Button } from "primereact/button";

function Calendars({ billList, loadDate, actionCodes, sessionDates }) {
  const [billOrder, setBillOrder] = useState([]);

  const loadData = async () => {
    const api = Api.get();
    await api
      .doGet("/api/v1/bill/calendar/bill/order/")
      .then((response) => response.json())
      .then((data) => {
        setBillOrder(data);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line
  }, []);

  const showWebcalendars = () => {
    window.open("https://le.utah.gov/FloorCalendars/index.jsp", "_blank");
  };

  return (
    <>
      <Navigation loadDate={loadDate} sessionDates={sessionDates} />
      <div id="container">
        <div className="pageTitle">
          <Button
            onClick={showWebcalendars}
            title="Website Calendar"
            style={{ transform: "scale(.7)" }}
            icon="pi pi-external-link pi2"
          ></Button>{" "}
          Calendars &nbsp; &nbsp; &nbsp;
          <span style={{ fontSize: "80%", color: "#666" }}>
            Note: Bills are not in the actual order of reading. View the web
            version for that.
          </span>
        </div>
        <div
          style={{
            maxWidth: "49%",
            minWidth: "49%",
            minHeight: "98%",
            float: "left",
            padding: "5px",
            margin: "5px",
          }}
        >
          <CalendarCard
            cardTitle={"House Concurrence"}
            ownerCodes={"HCURCAL"}
            billList={billList}
          />
          <CalendarCard
            cardTitle={"House Consent"}
            ownerCodes={"HCON"}
            billList={billList}
          />
          <CalendarCard
            cardTitle={"House Time Certain"}
            ownerCodes={"HSPEC"}
            billList={billList}
          />
          <CalendarCard
            cardTitle={"House 3rd Reading"}
            ownerCodes={"H3RDHB"}
            billList={billList}
          />
          <CalendarCard
            cardTitle={"House 3rd Reading - Senate Bills"}
            ownerCodes={"H3RDSB"}
            billList={billList}
          />
        </div>
        <div
          style={{
            maxWidth: "49%",
            minWidth: "49%",
            minHeight: "98%",
            float: "left",
            padding: "5px",
            margin: "5px",
          }}
        >
          <CalendarCard
            cardTitle={"Senate Concurrence"}
            ownerCodes={"SCURCAL"}
            billList={billList}
          />
          <CalendarCard
            cardTitle={"Senate Consent"}
            ownerCodes={"SCON"}
            billList={billList}
          />
          <CalendarCard
            cardTitle={"Senate Time Certain"}
            ownerCodes={"SSPEC"}
            billList={billList}
          />
          <CalendarCard
            cardTitle={"Senate 2nd Reading"}
            ownerCodes={"S2ND"}
            billList={billList}
          />
          <CalendarCard
            cardTitle={"Senate 3rd Reading"}
            ownerCodes={"S3RD"}
            billList={billList}
          />
          <CalendarCard
            cardTitle={"Senate 2nd Reading - Tabled"}
            ownerCodes={"S2NDTA"}
            billList={billList}
          />
          <CalendarCard
            cardTitle={"Senate 3rd Reading - Tabled"}
            ownerCodes={"S3RDTA"}
            billList={billList}
          />
        </div>
        <div>
          Legend:
          <br />
          &nbsp; &nbsp;{" "}
          <span className="fiscalBill">Fiscal Bill ($20k or more)</span>
          <br />
          &nbsp; &nbsp; <span className="fiscalImpact">Fiscal Impact</span>
          <br />
        </div>
      </div>
    </>
  );
}

export default Calendars;

