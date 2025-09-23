import React from "react";
import { Timeline } from "primereact/timeline";
import { format } from "date-fns";
import { buildEvents } from "./timeLineUtil";

/**
 * ISSUES:
 * - last action + date is more current than the bill status column which is what this component is evaluating on
 * - it doesn't handle resolutions yet
 * - check budget bills ... they don't go through standing committees
 */

function TimeLine({ bill }) {
  const events = buildEvents(bill, false);

  const renderContent = (item) => {
    return <span style={{ fontSize: "85%", color: "#999" }}>{item.date}</span>;
  };

  const customizedMarker = (item) => {
    return (
      <span className="circle-icon" style={{ backgroundColor: item.color }}>
        {/* <i className={item.icon}></i> */}
      </span>
    );
  };

  return (
    <>
      <Timeline
        value={events}
        align="top"
        layout="horizontal"
        opposite={(item) => (
          <span style={{ fontSize: "90%" }}>{item.status}</span>
        )}
        content={renderContent}
        marker={customizedMarker}
      />
      <div className="techNote" style={{ width: "99%", textAlign: "right" }}>
        Disclaimer: Timelines are a general guide and may not reflect the true
        path of a bill. See website for details.
      </div>
    </>
  );
}

export default TimeLine;
