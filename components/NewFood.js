import { useState, useEffect } from "react";
import { Modal, TextInput, StyleSheet, View, Text, Pressable, TouchableOpacity, FlatList } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';

import IconButton from "./IconButton";

let foodList = null;

export default function NewFood({visible, onCancel, onSave, item 
}){
    const [itemList, setItemList] = useState(item.Ingredients);
    const [name, setName] = useState(item.name); 
    const [textInput, setTextInput] = useState(''); 

    const [filteredList, setFilteredList] = useState(null);
    //console.log('ingredients: ' + ingredients);
   

    return (
        <Modal
        visible={visible}
        onRequestClose={onCancel}
        animationType="slide"
        >
            <View
            style={styles.container}>

                <Text style={styles.text}>{item.name}</Text>

                <TextInput //neu umbenennen
                placeholder={item.name}
                style={styles.input}
                returnKeyType="done"
                onChangeText={setName}
                onSubmitEditing={() => (
                    //alert (`Senden Name:${name}`)
                    onSave(name)
                )}/>
                    
                <TextInput //hinzufuegen neue Items
                style={styles.input}
                placeholder="hinzufuegen..."
                value={textInput}
                returnKeyType="search" //Symbol Tastatur
                onChangeText={value => {setTextInput(value), searchFoodList(value)}} // , setFood(textInput)
                //onSubmitEditing={()=> addNewFood()             }
                ></TextInput>


                <FlatList 
                style={styles.foodList}
                data={item.Ingredients}
                keyboardShouldPersistTaps="handled" 
                renderItem={
                    ({ item, index }) => (
                        <TouchableOpacity 
                        onPress={() => console.log('click on ' + item)}>
                        <Text 
                        style={styles.items}
                        //onPress={() => console.log('click on ' + item)}
                        >{item}
                        </Text>
                        </TouchableOpacity>
                        )}
                keyExtractor={(item, index) => index.toString()}
                showsVerticalScrollIndicator={false}
                overScrollMode='never'
                />
                <View
                style={styles.buttons}>

                <IconButton 
                onPress={() => (console.log('ok, speichern'))} //Modal Maske oeffnen
                icon="save"
                style={[styles.saveBtn]}></IconButton>

                <IconButton 
                onPress={onCancel} //Modal Maske oeffnen
                icon="circle-chevron-left"
                style={[styles.backBtn]}></IconButton>

                <IconButton 
                onPress={() => ( onTesting(renameItem))} //Modal Maske oeffnen
                icon="gear"
                color='firebrick'
                style={[styles.testBtn]}></IconButton>
                </View>

            </View>
       
        </Modal>
    )
}

const styles = StyleSheet.create({
    container:{
        //Inhalte zentrieren
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f5f5f5',
    },
    input:{
        
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 10,
        width: '80%',
        padding: 10,
        fontSize: 20,
        marginBottom: 10,
    },
    text:{
        fontSize: 23,
        padding: 20,
    },

    items: {
        //backgroundColor: 'red',
        fontSize: 20,
        padding: 15,
        paddingLeft:20,
        marginVertical: 1,
        borderWidth: 1,
        borderLeftColor: '#cdcdcd',
        borderRightColor: '#ececec',
        borderTopColor: '#f0f0f0',
        borderBottomColor: '#cdcdcd',
        backgroundColor: 'white',
        borderRadius: 10,
    },
    foodList:{
        width: '80%',
        maxHeight:'45%',
        //backgroundColor: "silver",
      },

    buttons:{
        //alignSelf: 'flex-start',
        flexDirection: 'row',
        //margin: 15,
        padding: 15,
    },
    addBtn: {
        
        //position: 'flex-start',
        //marginTop: 5, 
        //right: "7%",
        //padding: 5,
    },
    testBtn:{
        //alignSelf: 'center',
        //margin: 15,
    },
})
