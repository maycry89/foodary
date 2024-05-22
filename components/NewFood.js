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
   //const itemLenght = item.Ingredients.lenght;

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
                onChangeText={value => {searchFoodList}} // , setFood(textInput)
                //onSubmitEditing={()=> addNewFood()             }
                ></TextInput>

                <FlatList 
                data={item.Ingredients}
                keyboardShouldPersistTaps="handled" 
                renderItem={
                    ({ item, index }) => (
                        <TouchableOpacity 
                        onPress={() => console.log('click on ' + item)}>
                        <Text 
                        style={styles.items}
                        >{item}
                        </Text>
                        </TouchableOpacity>
                        )}
                keyExtractor={(item, index) => index.toString()}
                style={[styles.foodList]}
                showsVerticalScrollIndicator={false}
                overScrollMode='never'
                />
                
                <View
                style={styles.buttons}>

                    <IconButton 
                    onPress={onCancel} //Modal Maske oeffnen
                    icon="circle-chevron-left"
                    style={[styles.btn]}></IconButton>

                    <IconButton 
                    onPress={() => onSave} 
                    icon="save"
                    style={[styles.btn]}></IconButton>

                    <IconButton 
                    onPress={() => ( onTesting(renameItem))} 
                    icon="gear"
                    color='firebrick'
                    style={[styles.btn]}></IconButton>
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
        //flex: 1,
       //minHeight: '20%',
        width: '80%',
        //height: 30,
        maxHeight:'45%',
        //backgroundColor: "royalblue",
      },

    buttons:{
        //alignItems: 'center',
        //alignSelf: 'flex-start',
        justifyContent: 'space-between',
        flexDirection: 'row',
        //margin: 15,
        //padding: 15,
        //backgroundColor: 'silver',
    },
    btn: {
        paddingHorizontal: 40,
    },
 
})
