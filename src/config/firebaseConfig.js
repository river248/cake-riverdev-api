import { initializeApp } from 'firebase/app'

const firebaseConfig = {
  apiKey: 'AIzaSyCWwgs87BBr__Khxv6rK3e_SQJQ1y4KAvs',
  authDomain: 'cake-riverdev-web.firebaseapp.com',
  projectId: 'cake-riverdev-web',
  storageBucket: 'cake-riverdev-web.appspot.com',
  messagingSenderId: '703216356376',
  appId: '1:703216356376:web:2f350bff121e105d9a476d',
  measurementId: 'G-YV9Q35S14P'
}

// Initialize Firebase
const firebaseApp = () => initializeApp(firebaseConfig)

export default firebaseApp