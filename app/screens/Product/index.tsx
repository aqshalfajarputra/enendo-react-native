import React, {
  constructor,
  Component,
  useRef,
  useState,
  useEffect,
} from 'react';
import {
  View,
  Image,
  ScrollView,
  Dimensions,
  StatusBar,
  FlatList,
} from 'react-native';
import {Button, Card, TextInput, Text} from 'react-native-paper';
import HeaderImageScrollView, {
  TriggeringView,
} from 'react-native-image-header-scroll-view';
import * as Animatable from 'react-native-animatable';
import {useQuery, gql} from '@apollo/client';
import {AuthContext} from '../../auth/AuthContext';
import AsyncStorage from '@react-native-community/async-storage';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import Config from 'react-native-config';

import * as loginActions from 'app/actions/loginActions';
import styles from './styles';

export default function Product({route, navigation}) {
  const {id} = route.params;
  console.log('id', id);
  const productQuery = gql`
    query($id: String!) {
      product(id: $id) {
        id
        name
        description
        price
        image_1
        image_2
        image_3
        product_no
        qty
      }
    }
  `;
  let [checkUrl, setCheckUrl] = useState('');
  const URI = Config.API_URL;
  let image_location = URI + 'assets/img/product';
  const {data, error, loading} = useQuery(productQuery, {
    variables: {id},
  });

  useEffect(() => {
    const onCompleted = (data) => {
      // console.log('ini dataaaa', data);
      let product_no = data.product.product_no.replace('/', '-');
      let url = `${image_location}/${product_no}/${data.product.image_1}`;
      setCheckUrl(url);
      console.log('url', checkUrl);
    };
    const onError = (error) => {
      return <div>{error}</div>;
    };
    if (onCompleted || onError) {
      if (onCompleted && !loading && !error) {
        onCompleted(data);
      } else if (onError && !loading && error) {
        onError(error);
      }
    }
  }, [loading, data, error, image_location, checkUrl]);

  console.log('dataaa', checkUrl);

  return (
    <View style={styles.container}>
      {checkUrl ? (
        <Image
          source={{uri: checkUrl}}
          style={[styles.image, {position: 'absolute', zIndex: 2}]}
        />
      ) : (
        <View
          style={[
            styles.cardProduct,
            {width: 200, height: 500, backgroundColor: 'gray'},
          ]}
        />
      )}
      <ScrollView contentContainerStyle={[styles.container, {width: '100%'}]}>
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
    // <ScrollView contentContainerStyle={styles.container}>
    //   <View style={[styles.container, {width: '100%'}]}>
    //     <Card
    //       style={[styles.cardBoard, {paddingTop: 10, paddingHorizontal: 0}]}>
    //       <Card.Title title="Product" style={{marginLeft: 15}} />
    //       <Card.Content
    //         style={{
    //           flex: 1,
    //           flexDirection: 'column',
    //           marginHorizontal: 0,
    //           paddingHorizontal: 0,
    //         }}>
    //         <View style={{flex: 1, flexDirection: 'row', marginBottom: 20}}>
    //           <View
    //             style={[
    //               styles.cardProduct,
    //               {position: 'relative', marginTop: 30},
    //             ]}>
    //             <View
    //               style={{
    //                 justifyContent: 'center',
    //                 alignItems: 'center',
    //                 width: 120,
    //                 height: 120,
    //               }}>
    //               <View
    //                 style={{
    //                   justifyContent: 'center',
    //                   width: 110,
    //                   height: 110,
    //                   backgroundColor: 'gray',
    //                 }}
    //               />
    //             </View>
    //             <View
    //               style={[
    //                 styles.cardProductDetail,
    //                 {position: 'absolute', bottom: 0},
    //               ]}>
    //               <Text style={{color: 'white'}}>test</Text>
    //             </View>
    //           </View>
    //         </View>
    //         <View
    //           style={{
    //             height: 1000,
    //             width: '100%',
    //             left: 0,
    //             marginHorizontal: 0,
    //             paddingHorizontal: 0,
    //             backgroundColor: 'brown',
    //           }}
    //         />
    //       </Card.Content>
    //     </Card>
    //   </View>
    // </ScrollView>
  );
}
