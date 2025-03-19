import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Viewusers = () => {
    const [data, changeData] = useState([]); 

 

    const fetchData = () => {
      axios.get("https://carrentbackend-1-tpmm.onrender.com/viewuser", { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
       
      ).then(
          (response) => {
              console.log("API Response:", response.data);
              if (Array.isArray(response.data) && response.data.length > 0) {
                  changeData(response.data);
              } else {
                  console.error("API returned empty or invalid data.");
                  changeData([]); 
              }
          }
      ).catch(
          (error) => {
              console.error("Error fetching data:", error.message);
          }
      );
  };
  
    useEffect(() => { fetchData(); }, []);

    return (
        <div>
            <div className="container">
                <div className="row">
                    <div className="col col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th scope="col">name</th>
                                    <th scope="col">email</th>
                                    <th scope="col">phone</th>
                                    <th scope="col">gender</th>
                                    <th scope="col">password</th>
                                    
                                </tr>
                            </thead>
                            <tbody>
                                {Array.isArray(data) && data.length > 0 ? (
                                    data.map((value) => (
                                        <tr key={value._id}>
                                            <td>{value.name}</td>
                                            <td>{value.email}</td>
                                            <td>{value.phone}</td>
                                            <td>{value.gender}</td>
                                            <td>{value.password}</td>
                                           
                                            <td>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="9" className="text-center">No Residents Found</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Viewusers;
