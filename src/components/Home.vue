<template>
<div id="home" class="wrapper">
<div class="container d-flex justify-content-center align-item-center">
    <div class="wrapper-login d-flex align-self-center flex-column justify-content-around mt-4">
    
        <h3 class="d-flex justify-content-center">Add Operation</h3>
        <form class="form-operation"  v-on:submit.prevent="updateUser()">
            <select  class="btn btn-outline-secondary my-3" v-model="editUser.Bezahler" placeholder="Select">
                    <option v-for="user in users" v-bind:key="user.id" :value="user.id">{{user.Name}}</option>
                </select>
               <hr class="">
             <div v-for="user in users" v-bind:key="user.id" >
                    <input  type="checkbox" :value="user.id" v-model="editUser.Trinker" class="mr-4">
                    <label > {{user.Name}} </label>
                </div>
                <br>
                <input class="btn btn-lg btn-info btn-block text-uppercase" type="submit" value="Confirm">

           
        </form> 

        
        
        
    </div>
</div>
</div>
    
   
        
       
        

</template>

<script>
import db from './firebaseInit'
export default {
    name:'home',
    data(){
        return {
            users : [],
            editUser:{
                Trinker:[],
                Bezahler: ''
            }
        }
    },
    
    // created(){
        // db.collection('Users').onSnapshot(querySnapshot => {        
        // //db.collection('Users').get(querySnapshot => {
        //     //YOUTube --> firebase web basic - firestore tutorials
        //     this.users=[];
        //     querySnapshot.forEach(doc => {
        //         console.log(doc.data().Name)
        //         const data = {
        //             'id' : doc.id,
        //             'Name' : doc.data().Name,
        //             'Аctive' : doc.data().Аctive,
        //             'Bezahlt' : doc.data().Bezahlt,
        //             'Getrunken' : doc.data().Getrunken,
        //         }
        //         this.users.push(data);
        //     })
        // })
    // },
    firestore(){
        return {
            users: db.collection('Users')
        }
    },
    methods:{
        findUserByKey: function(key){
            for(let i=0;i<this.users.length;i++){
                console.log(i);
                if(this.users[i].id==key){                    
                    return this.users[i]
                }
            }
            return false
            // return(user.Bezahlt - user.Getrunken);
        },
        differenz: function(user){
            return(user.Bezahlt - user.Getrunken);
        },
        updateUser: function(){
            console.log("updateuse yess")
            if(!this.updateUserCore()){
                alert("Failed to add the operation check if the bezalher and trinkers are correctly setted");
            }else{
                // User updated, check if someone has to be removed
                console.log("ceck aktive yess")
                this.checkActive()
            }
            this.editUser.Trinker = [];
            this.editUser.Bezahler = [];
        },

          checkActive: function(){
            for(let i=0; i<this.users.length; i++){
                if(!this.users[i].Active && this.differenz(this.users[i])==0){
                db.collection('Users').doc(this.users[i].id).delete().then(function() {
                        console.log("Document successfully deleted!");
                     }).catch(function(error) {
                     console.error("Error removing document: ", error);
                    });
                }else{
                console.log("Impossible to remove the user. Active:"+this.users[i].Active+" diff: "+(this.users[i].Bezahlt-this.users[i].Getrunken))
                }                
            }
        },
        updateUserCore:function(){
            let trinkers=this.editUser.Trinker;
            let bezahler=this.editUser.Bezahler;
            console.log("HERE" + bezahler)
            if(trinkers == undefined || trinkers == '' ){
                console.log("Adding new operation failed while trinkers is undefined")
                return false
            }
            if(bezahler == undefined || bezahler == ''){
                console.log("Adding new operation failed while bezahler is undefined")
                return false
            }
            if(trinkers.lenght==0){
                console.log("Adding new operation failed while no trinkers in the list")
                return false
            }

            let bezhalerObj = this.findUserByKey(bezahler)
            if(bezhalerObj==false){
                console.log("Bezahler key not founded in user list operation failed")
                return false
            }
            bezhalerObj.Bezahlt = bezhalerObj.Bezahlt + trinkers.length;
            // bezhalerObj.Getrunken=bezhalerObj.Getrunken+1;
            
            db.collection("Users").doc(bezahler).update({
                Bezahlt: bezhalerObj.Bezahlt,
            })
            .then(function() {
                console.log("Document successfully updated!");
            })
            .catch(function(error) {
                // The document probably doesn't exist.
                console.error("Error updating document: ", error);
            });

            let TrinkersNameArray = [];
            for(let i=0;i<trinkers.length; i++){
                let trinkerObj = this.findUserByKey(trinkers[i])
                if(trinkerObj==false){
                    console.log("Trinker " + trinkers[i] +  " not found in user list.")
                    continue
                }
                TrinkersNameArray.push({
                        Name: trinkerObj.Name,
                        id:   trinkerObj.id
                        });
                db.collection("Users").doc(trinkers[i]).update({
                    Getrunken: (trinkerObj.Getrunken+1),
                })
                .then(function() {
                    console.log("Document successfully updated!");
                    
                })
                .catch(function(error) {
                    // The document probably doesn't exist.
                    console.error("Error updating document: ", error);
                });                
            }

                      //Updating Operation
            let newOperation = {
                Bezahlt : {
                        Name: bezhalerObj.Name,
                        id:   bezhalerObj.id
                        },
                Datum: new Date().toLocaleString(),
                Trinkers : TrinkersNameArray
            }
            db.collection("Operations").add(newOperation);

            return true
        }
    }
}
</script>

<style scoped>
#nav_home{
    font-weight: 700;
    color: white;
}

.wrapper{
    width: 100%;
    min-height: calc(100vh - 57.6px);
       background-image:url("../assets/background-caffe.jpg");
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
 
}
.wrapper .container{
    min-height: 100%;
}

.wrapper-login{
background: rgba(255, 255, 255, 0.7);
border-radius:1rem;
padding:1rem 3rem;
height: 75%

}

input{
    height: auto;
    border-radius: 2rem;
    position: relative;
    margin-bottom: 1rem;
}

.btn {
  font-size: 80%;
  border-radius: 5rem;
  letter-spacing: .1rem;
  font-weight: bold;
  padding: 1rem;
  transition: all 0.2s;
}
input[type=checkbox]
{
  /* Double-sized Checkboxes */
  -ms-transform: scale(2); /* IE */
  -moz-transform: scale(2); /* FF */
  -webkit-transform: scale(2); /* Safari and Chrome */
  -o-transform: scale(2); /* Opera */
  transform: scale(2);
  
}


a:link,a:visited,a:hover,
a:active {
  color: white;
}
.router-link{
    color: #fff;
}
</style>