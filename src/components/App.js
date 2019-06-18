import React, {Component} from 'react';
import '../css/App.css';
import AddAppointments from './AddAppointments'
import ListAppointments from './ListAppointments'
import SearchAppointments from './SearchAppointments'
import { without,findIndex } from "lodash";


class App extends Component {
  constructor(){
    super();
    this.state={
      myAppointments:[],
      formDisplay:false,
      orderBy:'petName',
      orderDir:'asc',
      queryText:'',
      lastIndex:0
    }
  }

  componentDidMount(){
    fetch('./data.json').then(
      response => response.json()
    ).then(
      result =>{
        const appointments = result.map(item => {
          item.aptId= this.state.lastIndex;
          this.setState({
            lastIndex:this.state.lastIndex+1 
          })
          return item;
        })
        this.setState({
          myAppointments:appointments
        })
      }
    );
    this.deleteAppointment=this.deleteAppointment.bind(this);
    this.toggleForm=this.toggleForm.bind(this);
    this.addAppointments=this.addAppointments.bind(this);
    this.changeOrder=this.changeOrder.bind(this);
    this.searchAppointments=this.searchAppointments.bind(this);
    this.updateInfo=this.updateInfo.bind(this);
  }

  addAppointments(apt){
    let tempApt=this.state.myAppointments
    apt.aptId= this.state.lastIndex;
    tempApt.unshift(apt)
    this.setState({
      myAppointments:tempApt,
      lastIndex:this.state.lastIndex+1 
    })
  }

  changeOrder(category,direction){
    this.setState({
      orderBy:category,
      orderDir:direction
    })
  }

  deleteAppointment(apt){
    let tempApt=this.state.myAppointments
    tempApt=without(tempApt, apt)
    this.setState({
      myAppointments:tempApt
    })
  }

  searchAppointments(query){
    this.setState({
      queryText:query
    })
  }

  updateInfo(name,value,id){
    let tempApts = this.state.myAppointments;
    let aptIndex = findIndex(this.state.myAppointments,{
      aptId:id
    })
    tempApts[aptIndex][name]=value
    this.setState({
      myAppointments:tempApts
    })
  }

  toggleForm(){
    this.setState({
      formDisplay: !this.state.formDisplay,
    })
  }

  render() {

    let order;
    let filteredApts=this.state.myAppointments;

    if (this.state.orderDir==='asc') {
      order=1;
    }else{
      order=-1;
    }

    filteredApts=filteredApts.sort((a,b)=>{
      if (a[this.state.orderBy].toLowerCase()<b[this.state.orderBy].toLowerCase()) {
        return -1*order;
      }else{
        return 1*order;
      }
    }
    ).filter(eachItem =>{
      return(
        eachItem['petName'].toLowerCase().includes(this.state.queryText.toLowerCase()) ||
        eachItem['ownerName'].toLowerCase().includes(this.state.queryText.toLowerCase()) ||
        eachItem['aptNotes'].toLowerCase().includes(this.state.queryText.toLowerCase())
      )
    })


    return (
      <main className="page bg-white" id="petratings">
      <div className="container">
        <div className="row">
          <div className="col-md-12 bg-white">
            <div className="container">
              <AddAppointments
                formDisplay={this.state.formDisplay}
                toggleForm={this.toggleForm}
                addAppointments = { this.addAppointments }/>
              <SearchAppointments orderBy={this.state.orderBy} orderDir={this.state.orderDir} changeOrder={this.changeOrder} searchAppointments={this.searchAppointments}/>
              <ListAppointments appointments={filteredApts} deleteAppointment={this.deleteAppointment} updateInfo={this.updateInfo}/>
            </div>
          </div>
        </div>
      </div>
    </main>
    );
  }
}

export default App;
