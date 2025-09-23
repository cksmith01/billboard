import { useState, useEffect } from "react";
import Api from "../components/Api";
import Navigation from "../components/Navigation";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { Button } from "primereact/button";

function About({ loadDate, sessionDates }) {
  const [userList, setUserList] = useState([]);
  const [cacheClearDate, setCacheClearDate] = useState("0");

  const navigate = useNavigate();

  const style = {
    padding: "10px",
    fontWeight: "bold",
  };

  const loadData = async () => {
    const api = Api.get();
    await api
      .doGet("/api/v1/info/users")
      .then((response) => response.json())
      .then((data) => {
        const userItems = data.map((user) => (
          <li>
            <a
              target="_blank"
              href={"https://whatismyipaddress.com/ip/" + user.ip}
            >
              {user.ip}
            </a>
            : {user.date}
          </li>
        ));
        setUserList(userItems);
        console.log("user list load succeeded", new Date(), data);
      })
      .catch((err) => {
        console.error(err);
      });

    await api
      .doGet("/api/v1/info/cacheClearDate")
      .then((response) => response.json())
      .then((data) => {
        console.log("cache clear date succeeded", new Date(), data);
        const clearDate = new Date(data);
        console.log("???", clearDate.toLocaleDateString());
        setCacheClearDate(clearDate);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  function getNewlyOwned() {
    navigate("/newlyOwned");
  }

  const addTag = async () => {
    const tag = prompt("Enter your initials");
    if (tag != null && tag != "") {
      const api = Api.get();
      await api
        .doGet("/api/v1/info/tag/" + tag + "/")
        .then((response) => response.json())
        .then((data) => {
          console.log("tag added", new Date(), data);
        })
        .catch((err) => {
          console.error(err);
        });
    }
  };

  const showNewLists = (e) => {
    navigate("/myLists");
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line
  }, []);

  return (
    <>
      <Navigation loadDate={loadDate} sessionDates={sessionDates} />
      <div id="container">
        <div className="pageTitle">About</div>
        <div
          style={{
            margin: "30px",
            color: "red",
            fontWeight: "bold",
            textTransform: "uppercase",
          }}
        >
          * This application is experimental *
        </div>
        <div style={{ maxWidth: "600px", marginLeft: "20px" }} id="aboutPage">
          <div style={style}>Build Date: 2024-02-12 </div>

          <div style={{ marginLeft: "20px" }}>
            <div>Cache Clear Date: {format(cacheClearDate, "MMM d, h:mm a")}</div>
          </div>

          <h4>Features</h4>
          <ul>
            <li>
              The date & time stamp at the top right is the last time the data
              was loaded from the server. To refresh the data, go to "All Bills"
              page and click the browser refresh button.
            </li>
            <li>
              <span style={{ color: "red" }}>
                For any bill, if the data here doesn't match what is shown on
                the{" "}
                <a target="_blank" href="https://le.utah.gov">
                  website
                </a>
                , the website should be considered the source of truth
              </span>
            </li>
            <li>Only shows public bills</li>
            <li>
              <b>Cacheing:</b> query results are cached at the application level
              to limit the load on the database. Caches are cleared every 10
              minutes.
              <ul>
                <li>The bill list</li>
                <li>Actions Codes (Statuses)</li>
                <li>Committee list</li>
              </ul>
            </li>
            <li>
              Session year will automatically switch on Dec 15th as bill
              numbering for the coming session begins
            </li>
            <li>
              Action codes and committees are queried from the data in that
              year. That means that early on, the application won't show
              certains actions or committees because at least one bill has not
              yet entered that committee or received those actions.
            </li>
            <li>
              Technical Note: The committees page is filtering the data on the
              Owner column, all other pages are filtering on LastLegAction
            </li>
          </ul>

          <h4>Future Enhancements</h4>
          <ul>
            <li>Add Bill Detail to following pages: committees, sponsors </li>
            <li>Revisit how the timeline creates events: probably should use final pass dates rather than 3rd reading</li>
            <li>The ability to add/remove columns to the main table</li>
            <li>
              Smart cacheing: durring session, allow for frequent querries, off
              session cache for 24 hrs
            </li>
            <li>Make the calendar show bills in the order that they will be read</li>
            <li>Add the ability to add notes to bills</li>
            <li>Charting</li>
            <li>A screen where we could query any of the columns</li>
            <li>
              The ability to see just the house/senate/resolutions on the main
              page
            </li>
            <li>Add pictures to the sponsors page</li>
            <li>
              Periodic checks to the website to see if a tracked bill has
              recieved a new action, and alert the user of a change
              <div className="techNote">
                Tech note: via AJAX calls to the JSON file on the server. The
                URL is already in the data list, however, it's using my API key
              </div>
            </li>
            <li>
              A bill comparison function, would be nice so that you can see what
              has changed on a bill or a view that allows you to see every bill
              that changed since the last query.
              <br />
              <div className="techNote">
                Tech note: After a little research, it looks like Lowdash can be
                used to compare the values of 2 like objects (bills), although
                at this juncture, I don't see a way to show what specific values
                have changed w/o created a side-by-side comparison screen.
              </div>
            </li>
            <li>AllBills: clear all filters button</li>
            <li>
              Tech note: consider recoil or signals to store the data sets
              locally (maybe, not sure this is needed)
            </li>
          </ul>
        </div>
        <div
          style={{
            marginLeft: "20px",
            borderTop: "1px #ccc solid",
            width: "600px",
          }}
        >
          <div>
            Users:
            <ul>{userList}</ul>
          </div>
        </div>
        <Button onClick={addTag} title="Tag User">
          <i className="pi pi-tag" style={{ color: "slateblue" }}></i>
        </Button>
        <Button onClick={showNewLists} title="New Lists">
          <i className="pi pi-check" style={{ color: "slateblue" }}></i>
        </Button>
      </div>
    </>
  );
}

export default About;
