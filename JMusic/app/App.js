import {
  StackNavigator,
  TabNavigator,
} from 'react-navigation'

import Header from './pages/header'

const App = StackNavigator({
  
  Header: {screen: Header},
},{
  navigationOptions: {
    gesturesEnabled: true,
  },
  headerMode: 'none'
})

export default App