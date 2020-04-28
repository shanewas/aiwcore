import React, { Component } from 'react'
import Card from "react-bootstrap/Card"
import Dropzone from 'react-dropzone';
import {connect} from "react-redux"
import * as Papa from 'papaparse';
import {loadHeaderAction,ChangeHeaderAction} from '../../Store/actions'

 class DatasetLoader extends Component {



    changestatus = (index) =>{
        this.props.changeHeader(index)

    }
    
    fileperse = (file) =>{
        
        let data=file[0]
        let headers=null;
        Papa.parse(data, {
        complete: (results) =>{
         headers=results.data[0]
        this.props.loadHeaders(headers,data.path)
         
        }
        })
        
        
    }

    render() {  
        if(this.props.headers.length === 0)
        {
            return(
                <div>
                    <Card style={{height:"70vh",paddingTop:"22vh"}}>
                    <div className="text-center">
                        
                        <Dropzone accept=".csv" onDrop={acceptedFiles => this.fileperse(acceptedFiles)}>
                        {({getRootProps, getInputProps}) => (
                            <section>
                            <div {...getRootProps()}>
                                <input {...getInputProps()} />
                                <label className="h2 text-center mb-4">
                                No Dataset Selected
                                </label>    
                                <p>Drag & drop some files here, or click to select files</p>
                            </div>
                            </section>
                        )}
                        </Dropzone>
                    </div>
                    </Card>
                </div>
            )
        }
        else{
            return(
                <div>
                    <Card style={{height:"70vh"}}>
                    <div style={{margin:"3vh",textAlign:"center"}}>
                    <h2 className="mb-4">DataSet Columns</h2>
                    {this.props.headers.map((header,index) =>{
                        if(this.props.status[index]==="notSelected")
                        {
                            return(
                                <div  key={index}>
                                <h3><button onClick={() => this.changestatus(index)} className=" btn btn-danger btn-lg text-center">{index+1}.  {header}</button></h3>
                                </div>
                                )   
                        }
                        else if (this.props.status[index]==="changing")
                        {
                            return(
                                <div  key={index}>
                                <h3><button onClick={() => this.changestatus(index)} className="btn btn-warning btn-lg text-center">{index+1}.  {header}</button></h3>
                                </div>
                                )   
                        }
                        else 
                        {
                            return(
                                <div  key={index}>
                                <h3><button onClick={() => this.changestatus(index)} className="btn btn-success btn-lg text-center">{index+1}.  {header}</button></h3>
                                </div>
                                )   
                        }
                        
                    })}                    
                    </div>
                    </Card>
                </div>
            )
        }
    }
}

const mapStateToProps=(state)=>{
    return{
        datasets:state.datasets,
        headers:state.headers,
        status:state.status,

    }
}
const mapDispathtoProps=(dispatch)=>{
    return {
        loadHeaders:(headers,path)=> {dispatch(loadHeaderAction(headers,path))},
        changeHeader:(index)=> {dispatch(ChangeHeaderAction(index))},
    }
} 

export default connect(mapStateToProps,mapDispathtoProps)(DatasetLoader)