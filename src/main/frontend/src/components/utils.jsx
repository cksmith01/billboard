import { isBillTracked, trackingList } from "./listUtil";

const formatCurrency = (value) => {
  if (value == null || value == "" || isNaN(value)) value = 0;
  return value.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  });
};
export { formatCurrency };

const formatPercent = (value) => {
  if (value == null || value == "" || isNaN(value)) value = 0;
  return Number(value).toLocaleString(undefined, {
    style: "percent",
    minimumFractionDigits: 1,
  });
};
export { formatPercent };

const sponsorLink = (bill) => {
  let link = "https://senate.utah.gov/sen/" + bill.sponsorID;
  if (bill.billNumber.indexOf("H") == 0) {
    link = "https://house.utleg.gov/rep/" + bill.sponsorID;
  }
  return link;
};
export { sponsorLink };

const flSponsorLink = (bill) => {
  let link = "https://house.utleg.gov/rep/" + bill.floorSponsorID;
  if (bill.billNumber.indexOf("H") == 0) {
    link = "https://senate.utah.gov/sen/" + bill.floorSponsorID;
  }
  return link;
};
export { flSponsorLink };

const sponsorTemplate = (cell, row) => {
  return (
    <>
      {
        <a href={sponsorLink(cell)} target="_blank">
          {cell.primarySponsor}
        </a>
      }
    </>
  );
};
export { sponsorTemplate };

const flSponsorTemplate = (cell, row) => {
  return (
    <>
      {
        <a href={flSponsorLink(cell)} target="_blank">
          {cell.floorSponsor}
        </a>
      }
    </>
  );
};
export { flSponsorTemplate };

const billLinkTemplate = (cell) => {
  const clsNm = isBillTracked(cell.billNumber) ? "tracked" : "untracked";

  let title = "";
  if (clsNm === "tracked") {
    title = trackingList(cell.billNumber)[0];
  }

  return (
    <span className={clsNm} id={cell.billNumber} title={title}>
      {
        <a href={cell.link} target="_blank" style={{ fontSize: "95%" }}>
          {cell.billNumber}
        </a>
      }
    </span>
  );
};
export { billLinkTemplate };

const fiscalTemplate = (bill) => {
  return formatCurrency(bill.fiscalTotal);
};
export { fiscalTemplate };

const ownerTemplate = (cell, row) => {
  return <span title={cell.owner}>{cell.ownerDesc}</span>;
};
export { ownerTemplate };

const moneyAbbr = (bill) => {
  let amount = bill.fiscalTotal;
  if (amount == undefined || amount == null) {
    amount = 0;
  }
  amount = Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(amount);
  if (amount === "" || amount == null) amount = "0";
  let amt = amount + "";
  if (amt.indexOf("-") === 0) {
    amt = "(" + amt.substring(1) + ")";
  }
  return amt;
};
export { moneyAbbr };
