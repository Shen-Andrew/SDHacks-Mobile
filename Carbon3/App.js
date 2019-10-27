import React, { Component } from 'react';
import { Image, StyleSheet, Text, View, TextInput, Button, FlatList, Picker, ScrollView, KeyboardAvoidingView } from 'react-native';
//import Logo from './logo.js'

const API = "https://murmuring-lake-39323.herokuapp.com/graphql";

export default class UserInput extends Component{


  constructor(props) {
    super(props);

    this.state = {product: '',
                  dailyCO2: 0 ,
                  weeklyCO2: 0,
                  items: [],
                  number: '0',
                  glance1 : '  Your carbon foot print for today is ',
                  glance2 : '  Your carbon foot print for this week is ',
                 };


  }

  componentDidMount(){
    this.getWeeklyCO2();
    return fetch(API, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body:  JSON.stringify({
        "query": "query($ids: [String]) { items(ids: $ids) { id description category price } }"
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        this.setState({
          items: res.data.items
        });
      })
      .catch(err => console.error(err));
  }

    /*Post response on api*/
    _postEntry() {
      fetch('https://murmuring-lake-39323.herokuapp.com/graphql', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body:  JSON.stringify({
          "query": "mutation($transaction: TransactionInput!) { addTransaction(transaction: $transaction) { id timestamp }}",
          "variables": {
            "transaction": {
              "studentID": "A16088803",
            "items": [{
              id: this.state.product,
              qty: +this.state.number
            }],
            "vendorID": "5db53e007f6c5700179ba3be"
            }
          }
        })
      })
      .then(res => res.json())
      .then((res) => console.log(res));
    }
  

  async getWeeklyCO2(){
    let res = await fetch(API, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body:  JSON.stringify({
        "query": "query ($studentID: String, $start: String, $end: String) { transactions(studentID: $studentID, start: $start, end: $end) { items { category qty price } } }",
        "variables": {
          "studentID": "A16088803",
          "end": Date.now().toString(),
          "start": (Date.now() - 604800000).toString()
        }
      }),
    });
    data = await res.json();
    let categories = data.data.transactions
    .reduce((acc, curr) => {
      curr.items.forEach(item => {
        if(!acc[item.category]) {
          acc[item.category] = 0;
        }
        acc[item.category] += (item.qty * item.price)
      })
      return acc;
    }, {})

    categories = Object.keys(categories).map(key => {
      return {
        type: key,
        dollarsSpent: categories[key]
      }
    })
    let res2 = await fetch(API, {
      method: "POST",
      headers: {
        "Content-Type": 'application/json'
      },
      body: JSON.stringify({
        "query": "query ($categories: [CategoryInput]) { getUserCO2(categories: $categories) { totalCO2Emissions totalDollarsSpent breakdown { type dollarsSpent CO2Emissions } } }",
        "variables": {
          categories: categories
        }
      })
    })

    data = await res2.json();

    let d = data.data.getUserCO2;
    this.setState({
      weeklyCO2: d.totalCO2Emissions
    })
  }

  async getDailyCO2(){
    let res = await fetch(API, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body:  JSON.stringify({
        "query": "query ($studentID: String, $start: String, $end: String) { transactions(studentID: $studentID, start: $start, end: $end) { items { category qty price } } }",
        "variables": {
          "studentID": "A16088803",
          "end": Date.now().toString(),
          "start": (Date.now() - 86400000).toString()
        }
      }),
    });
    data = await res.json();
    let categories = data.data.transactions
    .reduce((acc, curr) => {
      curr.items.forEach(item => {
        if(!acc[item.category]) {
          acc[item.category] = 0;
        }
        acc[item.category] += (item.qty * item.price)
      })
      return acc;
    }, {})

    categories = Object.keys(categories).map(key => {
      return {
        type: key,
        dollarsSpent: categories[key]
      }
    })
    let res2 = await fetch(API, {
      method: "POST",
      headers: {
        "Content-Type": 'application/json'
      },
      body: JSON.stringify({
        "query": "query ($categories: [CategoryInput]) { getUserCO2(categories: $categories) { totalCO2Emissions totalDollarsSpent breakdown { type dollarsSpent CO2Emissions } } }",
        "variables": {
          categories: categories
        }
      })
    })

    data = await res2.json();

    let d = data.data.getUserCO2;
    this.setState({
      dailyCO2: d.totalCO2Emissions
    })
  }


  buildItemPicker() {
    let items = [];
    for( let i = 0; i < this.state.items.length; i++) {
      items.push(
        <Picker.Item label={this.state.items[i].description} value={this.state.items[i].id} key={this.state.items[i].id} />
      )
    }
    return items;
  }

  render(){
    return(
      <KeyboardAvoidingView style={styles.container} behavior="padding" enabled>
              <View style={{flex: 1}}>

{/*This contains the app name*/}
<View style={styles.appView}>
 <Text style={styles.appName}>Carbon3</Text> 
</View> 

<Text></Text>

{/*This contains the firstGlance*/}
 <View style={styles.elements }>
  <Text style ={styles.titleText}>At A Glance</Text>
</View>

<View style={styles.glanceContainer}>
  <View style={styles.glanceView}>
    <Text></Text>
  <Text style={styles.glanceText}>{this.state.glance1}
        {this.state.dailyCO2.toFixed(2)} CO2/kg</Text>
  </View>
  <View style={styles.glanceView}>
  <Text style={styles.glanceText}>{this.state.glance2}
        {this.state.weeklyCO2.toFixed(2)} CO2/kg</Text>
  </View>
</View>


<Text></Text>


{/*This contains the Input purchase*/}
<View style={styles.elements}>
  <Text style ={styles.titleText}>Input Purchase</Text>
</View>

<View style={styles.container2}>
  <View style = {styles.input}>
    <Text style ={ {fontSize: 20}}> Item purchased </Text>
  </View>

  <View style ={styles.input3}>
    <Picker
    selectedValue={this.state.product}
    style={{height: 30, width: 300, alignItems:'stretch', justifyContent:'space-between'}}
    onValueChange={(itemValue, itemIndex) =>
    this.setState({product: itemValue})
    }>
    { this.buildItemPicker() }
    </Picker>
  </View> 
</View>

<View style={styles.inputContainer}>
 <View style = {styles.inputLabel}>
 <Text style={{fontSize:20}}> 
   Quantity of items purchased </Text>
 </View>

 <View style = {styles.inputSquare}>
 <TextInput
     placeholder=" "
     style={{fontSize:20, borderWidth: 2, paddingLeft: 10, width: 30, height:30}}
     onChangeText={(number) => this.setState({number})}
     value={this.state.number}
  />
</View>
</View>
<View style={styles.buttonStyle}>
<Button
    onPress={this._onPressButton}
    title="Enter"
    color="#ffff"
    style = {{fontSize: 50}}
    />
</View>


<View style={styles.logoSpace}>
  <Image source={ require('./carbon3logo.png')} style={{height:100 , width:100}}/>           
</View>
</View>
      </KeyboardAvoidingView>
    );
  }

  /*Get total carbon emmsions for the week*/
  _getDailyEntry(){
    return this.state.dailyCO2;
  }
  /*Get total carbon emmsions for the week*/
  _getWeeklyEntry(){
    return this.state.weeklyCO2;
  }

  _onPressButton = () => {
    alert("Your response has been recorded");
    this._postEntry();
  }
}
const styles = StyleSheet.create({
  appView:{
    flex: 2,
    color: 'green',
    justifyContent: 'center',//use flex-start, flex-end ,center to adjust vertical position
    alignItems:'center',//use flex-start, flex-end ,center to adjust horizontal position
    backgroundColor: '#7ce2c4'
  },
  appName: {
    fontSize: 50,
    color: 'white',
    fontWeight: 'bold',
    justifyContent: 'flex-end',//use flex-start, flex-end ,center to adjust vertical position
    alignItems:'flex-end',//use flex-stat, flex-end ,center to adjust horizontal position
  },

  glanceView:{
    justifyContent: 'flex-end',
    alignItems:'center',
    flex: 1,
    backgroundColor: '#c1f1dd',
    //justifyContent: 'center',//use flex-start, flex-end ,center to adjust vertical position
    alignItems:'flex-start',//use flex-start, flex-end ,center to adjust horizontal position
  },
  glanceContainer: {
    flex: 2,
    backgroundColor: '#83bec4',
    justifyContent: 'center',//use flex-start, flex-end ,center to adjust vertical position
    alignItems:'stretch',//use flex-start, flex-end ,center to adjust horizontal position
  },
  glanceText: {
    justifyContent:'center',
    alignItems:'center',
    fontSize:15,
    flex: 1,
    color: 'black',
  },


  titleText: {
    fontSize: 30,
    color:'white',
    fontWeight: 'bold',
  },

  input:{
    flex: 1,
    fontSize:30,
    flexDirection:'row',
    justifyContent: 'space-between',
    alignItems:'center'
  },
  input3:{
    flex: 6,
    flexDirection:'row',
    justifyContent: 'space-around',
    alignItems:'flex-start'
  },

  logoSpace:{
    flex:2,
    alignItems:'center',
    justifyContent:'center'
  },

  buttonStyle:{
    flex: 1,
    flexDirection:'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#3ed1b9'
  },
  
  inputSquare:{
    flex: 1,
    flexDirection:'row',
    justifyContent: 'center',
    alignItems:'center',
    backgroundColor: '#c1f1dd',
  },
  inputLabel:{
    flex: 2,
    flexDirection:'row',
    justifyContent: 'flex-end',
    alignItems:'center',
    backgroundColor: '#c1f1dd'
  },
  inputContainer: {
    flex: 1,
    flexDirection:'row',
    //padding:10,
    backgroundColor: '#83bec4',
  },

  container: {
  flex: 2,
  padding:10,
  backgroundColor: '#131a38',
  },
  container2: {
    flex: 4,
    flexDirection:'column',
    padding:10,
    backgroundColor: '#ffffff',
  },

  elements: {
    flexDirection:'row',
    justifyContent: 'space-between',
    alignItems:'center',
    flex: 1,
    padding: 5,
    backgroundColor: '#7ce2c4',
    },
});

