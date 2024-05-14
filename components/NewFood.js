import { useState, useEffect } from "react";
import { Modal, TextInput, StyleSheet, View, Text, Pressable, TouchableOpacity, FlatList } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';

import IconButton from "./IconButton";

let foodList = null;

export default function NewFood({visible, onCancel, onSave, renameItem = 'Name', ingredients, listName, onSaveIngredi, onTesting}){

    const [name, setName] = useState(renameItem); //zu Beginn noch keine Eingabe
    const [textInput, setTextInput] = useState(''); 
    const [filteredList, setFilteredList] = useState(null);
    const [ingredientsList, setIngredientsList] = useState(ingredients);
    //console.log('ingredients: ' + ingredients);
   

    useEffect(() => { //einmaliges Ausfuehren beim Start der App:
        loadFoods(listName);
        // for RESET: setMeals(dataMeals);
      }, []);

    const ListItem = ({ item, index }) => (
        <TouchableOpacity 
        onPress={() => addToList(item)}
        >
          <Text style={styles.items}>{item}</Text>
        </TouchableOpacity>
      )

      const IngredientsItem = ({ item, index }) => (
        <TouchableOpacity 
        onLongPress={() => alert(`Was soll nun mit ${item} geschehen?`)}
        >
          <Text style={styles.items}>{item}</Text>
        </TouchableOpacity>
      )

      function addToList(foodie){
        /** 
        const newFoodsList = [...ingredientsList, foodie];
        setIngredientsList(newFoodsList)
        setFilteredList(null);
        setTextInput('');
        saveFoods(newFoodsList);
        console.log('add To List: ' + foodie);
        
        */
        console.log('add To List: ' + foodie);
        onSaveIngredi(foodie);
      }

      function saveFoods(newList){
        //setIngredientsList(newList);
        AsyncStorage.setItem({renameItem},JSON.stringify(newList));
        console.log('save: ' + newList);
      }

      async function loadFoods(listNamee){
        let foodsFromDB = await AsyncStorage.getItem(listNamee);
        foodsFromDB = JSON.parse(foodsFromDB);
        foodList = foodsFromDB;
        console.log('load in Modal: ' + foodList);
        //console.log('load in Modal ingredientsList: ' + ingredientsList);
        
      }

    function searchFoodList(value){
        //console.log('searching for food in foodList: ' + foodList);
        const filteredData = foodList.filter(item =>
          item.toLowerCase().includes(value.toLowerCase()));
        setFilteredList(filteredData);
      }

    return (
        <Modal
        visible={visible}
        onRequestClose={onCancel}
        animationType="slide"
        >
            <View
            style={styles.container}>

                <Text style={styles.text}>{renameItem}</Text>

                <Text style={styles.text}>{'Test: ' + ingredients}</Text>

                <TextInput //neu umbenennen
                placeholder={renameItem}
                style={styles.input}
                returnKeyType="done"
                onChangeText={setName}
                onSubmitEditing={() => (
                    //alert (`Senden Name:${name}`)
                    onSave(name)
                )}/>
            
                {textInput != '' ? (
                    <FlatList //Ergebnisse Suche
                    style={[styles.foodList]}
                    data={filteredList}
                    keyboardShouldPersistTaps="handled" 
                    //nestedScrollEnabled={true} 
                    renderItem={
                        ({ item, index}) => <ListItem item={item} index={index}/>}
                    keyExtractor={
                        (item, index) => index.toString()}>
                    </FlatList>) :(
                    null )}
                    
                <TextInput //hinzufuegen neue Items
                style={styles.input}
                placeholder="hinzufuegen..."
                value={textInput}
                returnKeyType="search" //Symbol Tastatur
                onChangeText={value => {setTextInput(value), searchFoodList(value)}} // , setFood(textInput)
                //onSubmitEditing={()=> addNewFood()             }
                ></TextInput>

                <IconButton 
                onPress={() => addToList(textInput)} 
                icon="circle-plus"
                style={[styles.addBtn]}></IconButton>

                {/** 
                {items && items.map((ingredient, index) => (
                    <Pressable
                    key={index}
                    onPress={() => console.log('gedrueckt: ' + ingredient)}
                    >
                        <Text style={styles.text}>
                            {ingredient}
                        </Text>
                    </Pressable>
                ))} 
                */}

                {ingredients != null ? (
                    <FlatList 
                    style={styles.foodList}
                    data={ingredients.map(data => data.name)}
                    keyboardShouldPersistTaps="handled" 
                    renderItem={
                        ({ item, index }) => <IngredientsItem item={item} index={index}/>}
                    keyExtractor={
                        (item, index) => index.toString()}
                    showsVerticalScrollIndicator={false}
                    overScrollMode='never'
                    />) : null }

                <IconButton 
                onPress={() => (console.log('ok, speichern'))} //Modal Maske oeffnen
                icon="save"
                style={[styles.addBtn]}></IconButton>

                <IconButton 
                onPress={(() => console.log('abbrechen'))} //Modal Maske oeffnen
                icon="circle-chevron-left"
                style={[styles.addBtn]}></IconButton>

                <IconButton 
                onPress={() => ( onTesting(renameItem))} //Modal Maske oeffnen
                icon="gear"
                color='red'
                style={[styles.testBtn]}></IconButton>

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
        fontSize: 20,
    },

    items: {
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
      },

    addBtn: {
        alignSelf: 'center',
        //top: -43, 
        //right: "7%",
        padding: 5,
    },
    testBtn:{
        alignSelf: 'center',
        margin: 15,
    },
})
