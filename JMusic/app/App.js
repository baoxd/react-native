import {
  StackNavigator,
  TabNavigator,
} from 'react-navigation'

import Header from './pages/header'
import SingerDetail from './pages/singerDetail';

const App = StackNavigator({
  
  Header: {screen: Header},
  SingerDetail: {screen: SingerDetail}
},{
  navigationOptions: {
    gesturesEnabled: true,
  },
  headerMode: 'none'
})

export default App