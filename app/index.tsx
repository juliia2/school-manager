import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import ClassCard from "./components/ClassCard";
import AsyncStorage from "@react-native-async-storage/async-storage";

type ClassData = {
  name: string;
  courseCode: string;
  room: string;
};

const ClassScheduler: React.FC = () => {
  const [classes, setClasses] = useState<ClassData[]>([
    { name: "Sample Class", courseCode: "AAA4U", room: "RM401" },
    { name: "", courseCode: "", room: "" },
    { name: "", courseCode: "", room: "" },
    { name: "", courseCode: "", room: "" },
  ]);

  useEffect(() => {
    const loadClasses = async () => {
      try {
        // try getting the classes from AsyncStorage
        const savedClasses = await AsyncStorage.getItem("classes");

        // if there are classes, set them in state
        if (savedClasses) {
          setClasses(JSON.parse(savedClasses));
        }
        console.log("Classes loaded");
      } catch (error) {
        console.error("Error loading data", error);
      }
    };

    loadClasses(); // load the classes
  }, []);

  useEffect(() => {
    console.log("Classes updated:", classes);
  }, [classes]);
  const day1Order = [0, 1, 2, 3]; // Class a, b, c, d
  const day2Order = [1, 0, 3, 2]; // Class b, a, d, c

  const [todayClasses, setTodayClasses] = useState<ClassData[]>([]);

  useEffect(() => {
    const today = new Date();
    // format today date
    const day = today.toLocaleString("default", { weekday: "long" });
    const month = today.toLocaleString("default", { month: "long" });
    const date = today.getDate();
    const year = today.getFullYear();
    const formattedDate = `${day}, ${month} ${date} ${year}`;
    setFormattedDate(formattedDate);
    setDayName(day);
    //setDayName("Wednesday"); // manual for testing ******
    //console.log(formattedDate);

    //const isOdd = !true; // manual for testing
    const isOdd = today.getDate() % 2 !== 0;
    const order = isOdd ? day1Order : day2Order;

    setTodayOrder(order); // set the order of classes outside of useEffect

    setDayNum(isOdd ? 1 : 2); // set day number based on odd/even date
    // reorder classes based on the selected order (day 1, day 2)
    setTodayClasses(order.map((index) => classes[index]));
  }, [classes]); // re-run when classes change

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [formattedDate, setFormattedDate] = useState<string>("");
  const [dayNum, setDayNum] = useState<number>(0);
  const [dayName, setDayName] = useState<string>("");
  const isWeekend = dayName === "Saturday" || dayName === "Sunday";
  const [todayOrder, setTodayOrder] = useState<number[]>(day1Order);

  const handleSave = (index: number, updatedClass: ClassData) => {
    // ************
    //const actualIndex = todayOrder[index];
    //const actualIndex = todayOrder[index];
    console.log(" index", index, " | Index", index);
    console.log("Saving class", index, updatedClass);
    const updatedClasses = [...classes];
    updatedClasses[index] = updatedClass;
    setClasses(updatedClasses);
    console.log("Classes updated", updatedClasses);
    console.log("classes: ", classes);
    console.log("TODAY ORDER: ", todayOrder);
    setEditingIndex(null); // stop editing after saving
  };

  const handleEditCard = (index: number) => {
    if (editingIndex !== null) {
      // if already editing, alert so
      Alert.alert("Please save or cancel the current edit");
      return;
    }
    setEditingIndex(index);
  };

  const handleStopEditing = async () => {
    // if editing index isnt null, alert so. else, toggle editing.
    {
      if (editingIndex !== null) {
        // change index ONLY if not null (aka it is editing some index)
        Alert.alert("Please save or cancel the current edit");
      } else {
        try {
          // save the current classes to AsyncStorage when stopping edit mode
          await AsyncStorage.setItem("classes", JSON.stringify(classes));
          console.log(classes);
          console.log("Classes saved with AsyncStorage");
        } catch (error) {
          console.error("Error saving data", error);
        }

        setEditingIndex(null);
        setIsEditing(!isEditing);
      }
      console.log(isEditing);
      console.log(isEditing);
    }
  };

  const handleClearAll = async () => {
    // clear all classes
    Alert.alert("Are you sure you want to reset all classes?", "", [
      { text: "No", onPress: () => console.log("No Pressed") },
      {
        text: "Yes",
        onPress: async () => {
          setClasses([
            { name: "", courseCode: "", room: "" },
            { name: "", courseCode: "", room: "" },
            { name: "", courseCode: "", room: "" },
            { name: "", courseCode: "", room: "" },
          ]);

          setEditingIndex(null); // stop editing any index after clearing
          console.log("All classes reset");

          try {
            await AsyncStorage.removeItem("classes");
            console.log("Classes removed from AsyncStorage");
          } catch (error) {
            console.error("Error removing data", error);
          }
        },
      },
    ]);
  };

  // clear a class - clear all fields
  const handleClearClass = (index: number) => {
    setClasses((prevClasses) => {
      const newClasses = prevClasses.map((c, i) =>
        i === index ? { name: "", courseCode: "", room: "" } : c
      );
      return [...newClasses]; // return the new classes
    });

    setEditingIndex(null); // stop editing any index after clearing
    console.log("Class reset");
  };

  return (
    <View style={styles.container}>
      <View style={styles.dateContainer}>
        {/* display today's date */}
        <Text style={styles.dateText}> {formattedDate} </Text>

        {!isEditing ? (
          <>
            {!isWeekend && <Text style={styles.dayText}> Day {dayNum} </Text>}
            {/* if it's not the weekend, say if it's day 1 or day 2 */}
          </>
        ) : (
          // if editing, show editing text
          <Text style={styles.editText}>Editing Day 1 Schedule</Text>
        )}
      </View>
      <ScrollView contentContainerStyle={styles.scrollView}>
        {isWeekend &&
          !isEditing && ( // if it is the weekend, show this text - only on non-editing mode
            <>
              <Text style={styles.text}>
                It's the weekend! No classes today.
              </Text>
              <Text style={styles.text2}>
                Press Edit Schedule to view or edit your classes.
              </Text>
            </>
          )}
        {/* // : ( */}
        {/* // if it's not the weekend, show the classes */}

        {(!isEditing ? todayClasses : classes).map((classData, index) => (
          <ClassCard
            key={index}
            index={index}
            // index 1 = a, 2 = b, 3 = c, 4 = d, this is block's letter
            block={
              todayOrder[index] === 0
                ? "A"
                : todayOrder[index] === 1
                ? "B"
                : todayOrder[index] === 2
                ? "C"
                : "D"
            } // block letter
            classData={classData || { name: "", courseCode: "", room: "" }} // just in case
            onSave={handleSave}
            isEditing={isEditing}
            isCardEditing={isEditing && editingIndex === index} // Only editable when selected
            onEdit={() => handleEditCard(index)}
            onCancelEdit={() => setEditingIndex(null)}
            onClear={() => handleClearClass(index)}
          />
        ))}

        {/* show stop editing vs edit schedule depending on which mode it's in */}
        <Pressable
          onPress={handleStopEditing}
          style={({ pressed }) => [
            styles.toggleEditButton,
            pressed ? styles.toggleEditButtonPressed : null,
          ]}
        >
          <Text>{isEditing ? "Stop Editing" : "Edit Schedule"}</Text>
        </Pressable>

        {isEditing && ( // only in edit mode
        <> 
          {/* <Pressable 
            onPress={handleCancelEdits}
            style={({ pressed }) => [
              styles.resetClassesButton,
              pressed ? styles.toggleEditButtonPressed : null,
            ]}
          >
            <Text>{"Reset All Classes"}</Text>
          </Pressable> */}
          <Pressable // only in edit mode
            onPress={handleClearAll}
            style={({ pressed }) => [
              styles.resetClassesButton,
              pressed ? styles.toggleEditButtonPressed : null,
            ]}
          >
            <Text>{"Reset All Classes"}</Text>
          </Pressable>
          </>
        )}
        
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  // https://www.realtimecolors.com/?colors=e4e5eb-0e1c93-979dd2-2a3387-3a4ad6&fonts=Inter-Inter
  // kinda used that but not fully
  container: {
    padding: 20,
    flex: 1,
    backgroundColor: "#3e47a2",
  },
  text: {
    color: "#e4e5eb",
    fontSize: 16,
    fontWeight: "400",
    marginBottom: 10,
    alignSelf: "center",
  },
  text2: {
    color: "#e4e5eb",
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 10,
  },

  scrollView: {
    paddingBottom: 20,
    flexGrow: 1,
  },
  card: {
    padding: 10,
    marginVertical: 10,
    backgroundColor: "#979dd2",
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.5,
    shadowRadius: 3.84,
    elevation: 8,
  },
  dateContainer: {
    marginBottom: 20,
    alignItems: "center",
  },
  dateText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#e2ddeb", //"#e6d9fa" , // off white:
  },
  dayText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#e2ddeb",
  },
  editText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#e2ddeb",
    fontStyle: "italic",
  },
  toggleEditButton: {
    backgroundColor: "#bebee8",
    padding: 10,
    marginTop: 10,
    borderRadius: 5,
    alignItems: "center",
    //marginTop: 10,
    zIndex: 10,
  },
  toggleEditButtonPressed: {
    opacity: 0.5,
    // backgroundColor:"#9595de" ,//"#a1a1a1",
  },
  resetClassesButton: {
    backgroundColor: "#FF6347",
    padding: 10,
    marginTop: 10,
    borderRadius: 5,
    alignItems: "center",
    //marginTop: 10,
    zIndex: 10,
  },
  resetClassesButtonPressed: {
    opacity: 0.5,
    // backgroundColor:"#9595de" ,//"#a1a1a1",
  },
});

export default ClassScheduler;
