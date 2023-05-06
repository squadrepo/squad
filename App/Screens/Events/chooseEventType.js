import React, { useState, useContext } from "react";
import { Button, Appbar } from "react-native-paper";
import { View, ScrollView } from "react-native";

export const ChooseEventType = ({ navigation }) => {
  return (
    <View>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.navigate("Drawers")} />
        <Appbar.Content title="Choose Event Type" />
      </Appbar.Header>
      <View style={{ justifyContent: "center", paddingTop: 150 }}>
        <View>
          <Button
            mode="contained"
            style={{ borderRadius: 20, margin: 10 }}
            onPress={() => navigation.navigate("CreateEvent")}
          >
            Event Post
          </Button>
          <Button
            mode="contained"
            style={{ borderRadius: 20, margin: 10 }}
            onPress={() => navigation.navigate("FoodPostEvent")}
          >
            Food Post
          </Button>
          <Button
            mode="contained"
            style={{ borderRadius: 20, margin: 10 }}
            onPress={() => navigation.navigate("SelectTutorSession")}
          >
            Tutoring Post
          </Button>
        </View>
      </View>
    </View>
  );
};
