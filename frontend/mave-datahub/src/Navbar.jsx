// import React from "react";
// import AppBar from "@mui/material/AppBar";
// import Box from "@mui/material/Box";
// import Toolbar from "@mui/material/Toolbar";
// import Button from "@mui/material/Button";
// import IconButton from "@mui/material/IconButton";
// import MenuIcon from "@mui/icons-material/Menu";
// import { BrowserRouter, Route, Routes, Link } from "react-router-dom";
// // import CardsCarousel from "home/CardsCarousel";
// import HomeApp from "home/HomeApp";
// import styled from "@emotion/styled";

// import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
// import MailOutlineIcon from "@mui/icons-material/MailOutline";
// import { Avatar, Badge, Divider, Typography } from "@mui/material";

// // import MapExampleComponent from "map/MapExampleComponent";
// import Map from "map/Map";

// const Icons = styled(Box)(({ theme }) => ({
//   display: "none",
//   // gap: "10px",
//   alignItems: "center",
// }));
// const UserBox = styled(Box)(({ theme }) => ({
//   display: "flex",
//   gap: "10px",
//   alignItems: "center",
// }));
// // #1A97F5 background color
// export default function Navbar() {
//   return (
//     <BrowserRouter>
//       <Box>
//         <AppBar position="sticky" sx={{ backgroundColor: "primary" }}>
//           <Toolbar
//             sx={{
//               display: "flex",
//               justifyContent: "space-between",
//               alignItems: "center",
//             }}
//           >
//             <IconButton
//               size="large"
//               edge="start"
//               color="inherit"
//               aria-label="menu"
//               sx={{ mr: 2 }}
//             >
//               <MenuIcon />
//             </IconButton>
//             {/* desktop nav buttons */}
//             <Box sx={{ display: { xs: "none", sm: "flex" } }}>
//               <Link to="home" className="link">
//                 <Button variant="h6" component="div">
//                   Home
//                 </Button>
//               </Link>

//               <Link to="map" className="link">
//                 <Button variant="h6" component="div">
//                   Map
//                 </Button>
//               </Link>
//               <Button variant="h6" component="div">
//                 Analytics
//               </Button>
//               <Button color="inherit">Login</Button>
//             </Box>

//             {/* mobile screen navigation buttons*/}
//             <Box sx={{ display: { xs: "flex", sm: "none" } }}>
//               <Link to="home" className="link">
//                 <Button variant="h6" component="div">
//                   Home
//                 </Button>
//               </Link>
//               <Link to="map" className="link">
//                 <Button variant="h6" component="div">
//                   Map
//                 </Button>
//               </Link>
//             </Box>

//             {/* desktop icons */}
//             <Icons sx={{ display: { xs: "none", sm: "flex" } }}>
//               <IconButton sx={{ color: "white" }}>
//                 <Badge badgeContent={1} color="error" variant="dot">
//                   <NotificationsNoneIcon />
//                 </Badge>
//               </IconButton>
//               <IconButton sx={{ color: "white" }}>
//                 <Badge badgeContent={4} color="secondary" variant="dot">
//                   <MailOutlineIcon />
//                 </Badge>
//               </IconButton>
//               <Divider
//                 orientation="vertical"
//                 flexItem
//                 variant="middle"
//                 sx={{ margin: "0 10px" }}
//               />
//               <Button sx={{ color: "white", textTransform: "none" }}>
//                 <Box
//                   sx={{ display: "flex", gap: "10px", alignItems: "center" }}
//                 >
//                   <Avatar
//                     sx={{ width: 30, height: 30 }}
//                     mr={3}
//                     src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
//                   />
//                   <Typography variant="subtitle1">Hi, John</Typography>
//                 </Box>
//               </Button>
//             </Icons>

//             {/* mobile icons */}
//             <UserBox sx={{ display: { xs: "flex", sm: "none" } }}>
//               <IconButton>
//                 <Avatar
//                   sx={{ width: 30, height: 30 }}
//                   mr={3}
//                   src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
//                 />
//               </IconButton>
//             </UserBox>
//           </Toolbar>
//         </AppBar>

//         <Routes>
//           <Route path="home/*" element={<HomeApp />} />
//         </Routes>
//         <Routes>
//           <Route path="map/*" element={<Map />} />
//         </Routes>
//       </Box>
//     </BrowserRouter>
//   );
// }
