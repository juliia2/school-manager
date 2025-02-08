import { Stack } from "expo-router";
import { StyleSheet } from "react-native";

export default function RootLayout() {
  return (
    <Stack>
      {/* CUSTOM HEADER: */}
      <Stack.Screen
        name="index"
        options={{
          title: "Class Schedule",
          headerTintColor: "#e8eaed", // basically text color
          headerStyle: styles.header,
          headerTitleStyle: styles.headerTitle,
          headerTitleAlign: "center",
        }}
      />

      {/* in case i dont want the header shown at all */}
      {/* <Stack.Screen name="index" options={{ headerShown: false }} /> */}
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}

const styles = StyleSheet.create({
  header: {
    // for the header bar
    backgroundColor: "#3e47a2", //"#121f36", // might wanna change this to the primary color bg
    
  },
  headerTitle: {
    // for the title text
    fontWeight: "bold",
    fontSize: 24,
  },
});

// --add Period # to the class card
// change edit button colors!!
// try this to remove the space under camera: headerStatusBarHeight: 0
// also look into removing the shadow under header