import React from "react";
import { Menubar } from "primereact/menubar";
import Logo from "./Logo";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import Api from "./Api";

function Navigation({ loadDate, sessionDates }) {
  if (loadDate == null || loadDate == undefined) {
    loadDate = new Date();
  }
  const navigate = useNavigate();
  const items = [
    {
      label: "All Bills",
      icon: "pi pi-list",
      command: () => {
        navigate("/");
      },
    },
    {
      label: "Status",
      icon: "pi pi-map",
      command: () => {
        navigate("/billStatus");
      },
    },
    {
      label: "Committees",
      icon: "pi pi-users",
      command: () => {
        navigate("/committee");
      },
    },
    {
      label: "Sponsors",
      icon: "pi pi-user-edit",
      command: () => {
        navigate("/sponsors");
      },
    },
    {
      label: "Calendars",
      icon: "pi pi-calendar",
      command: () => {
        navigate("/calendars");
      },
    },
    // {
    //   label: "My List",
    //   icon: "pi pi-check",
    //   command: () => {
    //     navigate("/myList");
    //   },
    // },
    {
      label: "My Lists",
      icon: "pi pi-check",
      command: () => {
        navigate("/myLists");
      },
    },
    {
      label: "Refresh",
      icon: "pi pi-refresh",
      command: () => {
        reload();
      },
    },
    {
      label: "",
      icon: "pi pi-question-circle",
      command: () => {
        navigate("/about");
      },
    },
  ];

  const reload = () => {
    window.location.href = Api.BASE_URL + "/?xyz=" + Math.random();
  };

  const elapsedTime = () => {
    const elapsed = (new Date().getTime() - loadDate) / 1000;

    if (elapsed >= 0) {
      const diff = {};

      diff.days = Math.floor(elapsed / 86400);
      diff.hours = Math.floor((elapsed / 3600) % 24);
      diff.minutes = Math.floor((elapsed / 60) % 60);
      diff.seconds = Math.floor(elapsed % 60);

      let message = `${diff.days}d ${diff.hours}h ${diff.minutes}m ${diff.seconds}s`;
      message = message.replace(/(?:0. )+/, "");
      return message;
    } else {
      return "???";
    }
  };

  const looper = () => {
    try {
      setTimeout(() => {
        const obj = document.getElementById("elapsed");
        if (obj != null && obj != undefined) 
          obj.innerHTML = elapsedTime();
        looper();
      }, 1000);
    } catch (error) {
      console.log('navigation: error', error)
    }
  };

  looper();

  const renderSessionYear = () => {
    return (
      <>
        <div
          style={{
            marginRight: "25px",
            fontSize: "90%",
            fontWeight: "bold",
          }}
        >
          {/* Session Year: {getSessionDate()} */}
        </div>
        <div
          style={{
            marginRight: "5px",
            fontSize: "80%",
            display: "inline",
          }}
        >
          Last Refresh: {format(loadDate, "MMM d, h:mm a")}
          &nbsp;/ <span id="elapsed" title="Elapsed time since last refresh"></span>
        </div>
      </>
    );
  };

  return (
    <Menubar
      model={items}
      start={<Logo />}
      end={renderSessionYear}
      className="sticky"
    />
  );
}

export default Navigation;
