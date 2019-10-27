import React, { Component } from 'react'
import { Image } from 'react-native'

const Logo = () => (
   <Image source = {require('./carbon3logo.png')} />
)
export default Logo

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
