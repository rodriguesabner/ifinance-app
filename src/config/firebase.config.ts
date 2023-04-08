import {initializeApp} from 'firebase/app';
import {getDatabase} from 'firebase/database';

const firebaseConfig = {
    apiKey: "AIzaSyBguMDXRKbiLszv9WPUSJt6C7r10BW1nUM",
    authDomain: "copy-paste-24ce6.firebaseapp.com",
    databaseURL: "https://copy-paste-24ce6-default-rtdb.firebaseio.com",
    projectId: "copy-paste-24ce6",
    storageBucket: "copy-paste-24ce6.appspot.com",
    messagingSenderId: "1013129405469",
    appId: "1:1013129405469:web:40ecad7171cafe34c352f4"
}

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export {
    database
}
