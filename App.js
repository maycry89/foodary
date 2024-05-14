import {useState, useRef, useEffect} from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, Platform, FlatList, TouchableOpacity, Pressable, TextInput, KeyboardAvoidingView, Alert } from 'react-native';
import {AntDesign} from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

import IconButton from './components/IconButton';
import NewFood from './components/NewFood';

const data = [
  "Apfel",
  "Banane",
  "Orange",
  "Erdbeere",
  "Blaubeere",
  "Brokkoli",
  "Karotte",
  "Spinat",
  "Tomate",
  "Gurke",
  "Huhn",
  "Rindfleisch",
  "Lachs",
  "Thunfisch",
  "Ei",
  "Milch",
  "Joghurt",
  "Käse",
  "Reis",
  "Nudeln",
  "Brot",
];

const datas = [
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


const dataMeals = [
  "Muesli",
  "Kartoffelgratin",
  "Borscht",
  "WeisskohlKokosauflauf",
  "Curry mit Gemuese",
];

const datasMeals = [
  {name: "Kartoffelgratin", Ingredients: ['Kartoffeln','Sahne', 'Käse']},
  {name: "Borscht", Ingredients: ['Kraut','Rote Beete', 'Karotte']},
  {name: "Muesli", Ingredients: ['Haferflocken','Mandeln', 'Weintrauben']},
  {name: "Pfannkuchen", Ingredients: ['Apfel','Ei', 'Milch']},
  {name: "Curry mit Gemuesse", Ingredients: ['Haehnchen','Ananas', 'Kokosmilch']},
  {name: "Salat", Ingredients: ['Zwiebeln','Tomaten', 'Gurke']},

]

let listName = "FOODS";
let isActive = true;
let indexSelectedItem;

export default function App() {
  const [newMealsList, setNewMealsList] = useState(datasMeals);
  const [index, setIndex] = useState(0);

  const [food, setFood] = useState(null);
  const [foods, setFoods] = useState(datas.map(data => data.name));
 
  const [filteredList, setFilteredList] = useState(null);
  const [textInput, setText] = useState('');
  const flatListRef = useRef(null);
  //const [listName, setListName] = useState('FOODS');
  const [showNewDialog, setShowNewDialog] = useState(false);

  const [meals, setMeals] = useState(datasMeals);

  useEffect(() => { //einmaliges Ausfuehren beim Start der App:
    loadFoods(listName);
    // for RESET: setMeals(dataMeals);
  }, []);

  const ListItem = ({ item, index }) => (
    <TouchableOpacity 
    onPress={() => setToEnd(item, index)}
    onLongPress={() => handleLongPosition(item, index)}>
      <Text style={styles.foodListText}>{item}</Text>
    </TouchableOpacity>
  )

  async function loadFoods(listNamee){
    let foodsFromDB = await AsyncStorage.getItem(listNamee);
    //console.log('load: ' + foodsFromDB);
    foodsFromDB = JSON.parse(foodsFromDB);
    setFoods(foodsFromDB);
    // RESET: 
    //setFoods(datas.map(data => data.name));
  }

  function setToEnd(foodie, index){
    /** 
    //index ist optional
    console.log(foodie + ' index: ' + index);
    const newFoodsList = [...foods.slice(0, index), ...foods.slice(index + 1), foodie];
    setFoods(newFoodsList);
    setFilteredList(foods);
    setText('');
    saveFoods(newFoodsList);
    */

    setIndex(index);
  }

  function handleLongPosition(item, index){
    Alert.alert(
      'Lebensmittel bearbeiten',
      `${item}`,
      [{text: 'Bearbeiten', style: 'default', onPress: ()=> renameFood(index)}, {text: 'Loeschen', style: 'default' ,onPress: ()=> removeItemFromList(index)}, {text: 'Abbrechen', style: 'cancel'}]
    );
  }

  
  function addNewFood(){
    //TODO: CHECK, if food is already in the list? 
    console.log('Click on addNewFood ' + food);
    if(food !== null){
      const newFoodsList = [...foods,food];
      setFoods(newFoodsList);
      saveFoods(newFoodsList);
      console.log('Added new food: ' +  food);
      setText('');
      setFood(null);
    }
    setShowNewDialog(true);
  }

  function saveFoods(newList = foods){
    AsyncStorage.setItem(listName,JSON.stringify(newList));
    console.log('save: ' + newList);
  }

  // RESET FOR TESTING !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  function resetList(listParam, index){
    //setFoods(datas);
    //AsyncStorage.setItem('FOODS',JSON.stringify(foods));
    //console.log('reset! ZEILE 158 ' + foods[0].id);
      // Sortiere die Gerichte im Array nach dem Namen
      //newMealsList.sort((a, b) => a.name.localeCompare(b.name));

      const thirdElement = listParam.splice(index, 1)[0]; // Das dritte Element entfernen und in einer Variablen speichern
      listParam.push(thirdElement); // Das entfernte Element ans Ende des Arrays hinzufügen
      //setNewMealsList(listParam);
      
      setFoods(listParam.map(data => data.name));
    // Gib die neue Reihenfolge in der Konsole aus
    console.log(listParam);


  }

  function renameFood(index){
    //show a new Dialog with an input field
    console.log('index: ' + index);
    indexSelectedItem = index;
    setShowNewDialog(true);
}

  function removeItemFromList(index){
      const newFoodList = [...foods];
    newFoodList.splice(index, 1);
    setFoods([...newFoodList]);
    alert('geloescht!');
    saveFoods(newFoodList);
  }


  function searchFoodList(value){
    const filteredData = foods.filter(item =>
      item.toLowerCase().includes(value.toLowerCase()));
    setFilteredList(filteredData);
  }

  function selectVisibleList(changedListName){
    isActive = ((changedListName !== listName) ? !isActive  : isActive);
    //console.log('change List to ' + changedListName);
    listName = changedListName;
    loadFoods(changedListName);
  }

  function editItem(foodName){
    //setShowNewDialog(false);
    foods[indexSelectedItem] = foodName;
      saveFoods(foods);
      console.log('TEST TEST Added new food: ' +  foodName);
  }
  
  let meal = meals[indexSelectedItem];

  
  function addNewIngredients(ingredi){
    console.log('adding new ingredient: ' + ingredi + ' to this meal: ' );
  }

  function testMethod(testParam){
    console.log('Testing Methode!! ' + testParam);
  }

  // ################ ########### 3######## ####  ELEMENTE ######## ######### #############
  return (
    <KeyboardAvoidingView
    //behavior={Platform.OS === "ios" ? "padding" : "undefined"}
    style={styles.container}
    keyboardVerticalOffset={-1500} >   

      <IconButton
      onPress={() => (selectVisibleList('FOODS'),setNewMealsList(datas))}
      icon="apple-whole"
      style={[styles.foodsBtn, styles.borderRegistry, {backgroundColor: isActive ? 'white' : 'gainsboro'}]}>
      </IconButton>

      <IconButton
      // TODO: Statt MEALS, lieber das Listenobjekt uebergeben und name auslesen
      onPress={() => (selectVisibleList('MEALS'),setNewMealsList(datasMeals))}
      icon="bowl-food"
      style={[styles.mealsBtn, styles.borderRegistry, {backgroundColor: isActive ? 'gainsboro' : 'white'}]}
      >
      </IconButton>

      {/** unschoen , wie besser, cleaner ??
       FlatList Objekt anlegen.  */}
      {textInput != '' ? (
  
      <FlatList
      style={[styles.foodList]}
      data={filteredList}
      keyboardShouldPersistTaps="handled" 
      //nestedScrollEnabled={true} 
      renderItem={
        ({ item}) => <ListItem item={item} index={foods.indexOf(item)}/>}
      keyExtractor={
        (item, index) => index.toString()}>
      </FlatList>) :(

      <FlatList 
      ref={flatListRef}
      style={styles.foodList}
      data={foods}
      keyboardShouldPersistTaps="handled" 
      renderItem={
        ({ item, index }) => <ListItem item={item} index={index}/>}
      keyExtractor={
        (item, index) => index.toString()}
      showsVerticalScrollIndicator={false}
      overScrollMode='never'
      />)}

      <TextInput
      style={styles.input}
      placeholder="suchen..."
      value={textInput}
      returnKeyType="search" //Symbol Tastatur
      onChangeText={value => {setText(value),  searchFoodList(value), setFood(textInput)}} //
      onSubmitEditing={()=> addNewFood()
      }
      ></TextInput>

      <IconButton 
      onPress={addNewFood} //Modal Maske oeffnen
      icon="circle-plus"
      style={[styles.newBtn, {}]}></IconButton>

      <NewFood
      visible={showNewDialog}
      onCancel={() => setShowNewDialog(false)}
      onSave={editItem}
      onSaveIngredi={addNewIngredients}
      renameItem={foods[indexSelectedItem]}
      ingredients={foods[indexSelectedItem] !== undefined ? foods[indexSelectedItem].Ingredients : null}
      listName="FOODS"
      onTesting={testMethod}
      //TODO: ingredients={} hier die ZutatenListe uebergeben
      >
      </NewFood>

      <IconButton 
                onPress={() => (resetList(newMealsList, index))} //Modal Maske oeffnen
                icon="gear"
                style={[styles.testBtn]}
                color='firebrick'></IconButton>

      <Text>{"IndexNr: " + index}</Text>
      <Text>{"Zutaten: " + newMealsList[index].Ingredients}</Text>
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
