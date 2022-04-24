import React, { useEffect, useState } from "react";
import MaterialTable from "material-table";
import axios from "axios";
import { baseUrl } from '../baseurls';
import Navbar from './Navbar';
import { useContext } from 'react';
import { useNavigate } from "react-router-dom";
import { LoginContext } from '../Context/LoginContext'




const empList = [
    { id: 1, name: "Parnal", email: "parnal@gmail.com", phone: 983092028, city: "Pune" }
]

function Table1() {
    const { token, setToken } = useContext(LoginContext)
    const { email, setEmail } = useContext(LoginContext)
    const [data, setData] = useState([])
    const [testData, setTestData] = useState(empList)
    const [isFetching, setIsFetching] = useState(true)
    const [userName, setUserName] = useState('')

    const token_from_storage = sessionStorage.getItem("token")

    let navigate = useNavigate();

    useEffect(() => {
        if (token_from_storage && token_from_storage != "" && token_from_storage != undefined) {
            setIsFetching(true)
            axios.get(baseUrl + '/vehicles')
                .then((res) => {
                    console.log('fetched: ', res)
                    setData(res.data)
                    setIsFetching(false)
                })
                .catch(err => console.error(`Error: ${err}`))
        }
        else {
            navigate("/login")
        }

    }, []);

    // const columns = [
    //     { title: "ID", field: "id"},
    //     { title: "Name", field: "name" },
    //     { title: "Email", field: "email"},
    //     { title: "Phone", field: "phone"},
    //     { title: "City", field: "city" }
    // ]

    const columns = [
        { title: "ID", field: "id", editable: false },
        { title: "Region", field: "region" },
        { title: "Price", field: "price" },
        { title: "Year", field: "year" },
        { title: "Manufacturer", field: "manufacturer" },
        { title: "Model", field: "model" },
        { title: "Condition", field: "condition" },
        { title: "Cylinders", field: "cylinders" },
        { title: "Fuel", field: "fuel" },
        { title: "Odometer", field: "odometer" },
        { title: "Title Status", field: "title_status" },
        { title: "Transmission", field: "transmission" },
        { title: "Type", field: "type" },
        { title: "Paint Color", field: "paint_color" },
        { title: "State", field: "al" },
        { title: "Lat", field: "lat" },
        { title: "Long", field: "long" },
        { title: "Posting Date", field: "posting_date" },
    ]

    console.log('session token in table: ', token_from_storage)
    console.log('email is: ', email)

    let Table;

    if (email === 'admin@gmail.com') {
        Table =
            <div>
                <MaterialTable
                    title="Data"
                    // data={data}
                    data={data}
                    columns={columns}
                    editable={{
                        onRowAdd: (newRow) => new Promise((resolve, reject) => {
                            console.log(newRow)
                            // const updatedRows = [...data, newRow]
                            setIsFetching(true)
                            axios.post(baseUrl + '/insert', newRow)
                                .then((res) => {
                                    console.log('fetched: ', res)
                                    newRow['id'] = res.data.id
                                    const updatedRows = [...data, newRow]
                                    setData(updatedRows)
                                    setIsFetching(false)
                                })
                                .catch(err => console.error(`Error: ${err}`))
                            resolve()
                        }),
                        onRowDelete: (selectedRow) => new Promise((resolve, reject) => {
                            console.log(selectedRow.tableData.id)
                            const index = selectedRow.tableData.id
                            console.log('index is: ', index)
                            const updatedRows = [...data]
                            console.log('updated row is: ', updatedRows)
                            console.log('selected row is: ', selectedRow)
                            updatedRows.splice(index, 1)
                            console.log('updated row after splicing: ', updatedRows)
                            setIsFetching(true)
                            axios.post(baseUrl + '/delete', selectedRow)
                                .then((res) => {
                                    console.log('fetched: ', res)
                                    setData(updatedRows)
                                    setIsFetching(false)
                                })
                                .catch(err => console.error(`Error: ${err}`))
                            resolve()
                        }),
                        onRowUpdate: (updatedRow, oldRow) => new Promise((resolve, reject) => {
                            console.log("updated row: ", updatedRow)
                            console.log("old row: ", oldRow)
                            const index = oldRow.tableData.id;
                            const updatedRows = [...data]
                            setIsFetching(true)
                            axios.post(baseUrl + '/update', oldRow)
                                .then((res) => {
                                    console.log('fetched: ', res)
                                    updatedRows[index] = updatedRow
                                    setData(updatedRows)
                                    setIsFetching(false)
                                })
                                .catch(err => console.error(`Error: ${err}`))
                            resolve()
                        })
                    }}
                    options={{
                        actionsColumnIndex: -1,
                        addRowPosition: "first"
                    }}
                />
            </div>
    }
    else if (email !== 'admin' && email !== '') {
        Table =
            <div>
                <MaterialTable
                    title="Data"
                    // data={data}
                    data={data}
                    columns={columns}
                    options={{
                        actionsColumnIndex: -1,
                        addRowPosition: "first"
                    }}
                />
            </div>

    }


    return (
        <div>
            <Navbar />

            {
                isFetching === false ?
                    // <div>
                    //     <MaterialTable
                    //         title="Data"
                    //         // data={data}
                    //         data={data}
                    //         columns={columns}
                    //         editable={{
                    //             onRowAdd: (newRow) => new Promise((resolve, reject) => {
                    //                 console.log(newRow)
                    //                 // const updatedRows = [...data, newRow]
                    //                 setIsFetching(true)
                    //                 axios.post(baseUrl + '/insert', newRow)
                    //                     .then((res) => {
                    //                         console.log('fetched: ', res)
                    //                         newRow['id'] = res.data.id
                    //                         const updatedRows = [...data, newRow]
                    //                         setData(updatedRows)
                    //                         setIsFetching(false)
                    //                     })
                    //                     .catch(err => console.error(`Error: ${err}`))
                    //                 resolve()
                    //             }),
                    //             onRowDelete: (selectedRow) => new Promise((resolve, reject) => {
                    //                 console.log(selectedRow.tableData.id)
                    //                 const index = selectedRow.tableData.id
                    //                 console.log('index is: ', index)
                    //                 const updatedRows = [...data]
                    //                 console.log('updated row is: ', updatedRows)
                    //                 console.log('selected row is: ', selectedRow)
                    //                 updatedRows.splice(index, 1)
                    //                 console.log('updated row after splicing: ', updatedRows)
                    //                 setIsFetching(true)
                    //                 axios.post(baseUrl + '/delete', selectedRow)
                    //                     .then((res) => {
                    //                         console.log('fetched: ', res)
                    //                         setData(updatedRows)
                    //                         setIsFetching(false)
                    //                     })
                    //                     .catch(err => console.error(`Error: ${err}`))
                    //                 resolve()
                    //             }),
                    //             onRowUpdate: (updatedRow, oldRow) => new Promise((resolve, reject) => {
                    //                 console.log("updated row: ", updatedRow)
                    //                 console.log("old row: ", oldRow)
                    //                 const index = oldRow.tableData.id;
                    //                 const updatedRows = [...data]
                    //                 setIsFetching(true)
                    //                 axios.post(baseUrl + '/update', updatedRow)
                    //                     .then((res) => {
                    //                         console.log('fetched: ', res)
                    //                         updatedRows[index] = updatedRow
                    //                         setData(updatedRows)
                    //                         setIsFetching(false)
                    //                     })
                    //                     .catch(err => console.error(`Error: ${err}`))
                    //                 resolve()
                    //             })
                    //         }}
                    //         options={{
                    //             actionsColumnIndex: -1,
                    //             addRowPosition: "first"
                    //         }}
                    //     />
                    // </div>
                    <div>{Table}</div>
                    : <h2>Data Loading</h2>
            }
        </div>
    )
}


export default Table1;

