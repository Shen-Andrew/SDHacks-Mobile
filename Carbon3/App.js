import React, { Component } from 'react';
import { StyleSheet, Text, View, TextInput, Button, FlatList, Picker, ScrollView } from 'react-native';
import Rank from './rank.js';

export default class UserInput extends Component{


  constructor(props) {
    super(props);

    this.state = {product: '',
                  dailyCO2: 42 ,
                  weeklyCO2: 32,
                  items: [],
                  number: '0',
                  glance1 : 'Your carbon foot print for today is ',
                  glance2 : 'Your carbon foot print for this week is ',
                 };


  }

  componentDidMount(){
    return fetch('https://murmuring-lake-39323.herokuapp.com/graphql', {
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

  buildItemPicker() {
    let items = [];
    for( let i = 0; i < this.state.items.length; i++) {
      items.push(
        <Picker.Item label={this.state.items[i].description} value={this.state.items[i].id} key={this.state.items[i].id} style={{}}/>
      )
    }
    return items;
  }

  render(){
    return(
      <ScrollView>

        <View style={styles.container}>
          <Text style={styles.glanceText}>{this.state.glance1}
                {this._getDailyEntry()}</Text>
          <Text style={styles.glanceText}>{this.state.glance2}
                {this._getWeeklyEntry()}</Text>
        </View>


        <View style={styles.container2}>
        <Text> Choose item purchased </Text>
        <Picker
          selectedValue={this.state.product}
          style={{height: 50, width: 100}}
          onValueChange={(itemValue, itemIndex) =>
          this.setState({product: itemValue})
         }>
         { this.buildItemPicker() }
       </Picker>
       </View>

       <View style={styles.container3}>
       <Text> Enter quantity of items purchased </Text>
       <TextInput
           placeholder=" "
           style={styles.TextInputStyle}
           onChangeText={(number) => this.setState({number})}
           value={this.state.number}
        />
        </View>

        <Button
            onPress={this._onPressButton}
            title="Enter"
            style= {styles.buttonStyle}/>
      </ScrollView>
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

  _onPressButton() {
    alert("Your response has been recorded");
    this._postEntry;
  }

  /*Post response on api*/
  _postEntry = async () => {

    let transaction = {
      studentID: "1234567",
      itemID: this.state.product,
      itemQuantity: this.state.number
    }

    fetch('https://murmuring-lake-39323.herokuapp.com/graphql', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body:  {
        transaction
      },
    });
  }


}
const styles = StyleSheet.create({
  glanceText: {
    //fontFamily: 'Cochin',
    fontSize:20,
    flex: 1,
    //flexDirection:'row',
    padding: 25,
    justifyContent: 'space-between',//use flex-start, flex-end ,center to adjust vertical position
    alignItems:'flex-end',//use flex-start, flex-end ,center to adjust horizontal position
    backgroundColor: '#ffffff',
    color: 'green',
  },
  titleText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  container: {
  flex: 1,
  padding:10,
  //padding: ,
  flexDirection:'column',
  justifyContent: 'space-between',//use flex-start, flex-end ,center to adjust vertical position
  alignItems:'center',//use flex-start, flex-end ,center to adjust horizontal position
  backgroundColor: '#ffffff',
  },
  container2: {
  flex: 3,
  flexDirection:'row',
  padding:10,
    //padding: ,
  justifyContent: 'space-between',//use flex-start, flex-end ,center to adjust vertical position
  alignItems:'center',//use flex-start, flex-end ,center to adjust horizontal position
  backgroundColor: '#83bec4',
  },
  container3: {
  
  //flexDirection:'row',
  padding:10,
    //padding: ,
  justifyContent: 'space-between',//use flex-start, flex-end ,center to adjust vertical position
  alignItems:'center',//use flex-start, flex-end ,center to adjust horizontal position
  backgroundColor: '#83bec4',
  },
});

/*const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonStyle: {
    backgroundColor: '#eee',
    fontSize:50,
    alignItems: 'center',
  },
  firstGlance: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    fontSize: 50,
    justifyContent: 'center',
  },
});*/
