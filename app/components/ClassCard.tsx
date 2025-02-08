import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
} from "react-native";
import DeleteIcon from "../Icons/DeleteIcon";

type ClassData = {
  name: string;
  courseCode: string;
  room: string;
}

type ClassCardProps = {
  classData: ClassData;
  onSave: (index: number, classDetails: ClassData) => void;
  index: number;
  isEditing: boolean; // Add this property
  isCardEditing: boolean;
  onEdit: () => void;
  onCancelEdit: () => void;
  onClear: (index: number) => void;
}

const ClassCard: React.FC<ClassCardProps> = ({
  classData,
  onSave,
  index,
  isEditing,
  isCardEditing,
  onEdit,
  onCancelEdit,
  onClear,
}) => {
  //const [classDetails, setClassDetails] = useState(classData);
  const [tempClassData, setTempClassData] = useState<ClassData>({
    courseCode: '',
    name: '',
    room: ''
  }); // Temporary state for edits

  useEffect(() => {
    setTempClassData(classData); // Reset temp state when classData changes
  }, [classData]);

//   useEffect(() => {
//     setTempClassData(classData); // Reset temp state when classData changes
//   }, [classData]);

  const handleInputChange = (field: keyof ClassData, value: string) => {
    setTempClassData((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };
  // Ensure at least one field is filled (not just spaces)
  const isValidClass = (data: ClassData) => {
    return (
      data.name.trim() !== "" ||
      data.courseCode.trim() !== "" ||
      data.room.trim() !== ""
    );
  };

  const handleSave = () => {
    // .trim
    tempClassData.name = tempClassData.name.trim();
    tempClassData.courseCode = tempClassData.courseCode.trim();
    tempClassData.room = tempClassData.room.trim();

    // if (!isValidClass(tempClassData)) {
    //   Alert.alert("Invalid Input", "Please fill out at least one field.");
    //   return;
    // }
    onSave(index, tempClassData); // Save the changes
  };

  const handleCancelEdit = () => {
    setTempClassData(classData); // Reset to original data
    // Exit edit mode
    onCancelEdit();
  };

  const handleClear = () => {
    Alert.alert(
      "Clear Class Info",
      "Are you sure you want to clear this class?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Yes", onPress: () => onClear(index) },
      ]
    );
  };

  const isEmpty =
    !tempClassData.name && !tempClassData.courseCode && !tempClassData.room;

  return (
    <View style={[styles.card, isEmpty && styles.emptyCard]}>
      {isEditing && isCardEditing ? (
        <View>
          <TextInput
            style={styles.input}
            value={tempClassData.name}
            onChangeText={(text) => handleInputChange("name", text)}
            placeholder="Class Name"
          />
          <TextInput
            style={styles.input}
            value={tempClassData.courseCode}
            onChangeText={(text) => handleInputChange("courseCode", text)}
            placeholder="Course Code"
          />
          <TextInput
            style={styles.input}
            value={tempClassData.room}
            onChangeText={(text) => handleInputChange("room", text)}
            placeholder="Room Number"
          />
        </View>
      ) : (
        // Display classes if not editing - but only if they exist
        <View>
          <Text style={styles.periodHeaderText}>Period {index + 1}</Text>
          <Text>{isEmpty ? "Empty Period" : tempClassData.name}</Text>
          <Text>{isEmpty ? "" : tempClassData.courseCode}</Text>
          <Text>{isEmpty ? "" : tempClassData.room}</Text>
        </View>
      )}
      {/* Edit and Save buttons */}
      {isEditing && !isCardEditing && (
        <Pressable onPress={onEdit} style={styles.editButton}>
          <Text style={styles.darkButtonText}>Edit</Text>
        </Pressable>
      )}

      {isEditing &&
        isCardEditing && ( // check later if this logic makes sense && vs ?
          <>
            <View style={styles.buttonContainer}>
              {/* Save a card edit */}
              <Pressable onPress={handleSave} style={styles.saveButton}>
                <Text style={styles.darkButtonText}>Save</Text>
              </Pressable>

              {/* Cancelling a card edit */}
              <Pressable onPress={handleCancelEdit} style={styles.cancelButton}>
                <Text style={styles.darkButtonText}>Cancel</Text>
              </Pressable>
            </View>
            {/* Delete button */}
            <Pressable onPress={handleClear} style={styles.deleteButton}>
              <DeleteIcon />
              {/* rerender classes */}

              {/* <Text>Delete</Text> */}
            </Pressable>
          </>
        )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 10,
    marginVertical: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
  },
  emptyCard: {
    backgroundColor: "#d3d3d3", // Gray background for empty periods
  },

  input: {
    borderWidth: 1,
    padding: 8,
    marginBottom: 10,
  },
  periodHeaderText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  darkButtonText: {
    color: "white",
  },
  editButton: {
    backgroundColor: "#3e479e", // dark color //"#4CAF50",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
    width: "auto",
  },
  saveButton: {
    backgroundColor: "#3e479e", //"#4CAF50",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
    width: "48%",
  },
  cancelButton: {
    backgroundColor: "#3e479e", //"#4CAF50",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
    width: "48%",
  },
  deleteButton: {
    backgroundColor: "#FF6347",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
    width: "100%",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
});

export default ClassCard;
