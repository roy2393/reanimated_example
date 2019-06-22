import { StyleSheet } from 'react-native';

const BOX_SIZE = 100;

const styles = StyleSheet.create({
  rayImg: {
    position: "absolute",
    width: 220,
    height: 220,
    justifyContent: "center",
    alignItems: "center"
  },
  walletCont: {
    width: 100,
    height: 100,
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF"
  },
  box: {
    width: BOX_SIZE,
    height: BOX_SIZE,
    alignSelf: "center",
    margin: BOX_SIZE / 2
  },
  bonusAmountCont: {
    position: "absolute",
    top: 50,
    width: 70,
    justifyContent: "center",
    alignItems: "center"
  },
  text: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 15
  }
});

export default styles;