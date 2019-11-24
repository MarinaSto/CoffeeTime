<template>
<div class="wrapper">
    <div id="status" class="container">        
        <div class="row ">
            <div class="col">
                <table  class="table table-striped mx-auto table-hover mt-4">
                    <thead>
                        <tr id="second-table">
                            <th scope="col">ID</th>
                            <th scope="col">Name</th>
                            <th scope="col">Bezahlt</th>
                            <th scope="col">Getrunken</th>
                            <th scope="col">Differenz</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="user in users" v-bind:key="user.id">
                            <td>{{user.Firma_id}}</td>
                            <td>{{user.Name}}</td>
                            <td>{{user.Bezahlt}}</td> 
                            <td>{{user.Getrunken}}</td>
                            <td>{{differenz(user)}}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        
        </div>

    </div>
</div>
</template>

<script>
import db from './firebaseInit'
export default {
    name:'status',
    data(){
        return {
            users : [],
            editUser:{
                Trinker:[],
                Bezahler: ''
            }
        }
    },
   
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
.wrapper{
    width: 100%;
    min-height: calc(100vh - 57.6px);
    background-image:url("../assets/operations.jpg");
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
 
}
#nav_home{
    font-weight: 700;
    color: white;
}
#home h3{
    margin: 20px 0;
}
table{
    background-color: #dadadaed;
    box-shadow: 4px 4px 16px rgb(173, 173, 173);
}
form{
    background: rgba(36, 208, 235, 0.062);
    box-shadow: 2px 2px 8px rgb(173, 173, 173);
    padding:0 1rem ;
}
form select{
     box-shadow: 2px 2px 8px rgb(173, 173, 173);
   
}
</style>