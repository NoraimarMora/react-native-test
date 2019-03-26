import React from 'react';
import { Alert, Button, Image, Modal, ScrollView, Slider, StyleSheet, Text, TextInput, View } from 'react-native';
import { ImagePicker } from 'expo';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        titulo: '',
        texto: '',
        rating: 1,
        //imageURI: 'https://i.gifer.com/Escm.gif',
        imageURI: null,
        modalVisible: false,
        tituloApi: '',
        textoApi: '',
        ratingApi: 0
    };
}

_onPressButton() {
  if(this.state.titulo && this.state.texto) {
    fetch('http://ec2-18-218-82-92.us-east-2.compute.amazonaws.com/api/v1/save-comment', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: this.state.titulo,
        content: this.state.texto,
        rating: this.state.rating
      }),
    })
    .then((response) => response.json())
    .then((responseJson) => {
      this.setState({
        titulo: '',
        texto: '',
        rating: 1,
        modalVisible: true,
        tituloApi: responseJson.comment.title,
        textoApi: responseJson.comment.content,
        ratingApi: responseJson.comment.rating
      })
    })
    .catch((error) => {
      console.error(error);
      Alert.alert('Error!')
    });
  } else {
    Alert.alert('Error!')
  }
}

setModalVisible(visible) {
  this.setState({modalVisible: visible});
}

_pickImage = async () => {
  let result = await ImagePicker.launchImageLibraryAsync({
    allowsEditing: true,
    aspect: [1, 1],
  });

  console.log(result);

  if (!result.cancelled) {
    this.setState({ imageURI: result.uri });
  }
};

render() {
    return (
    <View style={ styles.container }>
      <ScrollView>
        <Modal
          style = { styles.modal }
          animationType = "slide"
          transparent = {false}
          visible = { this.state.modalVisible }
          onRequestClose={() => {
            Alert.alert('El modal se cerrara');
          }}>
          <View style = { styles.container }>
            <Text style = {{ fontWeight: 'bold', fontSize: 20 }}>{ this.state.tituloApi }</Text>
            <Text style = {{ fontSize: 18 }}>{ this.state.textoApi }</Text>
            <Text style = {{ fontSize: 18, marginBottom: 30 }}>Rating: { this.state.ratingApi }</Text>
            <Button
              onPress={ () => this.setModalVisible(false) }
              title = 'Volver'
              color = '#4483B5'
            />
          </View>
        </Modal>

        <Text style = { styles.title }>Formulario Test</Text>
        <TextInput 
            style = { styles.input }
            placeholder = "Titulo"
            onChangeText = {(titulo) => this.setState({titulo})}   
            value = { this.state.titulo }
        />
        <TextInput 
            style = {[ styles.input, styles.textArea ]}
            multiline = {true}
            placeholder = "Comentario"
            onChangeText = {(texto) => this.setState({texto})}   
            value = { this.state.texto }     
        />
        <Text style = { styles.textRating }>
          Rating: { this.state.rating }
        </Text>
        <Slider
          minimumValue = {1}
          maximumValue = {5}
          step = {1}
          onValueChange = { (rating) => this.setState({rating}) }
          onSlidingComplete={ (rating) => this.setState({rating})}
          value = { this.state.rating }
        />
        <View style = {{ alignItems: 'center' }}>
          { this.state.imageURI &&
            <Image
              style = { styles.image }
              source = {{ uri: this.state.imageURI }}
            />}
        </View>
        <Text
            onPress={ this._pickImage }
            style={ styles.imagePickerButton }>
            Seleccionar imagen de la galeria
        </Text>
        <Button
            onPress={ () => this._onPressButton() }
            title = 'Enviar'
            color = '#4483B5'
        />
      </ScrollView>
    </View>
    );
}
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10
  },
  modal: {
    padding: 10
  },
  title: {
    textAlign: 'center',
    fontSize: 18,
    marginBottom: 5,
    marginTop: 5
  },
  input: {
    height: 40,
    borderColor: '#CCCCCC',
    borderWidth: 2,
    marginBottom: 10,
    padding: 10
  },
  textArea: {
    height: 70
  },
  imagePickerButton: {
    textAlign: 'center',
    color: '#2222AA',
    marginBottom: 10,
    marginTop: 10
  },
  image: {
    width: 200,
    height: 200,
    marginTop: 5,
    borderColor: '#CCCCCC',
    borderWidth: 2
  },
  textRating: {
    marginBottom: 10
  }
});
