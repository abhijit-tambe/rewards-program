import React, { useState, useEffect } from "react";
import service from "../../service";

const PurchaseList = () => {
  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    service().then((result) => {
      setUserData(result);
      setLoading(false);
    });
  }, []);

  return (
    <>
      <h1>Purchase list for 2021</h1>
      {loading && <h3>Loading...</h3>}
      {!loading && (
        <table className={"table table-striped"}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Amount</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {userData.data.map((val, key) => {
              return (
                <tr key={key}>
                  <td>{val.tData.name}</td>
                  <td>{val.tData.amount}</td>
                  <td>{val.tData.date}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </>
  );
};

export default PurchaseList;
