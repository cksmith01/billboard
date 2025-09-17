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

function TimeLineMini({ bill }) {
  const events = buildEvents(bill, true);

  const renderContent = (item) => {
    return "";
  };

  const customizedMarker = (item) => {
    return (
      <span
        className="circle-icon"
        style={{ backgroundColor: item.color }}
      ></span>
    );
  };

  return (
    <Timeline
      value={events}
      align="top"
      layout="horizontal"
      opposite={(item) => (
        <span style={{ fontSize: "80%" }}>{item.status}</span>
      )}
      marker={customizedMarker}
      // content={renderContent}
      style={{maxHeight: '62px'}}
    />
  );
}

export default TimeLineMini;
