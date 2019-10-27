import React, { Component } from 'react';
import { StyleSheet, Text, View, TextInput, Button, FlatList, } from 'react-native';

export default class Rank extends Component{

  constructor(props){
    super(props);
    /*this.state = {
      data: [ {text:1}, {text:2} ,{text:3} ,{text:4} ],
    }*/
  }
  render(){
    return (
     <View style={styles.container}>
       <FlatList
         data={[
           {key: 'Devin'},
           {key: 'Dan'},
           {key: 'Dominic'},
           {key: 'Jackson'},
           {key: 'James'},
           {key: 'Joel'},
           {key: 'John'},
           {key: 'Jillian'},
           {key: 'Jimmy'},
           {key: 'Julie'},
         ]}
         renderItem={({item}) => <Text style={styles.item}>{item.key}</Text>}
       />
     </View>
   );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
