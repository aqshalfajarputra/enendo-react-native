import React, {constructor, Component, useRef} from 'react';
import {
  View,
  Image,
  ScrollView,
  Dimensions,
  StatusBar,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import {Button, Card, TextInput, Text} from 'react-native-paper';
import HeaderImageScrollView, {
  TriggeringView,
} from 'react-native-image-header-scroll-view';
import * as Animatable from 'react-native-animatable';
import {useQuery, gql} from '@apollo/client';
import {AuthContext} from '../../auth/AuthContext';
import AsyncStorage from '@react-native-community/async-storage';
import Config from 'react-native-config';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

import * as loginActions from 'app/actions/loginActions';
import styles from './styles';

export default function Home({navigation}) {
  const productQuery = gql`
    query {
      all_product {
        id
        name
        price
        image_1
        product_no
      }
    }
  `;

  const {data, error, loading} = useQuery(productQuery, {
    onError(e) {
      console.log('errorr', e);
    },
    onCompleted() {
      // console.log('ini data', data);
    },
  });

  const URI = Config.API_URL;
  let image_location = URI + 'assets/img/product';
  // console.log('location', image_location);
  const Item = ({item, onPress, style}) => {
    let product_no = item.product_no.replace('/', '-');
    let url = image_location + '/' + product_no + '/' + item.image_1;
    // console.log('url', url);
    return (
      <View
        style={[
          styles.cardProduct,
          {position: 'relative', marginVertical: 20},
        ]}>
        <TouchableOpacity
          style={{height: 260}}
          onPress={() => {
            onPress();
          }}>
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              width: 150,
              height: 150,
            }}>
            <Image
              source={{uri: url}}
              style={{
                justifyContent: 'center',
                marginTop: 0,
                width: 140,
                height: 140,
                resizeMode: 'contain',
              }}
            />
          </View>
          <View
            style={[
              styles.cardProductDetail,
              {
                backgroundColor: '#ff7e00',
                position: 'absolute',
                bottom: 0,
                height: 110,
              },
            ]}>
            <View
              style={[
                {
                  position: 'absolute',
                  bottom: 55,
                  padding: 15,
                  height: 55,
                },
              ]}>
              <Text style={{color: 'white', fontSize: 12, fontWeight: '100'}}>
                {item.name}
              </Text>
            </View>
            <View
              style={[
                {
                  position: 'absolute',
                  bottom: 0,
                  padding: 15,
                  height: 55,
                },
              ]}>
              <Text
                style={{
                  color: 'white',
                  fontSize: 14,
                  fontWeight: 'bold',
                  left: 0,
                }}>
                Rp{numberWithCommas(item.price)}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  const renderItem = ({item}) => {
    return (
      <Item
        item={item}
        onPress={() => {
          navigation.navigate('Product', {
            id: item.id,
          });
        }}
      />
    );
  };

  const numberWithCommas = (x) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const renderPlaceholder = () => {
    return (
      <View
        style={[
          styles.cardProduct,
          {position: 'relative', marginVertical: 20},
        ]}>
        <View style={{height: 260}}>
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              width: 150,
              height: 150,
            }}>
            <SkeletonPlaceholder>
              <View
                style={{
                  justifyContent: 'center',
                  marginTop: 0,
                  width: 140,
                  height: 140,
                }}
              />
            </SkeletonPlaceholder>
          </View>
          <View
            style={[
              styles.cardProductDetail,
              {
                backgroundColor: '#ff7e00',
                position: 'absolute',
                bottom: 0,
                height: 110,
                padding: 20,
                justifyContent: 'center',
              },
            ]}>
            <SkeletonPlaceholder backgroundColor="#ffa042">
              <View
                style={{
                  height: 20,
                  marginBottom: 15,
                  borderRadius: 4,
                }}
              />
              <View
                style={{
                  height: 20,
                  marginBottom: 15,
                  borderRadius: 4,
                }}
              />
            </SkeletonPlaceholder>
          </View>
        </View>
      </View>
    );
  };

  const placeholders = {
    product: [0, 1, 2],
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/img_header.jpg')}
        style={[styles.image, {position: 'absolute'}]}
      />
      <ScrollView contentContainerStyle={styles.container}>
        <View style={[styles.container, {}]}>
          <Card
            style={[
              styles.cardBoard,
              {top: 350, paddingTop: 10, paddingHorizontal: 0},
            ]}>
            <Card.Title title="Product" style={{marginLeft: 15}} />
            <Card.Content
              style={{
                flex: 1,
                flexDirection: 'column',
                marginHorizontal: 0,
                paddingHorizontal: 0,
              }}>
              <View style={{flex: 1, flexDirection: 'row', marginBottom: 20}}>
                {data ? (
                  <FlatList
                    data={data.all_product}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id}
                    horizontal={true}
                  />
                ) : (
                  <FlatList
                    data={placeholders.product}
                    renderItem={renderPlaceholder}
                    horizontal={true}
                  />
                )}
              </View>
              <View
                style={{
                  height: 1000,
                  width: '100%',
                  left: 0,
                  marginHorizontal: 0,
                  paddingHorizontal: 0,
                  backgroundColor: 'brown',
                }}
              />
            </Card.Content>
          </Card>
        </View>
      </ScrollView>
    </View>
  );
}
