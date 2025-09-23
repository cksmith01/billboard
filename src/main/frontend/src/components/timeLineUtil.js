import { format, parse } from "date-fns";

const notBlank = (item) => {
  return item != undefined && item != null && item !== "";
};

const formatDate = (d) => {
  if (notBlank(d)) {
    return format(d, "M/d");
  }
  return "";
};

const dateAafterB = (a, b) => {
  if (a.indexOf(".") > -1) {
    a = a.substring(0, a.lastIndexOf("."));
  }
  if (b.indexOf(".") > -1) {
    b = b.substring(0, b.lastIndexOf("."));
  }
  let _a = parse(a, "yyyy-MM-dd HH:mm:ss", new Date());
  let _b = parse(b, "yyyy-MM-dd HH:mm:ss", new Date());
  return _a.getTime() > _b.getTime();
};

const checkForBoth = (bill, action, event) => {
  if (action === "hpass3") {
    if (
      bill.failedOnFloorAction === "HFAIL" &&
      notBlank(bill.failedOnFloorDate) &&
      notBlank(bill.hpass3)
    ) {
      if (dateAafterB(bill.failedOnFloorDate, bill.hpass3)) {
        event.date = formatDate(bill.failedOnFloorDate);
        event.icon = "pi pi-times";
        event.color = "#CC0000";
      } else {
        event.date = formatDate(bill.hpass3);
      }
    }
  }
  if (action === "spass3") {
    if (
      bill.failedOnFloorAction === "SFAIL" &&
      notBlank(bill.failedOnFloorDate) &&
      notBlank(bill.spass3)
    ) {
      if (dateAafterB(bill.failedOnFloorDate, bill.spass3)) {
        event.date = formatDate(bill.failedOnFloorDate);
        event.icon = "pi pi-times";
        event.color = "#CC0000";
      } else {
        event.date = formatDate(bill.spass3);
      }
    }
  }

  return event;
};

export const buildEvents = (bill, abbr) => {
  const events = new Array();
  /**
   * HOUSE BILLS ---------------------
   */
  if (
    bill.billNumber.indexOf("HB") == 0 ||
    bill.billNumber.indexOf("HJR") == 0 ||
    bill.billNumber.indexOf("HCR") == 0
  ) {
    let event = {
      status: "Hse Com",
      date: "-",
    };
    if (abbr) event.status = "H/C";
    if (notBlank(bill.hcomActionDate)) {
      event.date = formatDate(bill.hcomActionDate);
      event.icon = "pi pi-check";
      event.color = "green";
      if (bill.hcomAction.indexOf("FAIL") > -1) {
        event.icon = "pi pi-times";
        event.color = "#CC0000";
      }
    }
    events.push(event);
    event = {
      status: "Hse 3rd",
      date: "-",
    };
    if (abbr) event.status = "H/3";
    if (
      notBlank(bill.failedOnFloorDate) &&
      bill.failedOnFloorAction === "HFAIL"
    ) {
      event.date = formatDate(bill.failedOnFloorDate);
      event.icon = "pi pi-times";
      event.color = "#CC0000";
    }
    if (notBlank(bill.hpass3)) {
      event.date = formatDate(bill.hpass3);
      event.icon = "pi pi-check";
      event.color = "green";
    }
    event = checkForBoth(bill, "hpass3", event);
    events.push(event);
    event = {
      status: "Sen Com",
      date: "-",
    };
    if (abbr) event.status = "S/C";
    if (notBlank(bill.scomActionDate)) {
      event.date = formatDate(bill.scomActionDate);
      event.icon = "pi pi-check";
      event.color = "green";
      if (bill.scomAction.indexOf("FAIL") > -1) {
        event.icon = "pi pi-times";
        event.color = "#CC0000";
      }
    }
    events.push(event);
    event = {
      status: "Sen 3rd",
      date: "-",
    };
    if (abbr) event.status = "S/3";
    if (
      notBlank(bill.failedOnFloorDate) &&
      bill.failedOnFloorAction === "SFAIL"
    ) {
      event.date = formatDate(bill.failedOnFloorDate);
      event.icon = "pi pi-times";
      event.color = "#CC0000";
    }
    if (notBlank(bill.spass3)) {
      event.date = formatDate(bill.spass3);
      event.icon = "pi pi-check";
      event.color = "green";
    }
    event = checkForBoth(bill, "spass3", event);
    events.push(event);
  } else if (
    /**
     * SENATE BILLS ---------------------
     */
    bill.billNumber.indexOf("SB") == 0 ||
    bill.billNumber.indexOf("SJR") == 0 ||
    bill.billNumber.indexOf("SCR") == 0
  ) {
    let event = {
      status: "Sen Com",
      date: "-",
    };
    if (abbr) event.status = "S/C";
    if (notBlank(bill.scomActionDate)) {
      event.date = formatDate(bill.scomActionDate);
      event.icon = "pi pi-check";
      event.color = "green";
      if (bill.scomAction.indexOf("FAIL") > -1) {
        event.icon = "pi pi-times";
        event.color = "#CC0000";
      }
    }
    events.push(event);
    event = {
      status: "Sen 3rd",
      date: "-",
    };
    if (abbr) event.status = "S/3";
    if (
      notBlank(bill.failedOnFloorDate) &&
      bill.failedOnFloorAction === "SFAIL"
    ) {
      event.date = formatDate(bill.failedOnFloorDate);
      event.icon = "pi pi-times";
      event.color = "#CC0000";
    }
    if (notBlank(bill.spass3)) {
      event.date = formatDate(bill.spass3);
      event.icon = "pi pi-check";
      event.color = "green";
    }
    event = checkForBoth(bill, "spass3", event);
    events.push(event);
    event = {
      status: "Hse Com",
      date: "-",
    };
    if (abbr) event.status = "H/C";
    if (notBlank(bill.hcomActionDate)) {
      event.date = formatDate(bill.hcomActionDate);
      event.icon = "pi pi-check";
      event.color = "green";
      if (bill.hcomAction.indexOf("FAIL") > -1) {
        event.icon = "pi pi-times";
        event.color = "#CC0000";
      }
    }
    events.push(event);
    event = {
      status: "Hse 3rd",
      date: "-",
    };
    if (abbr) event.status = "H/3";
    if (
      notBlank(bill.failedOnFloorDate) &&
      bill.failedOnFloorAction === "HFAIL"
    ) {
      event.date = formatDate(bill.failedOnFloorDate);
      event.icon = "pi pi-times";
      event.color = "#CC0000";
    }
    if (notBlank(bill.hpass3)) {
      event.date = formatDate(bill.hpass3);
      event.icon = "pi pi-check";
      event.color = "green";
    }
    event = checkForBoth(bill, "hpass3", event);
    events.push(event);
  } else if (bill.billNumber.indexOf("SR") == 0) {
    let event = {
      status: "Sen Com",
      date: "-",
    };
    if (abbr) event.status = "S/C";
    if (notBlank(bill.scomActionDate)) {
      event.date = formatDate(bill.scomActionDate);
      event.icon = "pi pi-check";
      event.color = "green";
      if (bill.scomAction.indexOf("FAIL") > -1) {
        event.icon = "pi pi-times";
        event.color = "#CC0000";
      }
    }
    events.push(event);
    event = {
      status: "Sen 3rd",
      date: "-",
    };
    if (abbr) event.status = "S/3";
    if (
      notBlank(bill.failedOnFloorDate) &&
      bill.failedOnFloorAction === "SFAIL"
    ) {
      event.date = formatDate(bill.failedOnFloorDate);
      event.icon = "pi pi-times";
      event.color = "#CC0000";
    }
    if (notBlank(bill.spass3)) {
      event.date = formatDate(bill.spass3);
      event.icon = "pi pi-check";
      event.color = "green";
    }
    event = checkForBoth(bill, "spass3", event);
    events.push(event);
  } else if (bill.billNumber.indexOf("HR") == 0) {
    let event = {
      status: "Hse Com",
      date: "-",
    };
    if (abbr) event.status = "H/C";
    if (notBlank(bill.hcomActionDate)) {
      event.date = formatDate(bill.hcomActionDate);
      event.icon = "pi pi-check";
      event.color = "green";
      if (bill.hcomAction.indexOf("FAIL") > -1) {
        event.icon = "pi pi-times";
        event.color = "#CC0000";
      }
    }
    events.push(event);
    event = {
      status: "Hse 3rd",
      date: "-",
    };
    if (abbr) event.status = "H/3";
    if (notBlank(bill.hpass3)) {
      event.date = formatDate(bill.hpass3);
      event.icon = "pi pi-check";
      event.color = "green";
    }
    event = checkForBoth(bill, "hpass3", event);
    events.push(event);
  }

  /**
   * GOVERNOR ---------------------
   */
  if (
    bill.billNumber.indexOf("SR") == -1 &&
    bill.billNumber.indexOf("HR") == -1
  ) {
    let event = {
      status: "Gov",
      date: "-",
    };
    if (notBlank(bill.govDate)) {
      event.date = formatDate(bill.govDate);
      event.icon = "pi pi-check";
      event.color = "green";
      if (bill.govAction.indexOf("VETO") > -1) {
        event.icon = "pi pi-times";
        event.color = "#CC0000";
      }
    }
    events.push(event);
  }
  return events;
};
