import React, { Component } from 'react';
import Upload from './Upload'
export default class App extends Component {
  constructor(props){
    super(props)
    this.state={
      files:[]
    }
  }
 async componentDidMount(){
   fetch('/getdata',{mode: 'no-cors'}).then(res=>res.json()).then(data=>{
     this.setState({
       files:data
     })
   })
 }
  render() {
    return (
      <div className='container'>
        <div className='row'>
        <div className='col-md-6 m-auto'>
        <h1 className='text-center display-4 my-4'>File Manager</h1>
        <Upload/>
        <hr/>
        {this.state.files.map((file,index)=>{
          if(file.isImage){
        return <div key={file._id} className='card card-body mb-3'>
           <a href={'http://localhost:8080/getfile/'+file.filename} target='_blank'>
            <img className='img img-responsive' alt='File must exist' width='100%' src={'/getfile/'+file.filename}/></a>
            <form action={'files/'+file._id+'?_method=DELETE'} method='post'>
            <button className="btn btn-danger btn-block mt-4">DELETE</button>            
            </form>
          </div>
          }
          else
          {
          return <div key={file._id} className='card card-body mb-3'>
            <a href={'http://localhost:8080/getfile/'+file.filename} target='_blank'>{file.filename}</a>
            <form action={'files/'+file._id+'?_method=DELETE'} method='post'>
            <button className="btn btn-danger btn-block mt-4">DELETE</button>            
            </form>
           </div>
          }
        })}
        </div>
        </div>
      </div>
    );
  }
}


