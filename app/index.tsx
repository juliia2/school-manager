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

// Define the structure of class data using an interface
interface ClassData {
  name: string;
  courseCode: string;
  room: string;
}
// const DateHeader: = () => {
//   const [today, setToday] = useState(new Date());
//   const [dayNum, setDayNum] = useState(today.getDate());

// };

const ClassScheduler: React.FC = () => {
  const [classes, setClasses] = useState<ClassData[]>([
    { name: "Sample Class", courseCode: "AAA4U", room: "RM401" },
    { name: "", courseCode: "", room: "" },
    { name: "", courseCode: "", room: "" },
    { name: "", courseCode: "", room: "" },
  ]);

  useEffect(() => {
    console.log("Classes updated:", classes);
  }, [classes]);
  const day1Order = [0, 1, 2, 3]; // Class a, b, c, d
  const day2Order = [1, 0, 3, 2]; // Class b, a, d, c

  const [todayClasses, setTodayClasses] = useState<ClassData[]>([]);
  

  useEffect(() => {
    const today = new Date();
    // format today date to say for example Wednesday, May 2
    const day = today.toLocaleString("default", { weekday: "long" });
    const month = today.toLocaleString("default", { month: "long" });
    const date = today.getDate();
    const year = today.getFullYear();
    const formattedDate = `${day}, ${month} ${date} ${year}`;
    setFormattedDate(formattedDate);
    console.log(formattedDate);

    const isOdd = true; // manual for testing
    //const isOdd = today.getDate() % 2 !== 0;
    const todayOrder = isOdd ? day1Order : day2Order;

    setDayNum(isOdd ? 1 : 2); // Set day number for testing

    // Reorder classes based on the selected order
    setTodayClasses(todayOrder.map((index) => classes[index]));
  }, [classes]); // Recalculate if classes change

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [forceRender, setForceRender] = useState<number>(0);
  const [formattedDate, setFormattedDate] = useState<string>("");
  const [dayNum, setDayNum] = useState<number>(0);

  const handleSave = (index: number, updatedClass: ClassData) => {
    const updatedClasses = [...classes];
    updatedClasses[index] = updatedClass;
    setClasses(updatedClasses);
    setEditingIndex(null); // Stop editing after saving
  };

  const handleAddClass = () => {
    if (classes.length < 4) {
      setClasses([...classes, { name: "", courseCode: "", room: "" }]);
      setEditingIndex(null); // Start editing the just-added class
    } else {
      Alert.alert("You can only add up to 4 classes");
    }
  };

  const handleEditCard = (index: number) => {
    setEditingIndex(index);
  };

  const handleStopEditing = () => {
    // if editing index isnt null, alert so. else, toggle editing.
    {
      // trying to get it so that blank new classes arent saved. ******** not working
      if (editingIndex !== null) {
        // change index ONLY if not null
        Alert.alert("Please save or cancel the current edit");
      } else {
        setIsEditing(!isEditing);
        setEditingIndex(null);
      }
    }

    // setIsEditing(!isEditing);
    // setEditingIndex(null);
  };

  const handleClearClass = (index: number) => {
    // the text fields don't update, so when i press save, it saves the old data again. only works properly if i press cancel. i would want it to automatically deslect the editing class, but when i add that in, it does say that the class was reset in the console.log but appears to not actually reset on the ui.
    setClasses((prevClasses) => {
      const newClasses = prevClasses.map((c, i) =>
        i === index ? { name: "", courseCode: "", room: "" } : c
      );
      return [...newClasses]; // Ensure a fresh array
    });

    setEditingIndex(null); // Deselect the class
    console.log("Class reset");

    setForceRender((prev) => prev + 1); // Triggers a UI refresh

    // const updatedClasses = [...classes];

    // updatedClasses[index] = { name: "xxxxx", courseCode: "", room: "" }; // set all to blank
    // setClasses(updatedClasses); // Update state to reflect the change
    // setEditingIndex(null); // Stop editing after saving
    // //return updatedClasses; // ?
  };

  return (
    <View style={styles.container}>
      <View style={styles.dateContainer}>
        {/* display today's date */}
        
        <Text style={styles.dateText}> {formattedDate} </Text>
        <Text style={styles.dayText}> Day {dayNum} </Text>
        {/* current date */}
      </View>
      <ScrollView key={forceRender} contentContainerStyle={styles.scrollView}>
        {todayClasses.length === 0 ? (
          <Text style={styles.text}>No classes added yet</Text> // remove this
        ) : (
          todayClasses.map((classData, index) => (
            <ClassCard
              key={index}
              index={index}
              classData={classData || { name: "", courseCode: "", room: "" }} // just in case
              onSave={handleSave}
              isEditing={isEditing}
              isCardEditing={isEditing && editingIndex === index} // Only editable when selected
              onEdit={() => handleEditCard(index)}
              onCancelEdit={() => setEditingIndex(null)}
              onClear={() => handleClearClass(index)}
              
            />
          ))
        )}

        {/* Only show Add Class button when in edit mode */}
        {isEditing && (
          <Pressable onPress={handleAddClass} style={styles.addClassButton}>
            <Text>Add Class</Text>
          </Pressable>
        )}

        {/* Show Stop Editing or Edit Schedule button based on edit mode */}
        <Pressable onPress={handleStopEditing} style={styles.toggleEditButton}>
          <Text>{isEditing ? "Stop Editing" : "Edit Schedule"}</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  // https://www.realtimecolors.com/?colors=e4e5eb-0e1c93-979dd2-2a3387-3a4ad6&fonts=Inter-Inter
  container: {
    padding: 20,
    flex: 1,
    backgroundColor: "#3e47a2",
  },
  text: {
    color: "#e4e5eb",
    fontSize: 16,
    fontWeight: "400",
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
    // shadowOffset: {
    //   width: 0,
    //   height: 2,
    // },
    shadowOpacity: 0.5,
    shadowRadius: 3.84,
    elevation: 8,
  },
  editButton: {
    backgroundColor: "#bebee8",
    padding: 10,
    marginTop: 10,
    borderRadius: 5,
    alignItems: "center",
    // marginTop: 10,
  },
  addClassButton: {
    backgroundColor: "#bebee8",
    padding: 10,
    marginTop: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  dateContainer: {
    marginBottom: 20,
    alignItems: "center",
  },
  dateText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#e2ddeb",//"#e6d9fa" , // off white: 
  },
  dayText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#e2ddeb",
  },
  toggleEditButton: {
    backgroundColor: "#bebee8",
    padding: 10,
    marginTop: 10,
    borderRadius: 5,
    alignItems: "center",
    //marginTop: 10,
    zIndex: 10, // Ensure it is above other elements
  },
});

export default ClassScheduler;
