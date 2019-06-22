import React from "react";
import { createAppContainer, createStackNavigator } from "react-navigation";
import BonusScreen from "./src/components/Bonus/BonusScreen";

class App extends React.Component {
  render() {
    const AppContainer = createAppContainer(
      createStackNavigator({
        BonusScreen
      },
      {
        defaultNavigationOptions: ({ navigation }) => ({
          headerTitle: "ReAnimated Examples",
        })
      }
    ));
    return <AppContainer />;
  }
}

export default App;