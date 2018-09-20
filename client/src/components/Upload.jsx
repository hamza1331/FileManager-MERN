import React, { Component } from 'react'

export default class Upload extends Component {
  constructor(props)
  {
    super(props)
    this.handleFile=this.handleFile.bind(this)
    this.handleSubmit=this.handleSubmit.bind(this)
    this.state={
      file:''
    }
  }
  handleFile(e){
    this.setState({
      [e.target.name]:e.target.files[0]
    })
  }
  handleSubmit(e){
    e.preventDefault()
    if(this.state.file!==''){
      const formData = new FormData()
      formData.append('file',this.state.file)
      fetch('http://localhost:8080/upload',{
        method:'POST',
        body:formData,
        mode:'no-cors'
      }).then(window.location='http://localhost:3000')
    }
  }
  render() {
    return (
        <form>
                <div className="custom-file mb-3">
                    <input type="file" multiple={false} onChange={this.handleFile} name="file" id="file" className="custom-file-input"/>
                    <label htmlFor="file" className="custom-file-label">File Submit</label>
                </div>
                <input type="submit" value="Submit" onClick={this.handleSubmit} className="btn btn-info btn-block"/>
        </form>
    )
  }
}
