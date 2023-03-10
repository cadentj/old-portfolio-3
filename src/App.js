import * as React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Home from './pages/Home';
import Animation from './components/ShipAnimation';
import BrickToByte from './pages/BrickToByte';
import Cover from './pages/Cover';
import ButtonAppBar from './components/ButtonAppBar';
import Brick from './components/Brick'

import {
  Routes,
  Route,
} from "react-router-dom";
// import ButtonAppBar from './components/ButtonAppBar';

const theme = createTheme({
  typography: {
    fontFamily: [
      'Source Code Pro'
    ].join(','),
    allVariants: {
      color: 'white'
    }
  },
});

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <ButtonAppBar/>
      <Routes>
        <Route path="/" element={<Cover />} />
        <Route path="home" element={<Home />} />
        <Route path="btb" element={<BrickToByte />} />
      </Routes>
    </ThemeProvider>
  );
}

// export default function App() {
//   return (
//     <ThemeProvider theme={theme}>
//       <Routes>
//         <Route path="/" element={<Animation />} />
//         <Route path="*" element={<MainLayoutRoutes />} />
//       </Routes>
//     </ThemeProvider>
//   );
// }

// const MainLayoutRoutes = () => (
//   <div>
//     {/* <ButtonAppBar /> */}
//     <Routes>
//       <Route path="/home" element={<Home />} >
//         <Route path="*" element={<PortfolioRoutes />} />
//       </Route>
//     </Routes>
//   </div>
// )

// const PortfolioRoutes = () => (
//   <div>
//     <Routes>
//       <Route path="btb" element={<BrickToByte/>} />
//     </Routes>
//   </div>
// )