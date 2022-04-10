import React, { Component } from "react";
import MaterialTable from "material-table";

// const empList = [
//     { id: 1, name: "Parnal", email: "parnal@gmail.com", phone: 983092028, city: "Pune" }
// ]
const test1 = 'hjelsls'

class Table extends Component {

    // constructor(props) {
    //     super(props);
    //     this.state = {
    //         data: this.empList,
    //         columns: this.columns,
    //         test: this.test,
    //         test1: test1
    //     }
    // }
    state = {
        data: this.empList,
        columns: this.columns,
        test: this.test,
        test1: test1
    }

    empList = [
        { id: 1, name: "Parnal", email: "parnal@gmail.com", phone: 983092028, city: "Pune" }
    ]



    columns = [
        { title: "ID", field: "id", },
        { title: "Name", field: "name", },
        { title: "Email", field: "email", },
        { title: "Phone", field: "phone", },
        { title: "City", field: "city", },

    ]

    test = 'test';



    render() {

        // const empList = [
        //     { id: 1, name: "Parnal", email: "parnal@gmail.com", phone: 983092028, city: "Pune" }
        // ]

        // const test = 'test';


        // const columns = [
        //     { title: "ID", field: "id", },
        //     { title: "Name", field: "name", },
        //     { title: "Email", field: "email", },
        //     { title: "Phone", field: "phone", },
        //     { title: "City", field: "city", },

        // ]

        console.log('state is: ', this.state)
        return (
            <div>
                {/* <h1>Hello!</h1> */}
                <h4 align='center'> Table Comp! </h4>
                {/* <h1>{this.state.test}</h1>
                <h1>{this.state.test1}</h1>
                <h1>{this.state.data[0].name}</h1> */}
                
                
                {/* <MaterialTable
                title = "Data"
                data={this.state.data}
                columns={this.state.columns}

                /> */}
            </div>
        )
    }
}

export default Table;

