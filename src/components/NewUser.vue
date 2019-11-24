<template>
<div class="wrapper">
    <div id="new-user" class="container">
        <div class="row">
            <table  class="table table-striped mx-auto table-hover mt-4">
                <thead class="mt-4">
                    <tr id="first-table">
                        <th scope="col">ID</th>
                        <th scope="col">Name</th>
                        <th scope="col">Active</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="user in users" v-bind:key="user.id">
                        <!-- <td>{{user.Active}}</td>  -->
                        <td>{{user.Firma_id}}</td>
                        <td>{{user.Name}}</td>
                        <td v-if="user.Active"><i class="fas fa-check-square" @click="disableUser(user)"></i></td>
                        <td v-else @click="enableUser(user)"><i class="fas fa-exclamation-circle"></i></td>
                    </tr>
                </tbody>
            </table>
            <form @submit.prevent="addUser" class="form-inline mx-auto">
                <label for="name" class="font-weight-light m-1"></label>
                <input type="text" id="firma_id " v-model="Firma_id" class="form-control m-1" placeholder="Insert id" required>
                <input type="text" id="name" v-model="Name" class="form-control m-1" placeholder="Insert new Name" required>
                <input type="submit" value="add" class="btn btn-info m-1">
            </form>     
        </div>
    </div>
</div>
</template>

<script>
import db from './firebaseInit'

export default {
    name:'new-user',
    data(){
        return {
            users: [],
            Firma_id: "",
            Name: "",
            Active: true,
            id: 0,
            Bezahlt: 0,
            Getrunken: 0
        }
    },
    firestore(){
        return {
            users: db.collection('Users')
        }
    },
    
    methods:{
        disableUser: function(User){
            let key=User.id            
            var activeRef = db.collection("Users").doc(key);
            // Set the Active to false of the det user
            console.log("disable user called on: "+User.id)
            return activeRef.update({
                Active: false
            })
            .then(function() {
                // console.log("Document successfully updated!");
                console.log("remuse user: "+User.id) 
                let check =  db.collection("Users").doc(User.id);
                console.log("USER "+User.Name +" ACTIVE "+User.Active +" Bezeled "+ User.Bezahlt + " Bevuti " + User.Getrunken ) 
               
                if((User.Bezahlt - User.Getrunken) == 0){
                    check.delete().then(function() {
                    console.log("Document successfully deleted!");
                     }).catch(function(error) {
                     console.error("Error removing document: ", error);
                    });
                }else{
                console.log("Impossible to remove the user. Active:"+User.Active+" diff: "+(User.Bezahlt-User.Getrunken))
                }
            }) 

            .catch(function(error) {
                // The document probably doesn't exist.
                console.error("Error updating document: ", error);
            });
            
        },
         enableUser: function(User){
            var activeRef = db.collection("Users").doc(User.id);
            return activeRef.update({
                Active: true
            })
            .then(function() {
                console.log("Document successfully updated!");
            })
            .catch(function(error) {
                // The document probably doesn't exist.
                console.error("Error updating document: ", error);
            });
            // userRef.child(User['.key']).update({Active: true})
        },
        addUser: function(){
            // console.log("this è questo"+this)
            db.collection("Users").add({
                Name: this.Name,
                Active: this.Active,
                Firma_id: this.Firma_id,
                id: this.id ,
                Bezahlt: this.Bezahlt,
                Getrunken: this.Getrunken
                })
                // .then(docRef => this.$router.push('/'))
                .catch(error => console.log(err))        
        }
    }
}
</script>

<style scoped>
.wrapper{
    width: 100%;
    min-height: calc(100vh - 57.6px);
    background-image:url("../assets/team.jpg");
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
 
}
table{
    background-color: #dadadaed;
    box-shadow: 4px 4px 16px rgb(173, 173, 173);
}
h3{
    padding: 10px 0;
    color: rgb(68, 57, 57);
}
td{
    font-size: 1.2rem;
    color: rgb(54, 54, 54)
}
.fa-exclamation-circle{
    color: rgb(190, 6, 6);
}
.fa-check-square{
    color: green;
}
</style>