import {
  useCallback,
  useEffect,
  createContext,
  useContext,
  useState,
} from "react";
import firebase from "firebase/compat/app";
import {
  GoogleAuthProvider,
  signInWithCredential,
  getAuth,
  connectAuthEmulator,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAo2mZOAGmS4Q79eNEV9D0Q3_5sF44VaJw",
  authDomain: "pelagic-media-368714.firebaseapp.com",
  projectId: "pelagic-media-368714",
  storageBucket: "pelagic-media-368714.appspot.com",
  messagingSenderId: "922817243019",
  appId: "1:922817243019:web:c12c228b42e12e231fb18e",
};

firebase.initializeApp(firebaseConfig);

const AuthContext = createContext({});

const auth = getAuth();

if (process.env.NODE_ENV === "development") {
  connectAuthEmulator(auth, "http://localhost:9099");
}

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      console.log("User =>", user);

      setIsLoading(false);
      setUser(user);
    });
  }, []);

  const signIn = useCallback(
    async ({ accountId, scopes: extraScopes = [] } = {}) => {
      const url = new URL("https://accounts.google.com/o/oauth2/v2/auth");
      const scopes = [
        "https://www.googleapis.com/auth/youtube.readonly",
        "profile",
        "email",
        ...extraScopes,
      ];

      url.searchParams.append(
        "client_id",
        process.env.REACT_APP_GOOGLE_CLIENT_ID
      );

      url.searchParams.append(
        "redirect_uri",
        `${process.env.REACT_APP_API_URL}/authhandler`
      );

      if (!accountId) {
        url.searchParams.append("prompt", "consent");
      }

      url.searchParams.append("include_granted_scopes", "true");
      url.searchParams.append("response_type", "code");
      url.searchParams.append("access_type", "offline");
      url.searchParams.append("scope", scopes.join(" "));

      if (accountId) {
        url.searchParams.append("login_hint", accountId);
      }

      window.location = url.toString();
    },
    []
  );

  const searchParams = new URLSearchParams(window.location.search);

  const idToken = searchParams.get("id_token");
  const accessToken = searchParams.get("access_token");

  useEffect(() => {
    if (!idToken || !accessToken) {
      return;
    }

    const signIn = async () => {
      const auth = getAuth();
      const credential = GoogleAuthProvider.credential(idToken, accessToken);
      console.log("OAuthCredential =>", credential);

      await signInWithCredential(auth, credential);

      const url = new URL(window.location.href);
      url.searchParams.delete("id_token");
      url.searchParams.delete("access_token");

      window.history.replaceState({}, document.title, url.toString());
    };

    signIn();
  }, [accessToken, idToken]);

  const signOut = useCallback(async () => auth.signOut(), []);

  const value = {
    signIn,
    signOut,
    user,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

const useAuth = () => useContext(AuthContext);

export { AuthProvider, useAuth };
