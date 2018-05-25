import {
  StackNavigator,
  TabNavigator,
} from 'react-navigation'

import Header from './pages/header'
import SingerDetail from './pages/singerDetail';
import RankDetail from './pages/rankDetail';
import Play from './pages/player/play';

const App = StackNavigator({
  Header: {screen: Header},
  SingerDetail: {screen: SingerDetail},
  RankDetail: {screen: RankDetail},
  Play: {screen: Play},
},{
  navigationOptions: {
    gesturesEnabled: true,
  },
  headerMode: 'none'
})

export default App