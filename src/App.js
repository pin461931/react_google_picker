/* global gapi */
/* global google */
import { useState } from 'react';
import './App.css';

function App() {

  const scope = ['https://www.googleapis.com/auth/drive.file'];
  const APP_ID = process.env.REACT_APP_GOOGLE_APP_ID;
  const CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;
  const API_KEY = process.env.REACT_APP_GOOGLE_API_KEY;

  const [oauthToken, setOauthToken] = useState("");
  const [pickerApiLoaded, setPickerApiLoaded] = useState(false);

  const handleAuth = () => {
    gapi.load('auth', onAuthApiLoad);
    gapi.load('picker', onPickerApiLoad);
  }

  const onAuthApiLoad = () => {
    gapi.auth.authorize(
      {
        'client_id': CLIENT_ID,
        'scope': scope,
        'immediate': false
      },
      handleAuthResult);
  }

  const handleAuthResult = (authResult) => {
    if (authResult && !authResult.error) {
      setOauthToken(authResult.access_token);
      createPicker();
    }
  }

  const pickerCallback = (data) => {
    if (data.action === window.google.picker.Action.PICKED) {
      const fileId = data.docs[0].id;
      alert('The user selected: ' + fileId);
    }
  }

  const createPicker = () => {
    if (pickerApiLoaded && oauthToken) {
      const view = new google.picker.View(google.picker.ViewId.DOCS);
      view.setMimeTypes(["image/jpeg", "image/jpg", "application/pdf"]);
      const picker = new google.picker.PickerBuilder()
          .enableFeature(google.picker.Feature.NAV_HIDDEN)
          .enableFeature(google.picker.Feature.MULTISELECT_ENABLED)
          .setAppId(APP_ID)
          .setOAuthToken(oauthToken)
          .addView(view)
          .addView(new google.picker.DocsUploadView())
          .setDeveloperKey(API_KEY)
          .setCallback(pickerCallback)
          .setSize(1051, 650)
          .build();
       picker.setVisible(true);
    }
  }

  const onPickerApiLoad = () => {
    setPickerApiLoaded(true);
    createPicker();
  }

  return (
    <div className="App">
      <button onClick={handleAuth}>Google Login</button>
    </div>
  );
}

export default App;
