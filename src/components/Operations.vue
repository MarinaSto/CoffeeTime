<template>
<div class="wrapper">
    <div id="operations" class="container">
        <div class="row">
            <table  class="table table-striped mx-auto table-bordered table-hover mt-4">
                <thead>
                    <tr id="third-table">
                        <th scope="col">Datum</th>
                        <th scope="col">Name</th>
                        <th scope="col">Trinker</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="Oper in operations.slice().reverse()" v-bind:key="Oper.id">
                        <td>{{Oper.Datum}}</td>
                        <td>{{Oper.Bezahlt.Name}}</td>
                        <td><span style="padding: 1px 8px;" v-for="trinker in Oper.Trinkers" v-bind:key="trinker.id" class="text-muted">{{trinker.Name}}</span></td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</div>
</template>

<script>
import db from './firebaseInit'

export default {
    name:'operations',
    data(){
        return {
            operations : []
        }
    },
     firestore(){
        return {
            operations: db.collection('Operations')
        }
    },
}
</script>


<style scoped>
.wrapper{
    width: 100%;
    min-height: calc(100vh - 57.6px);
    background-image:url("../assets/history.jpg");
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
 
}
table{
    background-color: #dadadaed;
    box-shadow: 4px 4px 16px rgb(173, 173, 173);
}
</style>