import { useContext, useMemo } from "react";
import { AppContext } from "../../contexts";

const useGoogleAppleTester = () => {
  const { user, setUser } = useContext(AppContext);
  const userTest = useMemo(
    () => ({
      phoneNumber: "+33612345123",
      pseudo: "test",
      uid: "123456789",
    }),
    []
  );
  const isTester = useMemo(
    () => user?.phoneNumber === userTest.phoneNumber,
    [user, userTest]
  );

  const connectTester = () => {
    setUser(userTest);
  };

  const disconnectTester = () => {
    window.location.reload();
  };

  return {
    isTester,
    connectTester,
    disconnectTester,
  };
};

export default useGoogleAppleTester;
