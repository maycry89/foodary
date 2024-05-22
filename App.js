import {useState, useRef, useEffect} from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, Platform, FlatList, TouchableOpacity, Pressable, TextInput, KeyboardAvoidingView, Alert } from 'react-native';
import {AntDesign} from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

import IconButton from './components/IconButton';
import NewFood from './components/NewFood';


let foodData = [
  { id: 1, name: "Apfel", category: 'Obst', eatenCount: 0 },
  { id: 2, name: "Tomaten", category: 'Gemuese', eatenCount: 0 },
  { id: 3, name: "Rote Linsen", category: 'Huelsenfruechte', eatenCount: 0 },
  { id: 4, name: "Banane", category: 'Obst', eatenCount: 0 },
  { id: 5, name: "Orange", category: 'Obst', eatenCount: 0 },
  { id: 6, name: "Erdbeere", category: 'Obst', eatenCount: 0 },
  { id: 7, name: "Blaubeere", category: 'Obst', eatenCount: 0 },
  { id: 8, name: "Brokkoli", category: 'Gemuese', eatenCount: 0 },
  { id: 9, name: "Karotte", category: 'Gemuese', eatenCount: 0 },
  { id: 10, name: "Spinat", category: 'Gemuese', eatenCount: 0 },
  { id: 11, name: "Gurke", category: 'Gemuese', eatenCount: 0 },
  { id: 12, name: "Huhn", category: 'Fleisch', eatenCount: 0 },
  { id: 13, name: "Rindfleisch", category: 'Fleisch', eatenCount: 0 },
  { id: 14, name: "Lachs", category: 'Fisch', eatenCount: 0 },
  { id: 15, name: "Thunfisch", category: 'Fisch', eatenCount: 0 },
  { id: 16, name: "Ei", category: 'Eier', eatenCount: 0 },
  { id: 17, name: "Milch", category: 'Milchprodukte', eatenCount: 0 },
  { id: 18, name: "Joghurt", category: 'Milchprodukte', eatenCount: 0 },
  { id: 19, name: "Käse", category: 'Milchprodukte', eatenCount: 0 },
  { id: 20, name: "Reis", category: 'Getreideprodukte', eatenCount: 0 },
  { id: 21, name: "Nudeln", category: 'Getreideprodukte', eatenCount: 0 },
  { id: 22, name: "Brot", category: 'Getreideprodukte', eatenCount: 0 },
];

let mealsData = [
  {name: "Kartoffelgratin", Ingredients: ['Kartoffeln','Sahne', 'Käse']},
  {name: "Borscht", Ingredients: ['Kraut','Rote Beete', 'Karotte','Paprika','Kartoffeln','Weisse Bohnen']},
  {name: "Muesli", Ingredients: ['Haferflocken','Mandeln', 'Weintrauben']},
  {name: "Pfannkuchen", Ingredients: ['Apfel','Ei', 'Milch']},
  {name: "Curry mit Gemuesse", Ingredients: ['Haehnchen','Ananas', 'Kokosmilch']},
  {name: "Salat", Ingredients: ['Zwiebeln','Tomaten', 'Gurke']},
]

const testData = ["test","test2"];

let storageListName = "FOODS";
let isActive = true;
let indexSelectedItem;
let selectedItem = 'noch nichts angeklickt';
let selectedList = foodData;
//let shownData;

export default function App() {
  const [visibleList, setVisibleList] = useState(foodData.map(data => data.name));
  const [index, setIndex] = useState(0);
  const [food, setFood] = useState(null);
  const [filteredList, setFilteredList] = useState(null);
  const [inputText, setInputText] = useState('');
  const [showNewDialog, setShowNewDialog] = useState(false);


  useEffect(() => { //einmaliges Ausfuehren beim Start:
    //loadFoods(listName);
  }, []);

 //---------------------------------------------------
  const ListItem = ({ index, item}) => (
    <TouchableOpacity 
    onPress={() => setToEnd(index)}
    onLongPress={() => handleLongPosition(index)}
    ><Text style={styles.foodListText}>{item}</Text>
    </TouchableOpacity>
  )

  function setToEnd(index){
    console.log(selectedList[index].name + ' Index: '+ index );
    selectedList.push(selectedList.splice(index, 1)[0]); 
    setVisibleList(selectedList.map(data => data.name));
    //close the input field
    setInputText('');
  }

  function handleLongPosition(index){
    Alert.alert(
      'Lebensmittel bearbeiten',
      visibleList[index] + '\n' + (selectedList[index].Ingredients ? 'Zutaten: ' + selectedList[index].Ingredients : ''),
      [{text: 'Bearbeiten', style: 'default', onPress: ()=> renameFood(index)}, {text: 'Loeschen', style: 'default' ,onPress: ()=> removeItemFromList(index)}, {text: 'Abbrechen', style: 'cancel'}]
    );
  }
//----------------------------------------------------

function renameFood(index){
  //show a new Dialog with an input field
  setIndex(index);
  console.log('index: ' + index);
  indexSelectedItem = index;
  setShowNewDialog(true);
}

  async function loadFoods(listNamee){
    let foodsFromDB = await AsyncStorage.getItem(listNamee);
    //console.log('load: ' + foodsFromDB);
    foodsFromDB = JSON.parse(foodsFromDB);
    //setVisibleList(foodsFromDB);
    // RESET: 
    //setFoods(datas.map(data => data.name));
  }

  function searchFoodList(inputValue){
    //der Index von visibleList wird angezeigt
    const filteredData = visibleList.filter(item =>
      item.toLowerCase().includes(inputValue.toLowerCase()));
      setFilteredList(filteredData);
      //setFilteredList(testData);
      //console.log(filteredList);
    //setVisibleList(filteredData.map(data => data.name)); 
  }
  
  function addNewFood(){
    //TODO: CHECK, if food is already in the list? 
    console.log('Click on addNewFood ' + food);
    if(food !== null){
      //const newFoodsList = [...visibleList,food];
      //setVisibleList(newFoodsList);
      saveFoods(newFoodsList);
      console.log('Added new food: ' +  food);
      setInputText('');
      setFood(null);
    }
    setShowNewDialog(true);
  }

  function saveFoods(newList){
    AsyncStorage.setItem(storageListName,JSON.stringify(newList));
    console.log('save: ' + newList);
  }


 

  function removeItemFromList(index){
     // const newFoodList = [...visibleList];
    //newFoodList.splice(index, 1);
    //setVisibleList([...newFoodList]);
    alert('geloescht!');
    //saveFoods(newFoodList);
  }


 

  function selectVisibleList(changedListName){

    isActive = ((changedListName !== storageListName) ? !isActive  : isActive);
    console.log('change List to ' + changedListName);
    storageListName = changedListName;
    loadFoods(changedListName);
  }

  function editItem(foodName){
    setShowNewDialog(false);
    //visibleList[indexSelectedItem] = foodName;
      //saveFoods(visibleList);
    console.log('TEST TEST Added new food: ' +  foodName);
  }
  
  //let meal = meals[indexSelectedItem];

  
  function addNewIngredients(ingredi){
    console.log('adding new ingredient: ' + ingredi + ' to this meal: ' );
  }

  function testMethod(){
    console.log('Testing Methode!! ' );
  }

  function selectList(listName, listData){
    isActive = ( listName === storageListName ? isActive : !isActive);
    storageListName = listName;
    setVisibleList(listData.map(d => d.name));
    selectedList = listData;//TODO: data load from storage
  }

  // ################ ########### 3######## ####  ELEMENTE ######## ######### #############
  return (
    <KeyboardAvoidingView
    //behavior={Platform.OS === "ios" ? "padding" : "undefined"}
    style={styles.container}
    keyboardVerticalOffset={-1500} >   


      <IconButton
      //onPress={() => (selectVisibleList('FOODS'), setNewMealsList(datas))} 
      onPress={() => (selectList('FOODS', foodData))} 
      icon="apple-whole"
      style={[styles.foodsBtn, styles.borderRegistry, {backgroundColor: isActive ? 'white' : 'gainsboro'}]}>
      </IconButton>

      <IconButton
      // TODO: Statt MEALS, lieber das Listenobjekt uebergeben und name auslesen
      onPress={() => (selectList('MEALS' , mealsData))} //selectVisibleList('MEALS'), 
      icon="bowl-food"
      style={[styles.mealsBtn, styles.borderRegistry, {backgroundColor: isActive ? 'gainsboro' : 'white'}]}
      >
      </IconButton>

      {/** unschoen , wie besser, cleaner ??
       FlatList Objekt anlegen.  */}
      
      {inputText != '' ? 
        <FlatList
        style={[styles.foodList]}
        data={filteredList}
        keyboardShouldPersistTaps="handled" 
        //nestedScrollEnabled={true} 
        renderItem={
          ({ index, item: items}) => <ListItem index={visibleList.indexOf(items)} item={items}/>}
        keyExtractor={
          (item, index) => index.toString()}>
        </FlatList> :

        <FlatList 
        style={styles.foodList}
        data={visibleList}
        keyboardShouldPersistTaps="handled" 
        renderItem={
          ({ index, item}) => 
            (<ListItem index={index} item={item}/>)}
        keyExtractor={
          (item, index) => index.toString()}
        showsVerticalScrollIndicator={false}
        overScrollMode='never'
        />}

        {inputText != '' ? <Text>Input vorhanden</Text>: <Text>Input leer</Text>}


      <TextInput
      style={styles.input}
      placeholder="suchen..."
      value={inputText}
      returnKeyType="search" //Symbol Tastatur
      onChangeText={value => {
        console.log('Value: ' + value), //check
        setInputText(value), 
        searchFoodList(value)
        //set, 
      }}       ></TextInput>

      <IconButton 
      onPress={addNewFood} //Modal Maske oeffnen
      icon="circle-plus"
      style={[styles.newBtn, {}]}></IconButton>

      <NewFood
      visible={showNewDialog}
      onCancel={() => setShowNewDialog(false)}
      onSave={editItem}
      item={selectedList[index]}
      ></NewFood>

      <IconButton 
                onPress={() => (testMethod())} //Modal Maske oeffnen
                icon="gear"
                style={[styles.testBtn]}
                color='firebrick'></IconButton>

{/** 
      <Text>{"IndexNr: " + index + ' Angeklickt: ' + selectedItem}</Text>
      <Text>{"Zutaten: " + ((listName === 'MEALS')  ? visibleList[index].Ingredients : 'keine Zutaten vorhanden')}</Text>
      */}
      <StatusBar style="auto" />
      

    </KeyboardAvoidingView>
  );
}

//# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #       S T Y L E S       # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    //alignItems: 'center',
    marginTop: 23, //Abstand fuer Status Leiste
    paddingLeft: "7.5%",
    //justifyContent: 'center',
  },
  headline:{
    alignSelf: 'flex-start',
    //left: "7.5%",
    //paddingVertical: 15,
    fontSize: 25,
    marginTop: 15,
    //marginBottom: 5,
  },
  foodList:{
    width: '80%',
  },
  filteredList: {
    color: 'red',
  },
  foodListText: {
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
  newBtn: {
    //position:'absolute',
    alignSelf: 'flex-end',
    top: -43, 
    right: "7%",
  },

  mealsBtn: {
    alignSelf: 'flex-start',
    //alignItems: 'center',
    //position: 'absolute',
    //bottom: 45,
   marginTop: -57.4,
   marginLeft: 60,
   marginBottom: 5,
   
  },

  foodsBtn: {
    alignSelf: 'flex-start',
    //alignItems: 'center',
    //position: 'absolute',
    //bottom: 45,
    marginTop: 5,
   //marginLeft: 50,
   //marginBottom: 5,
  },

  borderRegistry:{
    borderWidth: 1,
    padding: 10,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    borderLeftColor: '#cdcdcd',
    borderRightColor: '#ececec',
    borderTopColor: '#f0f0f0',
    borderBottomColor: '#cdcdcd',
    backgroundColor: 'white',
  },

  input: {
    alignSelf: 'flex-start', //Ueberschreibt parent View
    marginTop: 20,
    //marginLeft: "7.5%",
    padding: 10,
    width: '80%',
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    fontSize: 28,
    backgroundColor: 'white',
  },

  testBtn:{
    position:'absolute',
    alignSelf: 'center',
    padding: 15,
  },
  
  
});
