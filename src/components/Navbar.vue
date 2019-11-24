<template>
<nav  class="navbar-dark bg-dark">
<div class="container">
<div class="row d-flex  justify-content-between">
    <div class="col-3">
        <router-link to="/">Coffe Time</router-link>
    </div>
    <div class="col-9 rights d-flex justify-content-end">
         <ul>
            <li v-if="isLoggedIn"><span>{{currentUser}}</span></li>
            <li v-if="isLoggedIn" id="nav_home"><router-link to="/">Home</router-link></li>
            <li v-if="isLoggedIn" id="nav_home"><router-link to="/status">Status</router-link></li>
            <li v-if="isLoggedIn" ><router-link to="/new">Manage</router-link></li>
            <li v-if="isLoggedIn" ><router-link to="/operations">Logs</router-link></li>
            <li v-if="!isLoggedIn"><router-link to="/login">Login</router-link></li>
            <li v-if="!isLoggedIn"><router-link to="/register">Register</router-link></li>
            <li v-if="isLoggedIn"><button v-on:click="logout">Logout</button></li>
        
        </ul>
    </div>
    </div>
       
</div>
</nav>
   
</template>


<script>
    import firebase from "firebase"
    export default {
        name: 'navbar',
        data() {
            return {
                isLoggedIn: false,
                currentUser: false
            }
        },
        created(){
            if(firebase.auth().currentUser){
                this.isLoggedIn = true;
                this.currentUser = firebase.auth().currentUser.email;
            }
        },
        methods: {
            logout: function(){
                firebase.auth().signOut().then(() => {
                    alert("You are logged out");
                    this.$router.go({path: this.$router.path});
                }, error => {
                    var errorCode = error.code;
                    var errorMessage = error.message;
                    alert("Error code: " + errorCode +"\nMessage: "+ errorMessage);
                })
            }
        }
    }
</script>

<style>
nav{
    /* background:rgb(240, 190, 181); */
    padding: 12px 0;
    color: #ccc;
}
.row{
    width: 100%;
}
nav .router-link{
    color: #ccc;
}
/* unvisited link */
a:link,a:visited,a:hover,
a:active {
  color: #ccc;
}
nav div, nav .rights{display:flex;
    align-items: center;}
ul {
  list-style-type: none;
  display: flex;
  justify-content: space-between;
  margin: 0;
  padding: 0;
 
}
li{
    padding: 0.3rem 2rem;
    /* border-radius: 5px; */
    /* background: blue; */
    /* box-shadow: 2px 2px 3px rgb(119, 119, 119); */
}
button{
    background: none;
	color: inherit;
	border: none;
	padding: 0;
	font: inherit;
	cursor: pointer;
	outline: inherit;
}
</style>