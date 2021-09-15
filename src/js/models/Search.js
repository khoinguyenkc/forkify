    //importing the axios package: (very similar to importing things from antoehr js file)
import axios from  'axios';
//it will function like Fetch, but friendly to old brwosers
//no need to convert to json
import {proxy} from '../config';

//i think it's an exporrt DEFAULT because theres only one thing we're exporting in this file
export default class Search {
    constructor(query) {
        this.query = query;
    }
    

//if its a non-async method, u would do getResults(query) {}
    async getResults() {
    
        try {   

            const res = await axios(`${proxy}https://forkify-api.herokuapp.com/api/search?q=${this.query}`);
            //if u have multiple paramters it's like this  ?q=pizza&?key?=193284234
            //the result of the promise is stored in res
            this.result = res.data.recipes; //this is an array stored inside the res json
            //is result a special thing of a promise or are we just setting a property named result just like any other property?? dont quite remember
            //the way he talks about it, i think this is another property of th eobject
            //it'll be stored inside your object. not inside the getResults method.
            //its been so long i dont remember the rule for how to figure out what the this variable is. 
            //looks like i can only have this.result in my object after i call up this getREsults method. but then i tried to call this.result up and it doesn't seem to work
            
        } catch (error) {
            alert(error);
        }
    }

}