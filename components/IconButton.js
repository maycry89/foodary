import { Pressable} from "react-native";
import { FontAwesome6 } from '@expo/vector-icons';

export default function IconButton({onPress, icon, style, color = 'gray'}){

//const colorActive = 'red';

return(
    <Pressable
      onPress={onPress} 
      style={({ pressed }) => [
        style,
        {
          transform: [{ scale: pressed ? 0.9 : 1 }] 
        },
        //{backgroundColor: colorActive}
      ]}> 
        <FontAwesome6 name={icon} size={35} color={color} />
        
      </Pressable>
);
}
