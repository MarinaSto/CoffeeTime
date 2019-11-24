<template>
<div class="wrapper">
     <div class="container d-flex justify-content-center align-item-center">
        <div class="wrapper-login d-flex align-self-center flex-column justify-content-around">
        
            <h3 class="d-flex justify-content-center">Sign Up</h3>
            <form class="form-login">
                <div>
                    <input class="form-control" type="text" id="email" v-model="email" placeholder="Email address" required autofocus> 
                </div>
                <div>
                    <input class="form-control" type="password" id="password" v-model="password" placeholder="Password" required autofocus>     
                </div>
                <button class="btn btn-lg btn-warning btn-block text-uppercase" v-on:click="register">Sign Up</button>
            </form> 

            <div class="separator"> OR </div>
            <button class="btn btn-lg btn-info btn-block text-uppercase"><router-link to="/login">Login</router-link></button>
            
        </div>
    </div>
</div>    
</template>

<script>
import firebase from 'firebase';

export default {
  name: 'register',
  data: function(){
      return {
          email: '',
          password: ''
      }
  },
  methods: {
      register: function(e) {
          console.log(`register username ${this.email}`);
          console.log(`register pwd ${this.password}`);
          firebase.auth().createUserWithEmailAndPassword(this.email, this.password).then(user => {              
              alert(`Account created as ` + user.user.email)
              this.$router.go({path: this.$router.path});
          }, error => {
                var errorCode = error.code;
                var errorMessage = error.message;
              alert("Error code: " + errorCode +"\nMessage: "+ errorMessage);
          })
          
          e.preventDefault();
      }
  }
}
</script>
<style scoped>
.wrapper{
    width: 100%;
    height: calc(100vh - 57.6px);
       background-image:url("../assets/background-caffe.jpg");
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
 
}
.wrapper .container{
    height: 100%;
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


.separator {
    display: flex;
    align-items: center;
    text-align: center;
}
.separator::before, .separator::after {
    content: '';
    flex: 1;
    border-bottom: 1px solid #000;
}
.separator::before {
    margin-right: .25em;
}
.separator::after {
    margin-left: .25em;
}
a:link,a:visited,a:hover,
a:active {
  color: white;
}
.router-link{
    color: #fff;
}
</style>
