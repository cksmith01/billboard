import React from "react";
import BulkSelect from "./BulkSelect";

function BulkAdd({ billNumArray, billList, callBack }) {
  console.log('BulkAdd', callBack);
  const getTitle = (num) => {
    let t = "";
    for (let i = 0; i < billList.length; i++) {
      if (billList[i].billNumber === num) {
        t = billList[i].shortTitle;
        break;
      }
    }
    return t;
  };

  return (
    <div style={{fontSize: '90%'}}>
      <ol>
        {billNumArray.map((num, i) => (
          <li key={num}>{num} {getTitle(num)}</li>
        ))}
      </ol>
      <BulkSelect billNumArray={billNumArray} callBack={callBack} />
    </div>
  );
}

export default BulkAdd;
