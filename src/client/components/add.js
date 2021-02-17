import React from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import ReactQuill from 'react-quill'; // ES6
import 'react-quill/dist/quill.snow.css'; // ES6

export default class Editor extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
       editorHtml: '',
       theme: 'snow',
       title:'',
       tags:''

     }
    this.handleChange = this.handleChange.bind(this)
    this.handleChange2 = this.handleChange2.bind(this)
    this.addArticle = this.addArticle.bind(this)
  }

  handleChange2 (html) {
  	this.setState({ editorHtml: html });
  }

  addArticle(){
    var date = new Date().getDate(); //Current Date
  var month = new Date().getMonth() + 1; //Current Month
  if(month<10){
    month = "0"+month;
  }
  var year = new Date().getFullYear(); //Current Year
  var hours = new Date().getHours(); //Current Hours
  var min = new Date().getMinutes(); //Current Minutes
  var sec = new Date().getSeconds(); //Current Seconds
  var FullDate = date + "." + month + "." + year;
    fetch('/api/addArticle', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      title: this.state.title,
      editorHtml: this.state.editorHtml,
      tags:this.state.tags,
      date:FullDate
    }),
  })
  .then(resp => resp.json())
  .then(resp => {
    alert("Done")
  });
  }

  handleChange(event) {
    const target = event.target;
    var value = target.value;
    var name = target.name;
    this.setState({
     [name]: value
    });
    if(value.length>10000 && name=="text"){
      this.setState({ maxText: 'Przekroczono maksymalny rozmiar opisu!', maxColor:'red' })
    }
    if(this.state.maxText=="Przekroczono maksymalny rozmiar opisu!" && value.length<10000 && name=="text"){
      this.setState({ maxText: 'Maksymalny rozmiar opisu',  maxColor:'black'  })
    }
  }

  handleThemeChange (newTheme) {
    if (newTheme === "core") newTheme = null;
    this.setState({ theme: newTheme })
  }

  render () {
    return (
      <div>
        <ReactQuill
          theme={this.state.theme}
          onChange={this.handleChange2}
          value={this.state.editorHtml}
          modules={Editor.modules}
          formats={Editor.formats}
          bounds={'.app'}
          placeholder={'this.props.placeholder'}
         />

        <div className="themeSwitcher">
          <label>Theme </label>
          <select onChange={(e) =>
              this.handleThemeChange(e.target.value)}>
            <option value="snow">Snow</option>
            <option value="bubble">Bubble</option>
            <option value="core">Core</option>
          </select>
        </div>

        <div>
          <input type="text" value={this.state.value} placeholder="title" onChange={this.handleChange} class="addInput" name="title"/>
          <input type="text" value={this.state.value} placeholder="tags" onChange={this.handleChange} class="addInput" name="tags"/>
          <button onClick={this.addArticle} class="addInput">Dodaj</button>
        </div>
       </div>

     )
  }
}

/*
 * Quill modules to attach to editor
 * See https://quilljs.com/docs/modules/ for complete options
 */
Editor.modules = {
  toolbar: [
    [{ 'header': '1'}, {'header': '2'}, { 'font': [] }],
    [{size: []}],
    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
    [{'list': 'ordered'}, {'list': 'bullet'},
     {'indent': '-1'}, {'indent': '+1'}],
    ['link', 'image', 'video'],
    ['clean']
  ],
  clipboard: {
    // toggle to add extra line breaks when pasting HTML:
    matchVisual: false,
  }
}
/*
 * Quill editor formats
 * See https://quilljs.com/docs/formats/
 */
Editor.formats = [
  'header', 'font', 'size',
  'bold', 'italic', 'underline', 'strike', 'blockquote',
  'list', 'bullet', 'indent',
  'link', 'image', 'video'
]

/*
 * PropType validation
 */
