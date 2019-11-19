
var firebaseConfig = {
    apiKey: "AIzaSyAsJaKsBAOhXqK4KEUEjTZdUvA7Gd-LbsM",
    authDomain: "coffee-time-4ce39.firebaseapp.com",
    databaseURL: "https://coffee-time-4ce39.firebaseio.com",
    projectId: "coffee-time-4ce39",
    storageBucket: "coffee-time-4ce39.appspot.com",
    messagingSenderId: "547538730637",
    appId: "1:547538730637:web:dd7e43b61d62a376db2cc4"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

var database = firebase.database();
var userVerRef = database.ref('UserVerwaltung');
var userRef = userVerRef.child('Users');
var userIdRef = userVerRef.child('UserId');
var operationRef = database.ref('Operations');

new Vue ({
    el: '#app',
    data: {
        db: null,
        newUser:{
            Name: "",
            Active: true,
            id: "",
            Bezahlt: 0,
            Getrunken: 0
        },

        editUser:{
            Trinker:[],
            Bezahler: ''
        },
        newOperation:{
            Bezahlt: "",
            Datum: "",
            Trinker: []
        }
    },
    firebase:{
        userVer:userVerRef,
        users : userRef,
        usersObj : { 
                    source: userRef,
                    asObject: true
                } ,
        userId : userIdRef,
        operations : operationRef
    },
    methods:{
        addUser: function(){
            this.newUser.id =this.userVer[0][".value"] +1; 
            userVerRef.update({UserId: this.newUser.id}) //UPDATE ID OK
            userRef.push(this.newUser);           
        },
        enableUser: function(User){
            userRef.child(User['.key']).update({Active: true})
        },
        disableUser: function(User){
            let key=User['.key']
            userRef.child(key).update({Active: false})
            
            this.removeUser(key);
        },
        removeUser: function(key){  
            let check =  this.usersObj[key]     
            console.log("USER "+this.usersObj[key].Name +" ACTIVE "+this.usersObj[key].Active +" Dif "+(check.Bezahlt - check.Getrunken) ) 
               
            if(!check.Active && (check.Bezahlt - check.Getrunken) == 0){
                userRef.child(key).remove();
            }else{
                console.log("Impossible to remove the user. Active: true")
            }
            
        },
        differenz: function(User){
            return(User.Bezahlt - User.Getrunken);
        },      
        updateUser: function(){
           //Bezahler
           let trinkers=this.editUser.Trinker;
            
           let tmp = this.usersObj[this.editUser.Bezahler].Bezahlt + trinkers.length;
           userRef.child(this.editUser.Bezahler).update({Bezahlt: tmp})
        
            // Wem hat Getrunken?
            for(let i=0;i<trinkers.length;i++){
                let tmp = this.usersObj[trinkers[i]].Getrunken + 1;
                userRef.child(trinkers[i]).update({Getrunken: tmp})
            }

            //trinkers Name
            let TrinkersNameArray=[];
            for(let i=0;i<trinkers.length;i++){
                TrinkersNameArray[i] = this.usersObj[this.editUser.Trinker[i]].Name
            }
            // console.log(TrinkersNameArray)

            //Updating Operation
            this.newOperation = {
                Bezahlt :this.usersObj[this.editUser.Bezahler].Name,
                Datum: new Date().toLocaleString(),
                Trinker:TrinkersNameArray
            }
            operationRef.push(this.newOperation)
        
            
            //this.removeUser(this.User); /////////////////////ADD FOR IFs

            for(let i=0;i<trinkers.length;i++){
                this.removeUser(this.editUser.Trinker[i]);
                // console.log(this.editUser.Trinker[i])
            }
            this.removeUser(this.editUser.Bezahler);
            //checkbox empty
            this.editUser.Trinker = [];           
       }
        
    }
})
