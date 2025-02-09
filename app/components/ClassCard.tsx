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
};

type ClassCardProps = {
  classData: ClassData;
  onSave: (index: number, classDetails: ClassData) => void;
  index: number;
  isEditing: boolean;
  isCardEditing: boolean;
  onEdit: () => void;
  onCancelEdit: () => void;
  onClear: (index: number) => void;
};

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
    // using this so it doesn't change the original data when editing (before confirming edits)
    courseCode: "",
    name: "",
    room: "",
  });

  useEffect(() => {
    setTempClassData(classData); // reset temp state when classData changes
  }, [classData]);

  const handleInputChange = (field: keyof ClassData, value: string) => {
    setTempClassData((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };

  const handleSave = () => {
    // .trim
    tempClassData.name = tempClassData.name.trim();
    tempClassData.courseCode = tempClassData.courseCode.trim();
    tempClassData.room = tempClassData.room.trim();

    onSave(index, tempClassData); // save the edited data
  };

  const handleCancelEdit = () => {
    setTempClassData(classData); // reset to original data (cancel edit, dont use temp data)
    // then exit edit mode
    onCancelEdit();
  };

  const handleClear = () => {
    // double check with user before clearing
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
      {/* if a card is empty, it's greyed out */}
      {isEditing && isCardEditing ? ( // logic for editing a card
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
        // display classes if not editing
        <View>
          <Text
            style={[
              styles.periodHeaderText,
              isEmpty && styles.emptyPeriodHeaderText,
            ]}
          >
            Period {index + 1}
          </Text>
          {/* logic for showing card info */}
          <Text style={isEmpty ? styles.emptyClassText : null}>
            {isEmpty ? "Spare Period" : tempClassData.name}
          </Text>
          <Text>{isEmpty ? "" : tempClassData.courseCode}</Text>
          <Text>{isEmpty ? "" : tempClassData.room}</Text>
        </View>
      )}

      {/* buttons */}

      {/* edit button */}
      {isEditing && !isCardEditing && (
        <Pressable
          onPress={onEdit}
          style={({ pressed }) => [
            styles.editButton,
            pressed ? styles.buttonPressed : null,
          ]}
        >
          <Text style={styles.darkButtonText}>Edit</Text>
        </Pressable>
      )}
      {/* save, cancel, clear buttons */}
      {isEditing &&
        isCardEditing && ( // only show these buttons when editing a card
          <>
            <View style={styles.buttonContainer}>
              {/* save edit */}
              <Pressable
                onPress={handleSave}
                style={({ pressed }) => [
                  styles.saveButton,
                  pressed ? styles.buttonPressed : null,
                ]}
              >
                <Text style={styles.darkButtonText}>Save</Text>
              </Pressable>

              {/* cancel edit */}
              <Pressable
                onPress={handleCancelEdit}
                style={({ pressed }) => [
                  styles.cancelButton,
                  pressed ? styles.buttonPressed : null,
                ]}
              >
                <Text style={styles.darkButtonText}>Cancel</Text>
              </Pressable>

              {/* clear button */}
              <Pressable
                onPress={handleClear}
                style={({ pressed }) => [
                  styles.deleteButton,
                  pressed ? styles.buttonPressed : null,
                ]}
              >
                <DeleteIcon />
              </Pressable>
            </View>
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
    //opacity: 0.75,
    backgroundColor: "#d3d3d3", 
  },

  periodHeaderText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  emptyPeriodHeaderText: {
    color: "#575757",
  },
  emptyClassText: {
    color: "#575757",
  },

  darkButtonText: {
    color: "white",
    fontWeight: "500",
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
    width: "40%",
  },
  cancelButton: {
    backgroundColor: "#3e479e", //"#4CAF50",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
    width: "40%",
  },
  deleteButton: {
    backgroundColor: "#FF6347",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
    width: "auto",
  },
  buttonPressed: {
    opacity: 0.5,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },

  input: {
    borderWidth: 1,
    padding: 8,
    marginBottom: 10,
  },
});

export default ClassCard;
