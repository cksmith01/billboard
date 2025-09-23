import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Board from "./pages/Board";
import About from "./pages/About";
import NoMatch from "./pages/NoMatch";
import Api from "./components/Api";
import Committees from "./pages/Committees";
import MyList from "./pages/MyList";
import { getSessionDate } from "./components/getSessionDate";
import BillStatus from "./pages/BillStatus";
import Sponsors from "./pages/Sponsors";
import Calendars from "./pages/Calendars";
import MyLists from "./pages/MyLists";

function App() {
  const year = getSessionDate();
  const [billList, setBillList] = useState([]);
  const [actionCodes, setActionCodes] = useState([]);
  const [loadDate, setLoadDate] = useState(new Date());
  const [sessionDates, setSessionDates] = useState([]);

  const loadData = async () => {
    if (billList.length > 0) {
      return;
    }

    const api = Api.get();
    await api
      .doGet("/api/v1/bill/list/" + year)
      .then((response) => response.json())
      .then((data) => {
        setBillList(data);
        setLoadDate(new Date());
      })
      .catch((err) => {
        console.error(err);
      });

    await api
      .doGet("/api/v1/bill/actionAndOwnerCodes/")
      .then((response) => response.json())
      .then((data) => {
        setActionCodes(data);
      })
      .catch((err) => {
        console.error(err);
      });

    await api
      .doGet("/api/v1/info/session/dates/" + year)
      .then((response) => response.json())
      .then((data) => {
        setSessionDates(data);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line
  }, []);

  return (
    // <BrowserRouter basename={"/billboard"}>
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <Board
              billList={billList}
              loadDate={loadDate}
              sessionDates={sessionDates}
            />
          }
        />
        <Route
          path="/about"
          element={<About loadDate={loadDate} sessionDates={sessionDates} />}
        />
        <Route
          path="/committee"
          element={
            <Committees
              billList={billList}
              actionCodes={actionCodes}
              loadDate={loadDate}
              sessionDates={sessionDates}
            />
          }
        />
        <Route
          path="/myList"
          element={
            <MyList
              billList={billList}
              actionCodes={actionCodes}
              loadDate={loadDate}
              sessionDates={sessionDates}
            />
          }
        />
        <Route
          path="/billStatus"
          element={
            <BillStatus
              billList={billList}
              loadDate={loadDate}
              actionCodes={actionCodes}
              sessionDates={sessionDates}
            />
          }
        />
        <Route
          path="/sponsors"
          element={
            <Sponsors
              billList={billList}
              loadDate={loadDate}
              actionCodes={actionCodes}
              sessionDates={sessionDates}
            />
          }
        />
        <Route
          path="/calendars"
          element={
            <Calendars
              billList={billList}
              loadDate={loadDate}
              actionCodes={actionCodes}
              sessionDates={sessionDates}
            />
          }
        />
        <Route
          path="/myLists"
          element={
            <MyLists
              billList={billList}
              actionCodes={actionCodes}
              loadDate={loadDate}
              sessionDates={sessionDates}
            />
          }
        />
        <Route path="*" element={<NoMatch />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
