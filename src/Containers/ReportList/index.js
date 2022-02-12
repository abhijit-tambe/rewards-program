import React, { useState, useEffect } from "react";
import service from "../../service";
import { Button } from "react-bootstrap";

const ReportList = () => {
  const [rawData, setRawData] = useState([]);
  const [userData, setUserData] = useState({});
  const [reportData, setReportData] = useState([]);
  const [showReport, setShowReport] = useState(false);
  const [loading, setLoading] = useState(true);

  const quarter = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [9, 10, 11],
  ];

  const calculateReport = () => {
    console.log("userData", userData);
    if (!showReport) {
      let quarterSum = [];
      userData.forEach((u) => {
        for (let i = 0; i < quarter.length; i++) {
          let sumPoints = 0;
          //points per quarter
          let name;
          let userId;
          u.forEach((v) => {
            name = v.name;
            userId = v.userId;
            if (quarter[i].includes(v.month)) {
              sumPoints += v.points;
            }
          });
          if (sumPoints > 0) {
            quarterSum.push({ sumPoints, name, userId, quarter: i });
          }
        }
      });
      setReportData(quarterSum);
      setShowReport(true);
    } else {
      setShowReport(false);
    }
  };

  const computeValues = (d) => {
    const month = new Date(d.date).getMonth();
    let points = 0;
    const overHundred = d.amount - 100;

    if (d.amount > 50 && d.amount > 100) {
      points += 50;
    }
    if (d.amount > 50 && d.amount < 100) {
      points += 100 - 50;
    }
    if (d.amount > 100) {
      points += 2 * overHundred;
    }

    return { month, points };
  };

  const userDataPreprocessing = () => {
    let userIds = new Set();
    rawData.data.forEach((t) => {
      userIds.add(t.tData.userId);
    });
    let userMap = new Map();
    rawData.data.forEach((t) => {
      let id = t.tData.userId;
      let additionalData = computeValues(t.tData);

      if (userMap.has(id)) {
        userMap.set(id, [
          ...userMap.get(id),
          { ...additionalData, ...t.tData },
        ]);
      } else {
        userMap.set(id, [{ ...additionalData, ...t.tData }]);
      }
    });
    setUserData(userMap);
  };

  useEffect(() => {
    service().then((d) => {
      setRawData(d);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (!loading) {
      userDataPreprocessing();
    }
  }, [loading]);

  return (
    <>
      <Button style={{ margin: 50 }} onClick={() => calculateReport()}>
        {showReport ? `Hide Reward List` : "Show Reward List"}
      </Button>
      {showReport && (
        <>
          <h1>Quarterly Reward list for 2021</h1>
          <table className={"table table-striped"}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Quarter</th>
                <th>Points Earned</th>
              </tr>
            </thead>
            <tbody>
              {reportData.map((val, key) => {
                return (
                  <tr key={key}>
                    <td>{val.name}</td>
                    <td>{`Q${val.quarter + 1}`}</td>
                    <td>{val.sumPoints}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </>
      )}
    </>
  );
};

export default ReportList;
