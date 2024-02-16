import "./App.css";

import { useEffect, useState, createRef } from "react";
import { Text, Flex, CircularProgress, useColorMode } from "@chakra-ui/react";
import MasterContainer from "./comp/screen/mastercontainer";
import Constants from "./comp/utils";
import Actions from "./comp/redux/action";
import { connect } from "react-redux";
import lodash from "lodash";
import AppManager from "./comp/utils/AppManager";

import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AppContext } from "./TRAVEL-ART-FORUM/providers/AppContext";
import { useAuthState } from "react-firebase-hooks/auth";
import ResultsByCity from "./TRAVEL-ART-FORUM/components/ResultsByCity/ResultsByCity";
import NavBar from "./TRAVEL-ART-FORUM/components/NavBar/NavBar";
import SignIn from "./TRAVEL-ART-FORUM/pages/SignIn/SignIn";
import SignUp from "./TRAVEL-ART-FORUM/pages/SignUp/SignUp";
import ForgotPassword from "./TRAVEL-ART-FORUM/pages/ForgotPassword/ForgotPassword";
import { auth } from "./TRAVEL-ART-FORUM/config/firebase-config";
import { getUserData } from "./TRAVEL-ART-FORUM/services/users.service";
import UploadForm from "./TRAVEL-ART-FORUM/pages/UploadForm/UploadForm";
import CreatePost from "./TRAVEL-ART-FORUM/components/CreatePost/CreatePost";
import AllPosts from "./TRAVEL-ART-FORUM/components/AllPosts/AllPosts";
import SinglePost from "./TRAVEL-ART-FORUM/components/SinglePost/SinglePost";
import Authenticated from "./TRAVEL-ART-FORUM/components/hoc/Authenticated";
import Loaded from "./TRAVEL-ART-FORUM/components/hoc/Authenticated";
import ManageUsers from "./TRAVEL-ART-FORUM/components/ManageUsers/ManageUsers";
import DropdownMenu from "./TRAVEL-ART-FORUM/components/DropdownMenu/DropdownMenu";
import { logoutUser } from "./TRAVEL-ART-FORUM/services/auth.service";
import NotFound from "./TRAVEL-ART-FORUM/pages/NotFound/NotFound";
import UpdateProfile from "./TRAVEL-ART-FORUM/pages/UpdateProfile/UpdateProfile";

const App = (props) => {
  /*  Life-cycles Methods */

  const { isMasterAppLoading } = props;
  const { colorMode } = useColorMode();

  const [context, setContext] = useState({
    user: null,
    userData: null,
    city: null,
  });

  const [user, loading, error] = useAuthState(auth);
  useEffect(() => {
    if (user) {
      getUserData(user.uid).then((snapshot) => {
        if (snapshot.exists()) {
          setContext({
            user,
            userData: snapshot.val()[Object.keys(snapshot.val())[0]],
          });
        }
      });
    }
  }, [user]);

  useEffect(() => {
    props.setIsMasterAppLoading(true);
  }, []);

  const signOut = async () => {
    await logoutUser();
    setContext({ user: null, userData: null });
  };
  /*  Public Interface Methods */

  /*  Validation Methods  */

  /*  UI Events Methods   */

  /*  Custom-Component sub-render Methods */

  const renderLoader = () => {
    return (
      <>
        <Flex
          flexDirection={"row"}
          position={"absolute"}
          justifyItems={"center"}
          alignSelf={"center"}
          alignItems={"center"}
          top={"0%"}
          left={"0%"}
          width={"100vw"}
          height={"100vh"}
          backdropFilter="auto"
          backdropBlur="5px"
          backdropBrightness={"50%"}
          zIndex={150}
        >
          <Flex
            flexDirection={"row"}
            position={"absolute"}
            justifyItems={"center"}
            alignSelf={"center"}
            alignItems={"center"}
            top={"50%"}
            left={"50%"}
            boxShadow="lg"
            transform={"translate(-50%, -50%)"}
            backdropFilter="auto"
            backdropBlur="5px"
            backdropBrightness={"80%"}
            borderWidth={1}
            backgroundColor={colorMode === "dark" ? "gray.700" : "gray.300"}
            borderColor={colorMode === "dark" ? "gray.700" : "gray.400"}
            borderRadius={12}
            px={6}
            py={6}
            zIndex={100}
          >
            <CircularProgress isIndeterminate thickness={10} size={6} />
            <Text ms={3} fontWeight={"semibold"} fontSize={"medium"}>
              {"Loading ..."}
            </Text>
          </Flex>
        </Flex>
      </>
    );
  };

  return (
    <>
      <AppContext.Provider value={{ ...context, setContext }}>
        <BrowserRouter>
          {context.user && (
            <DropdownMenu
              username={context.userData?.handle}
              userData={context.userData}
              signOut={signOut}
            />
          )}
          <div className="App">
            <Routes>
              <Route
                path="/"
                element={
                  <>
                    <NavBar />
                    <MasterContainer />
                    {isMasterAppLoading &&
                      !lodash.isNil(colorMode) &&
                      renderLoader()}
                  </>
                }
              />
              <Route
                path="/manage-users"
                element={
                  <Authenticated>
                    <ManageUsers />
                  </Authenticated>
                }
              />
              <Route
                path="/hotels-by-city"
                element={<ResultsByCity criteria={"Hotels"} />}
              />
              <Route
                path="/restaurants-by-city"
                element={<ResultsByCity criteria={"Restaurants"} />}
              />
              <Route
                path="/things-to-do-by-city"
                element={<ResultsByCity criteria={"Things to do"} />}
              />
              <Route path="/sign-in" element={<SignIn />} />
              <Route path="/sign-up" element={<SignUp />} />
              <Route path="/reset-password" element={<ForgotPassword />} />
              <Route path="/upload-form" element={<UploadForm />} />
              <Route path="/create-post" element={<CreatePost />} />
              <Route path="/all-posts" element={<AllPosts />} />
              <Route path="/single-post/:id" element={<SinglePost />} />
              <Route
                path="/edit-profile"
                element={
                  <Loaded>
                    <UpdateProfile />
                  </Loaded>
                }
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </BrowserRouter>
      </AppContext.Provider>
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    userConfig: state.userConfig,
    isMasterAppLoading: state.isMasterAppLoading,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setUserConfig: (userConfig) => dispatch(Actions.setUserConfig(userConfig)),
    setIsMasterAppLoading: (isMasterAppLoading) =>
      dispatch(Actions.setIsMasterAppLoading(isMasterAppLoading)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
