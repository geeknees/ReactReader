/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  ListView,
  Image,
  Navigator,
  TouchableWithoutFeedback,
  WebView
} from 'react-native';

var QIITA_URL = "https://qiita.com/api/v2/tags/reactjs/items";

var ReactQiitaNavigator = React.createClass({
  render: function() {
    return (
      <Navigator
        style={styles.navigator}
        initialRoute={{ title: 'ReactQiita', index: 0 }}
        renderScene={this.renderScene}
      />
    );
  },
  renderScene: function(route, navigator) {
    if (route.title == 'ReactQiita') {
      return <ReactQiitaList title={route.title} navigator={navigator}/>
    }
    if (route.title == 'Detail') {
      return <ReactQiitaItemView title={route.title} navigator={navigator} url={route.url}/>
    }
  }
})




var ReactQiitaList = React.createClass({
  getInitialState: function() {
    return {
      items: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      }),
      loaded: false,
    };
  },

  componentDidMount: function() {
    this.fetchData();
  },

  render: function() {
    if (!this.state.loaded) {
      return this.renderLoadingView();
    }

    return (
      <ListView
        dataSource={this.state.items}
        renderRow={this.renderItem}
        style={styles.listView}/>
    );
  },

  renderLoadingView: function() {
    return (
      <View style={styles.container}>
        <Text>
          Loading ...
        </Text>
      </View>
    );
  },

  renderItem: function(item, sectionID, rowID) {
    return (
      <TouchableWithoutFeedback onPress={() => this.onPressed(item)}>
      <View style={styles.container}>
        <Image
          source={{uri: item.user.profile_image_url}}
          style={styles.thumbnail}/>
        <View style={styles.rightContainer}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.name}>{item.user.id}</Text>
        </View>
      </View>
      </TouchableWithoutFeedback>
    );
  },

  fetchData: function() {
    fetch(QIITA_URL)
      .then((response) => response.json())
      .then((responseData) => {
        this.setState({
          items: this.state.items.cloneWithRows(responseData),
          loaded: true,
        });
      })
      .done();
  },

  onPressed: function(item) {
    this.props.navigator.push({
      title: 'Detail',
      index: 1,
      url: item.url,
    });
  },
});

var ReactQiitaItemView = React.createClass({
  render: function() {
    return (
      <WebView
        source={{uri: this.props.url}}/>
    )
  }
});

const styles = StyleSheet.create({
  navigator: {
    flex: 1,
  },
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  rightContainer: {
    flex: 1,
  },
  title: {
    fontSize: 15,
    margin: 8,
    textAlign: 'left',
  },
  name: {
    fontSize: 12,
    margin: 8,
    textAlign: 'left',
  },
  thumbnail: {
    width: 80,
    height: 80,
    margin: 2,
  },
  listView: {
    backgroundColor: '#FFFFFF',
  },
});

AppRegistry.registerComponent('ReactReader', () => ReactQiitaNavigator);
