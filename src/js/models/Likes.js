export default class Likes {
    constructor() {
        this.likes = []; 
        //contain many many likes. nor just one
    }
    
    
    addLike(id, title, author, img) { 
        const like = {
        id, 
        title, 
        author, 
        img 
        };
        //this is just an object. but spaced out differently
        this.likes.push(like); //add to the likes array 
        //save data in localStorage:
        this.persistData();
        //calling another method inside same object u must use this. toherwise it will only look inside the method itself. (i think)
        
        return like;
    }

    
    deleteLike(id) {
        //this is copied striaght from the deleteItem method of List object, and modified with the appropriate name. instead of the items array, here it is the likes array that we created for the object in the constructor method
        const index = this.likes.findIndex(el => el.id === id);
        this.likes.splice(index, 1); 
        //save data in localStorage:
        this.persistData();


    }

    
    isLiked(id) {
        //trick: find index of id and see if it's not -1. if its not -1, its 0 or 1 , 2,... that means it already exist
        return this.likes.findIndex(el => el.id === id) !== -1;
        //return true false
    }


    getNumLikes() {
        return this.likes.length;
        //length method of array
    }
    
    persistData() {
        //save data in localStorage. we do this everytime we update the likes array (when we addLIke or deleteLIke). very little effort actually!
        localStorage.setItem('likes', JSON.stringify(this.likes));
    }
    
    readStorage() {
        //retrieve data from localstorage so u can display the likes when the page is reloaded
        const storage = JSON.parse(localStorage.getItem('likes'));
        //if empty, it will return null.
        
        //setting our likes array to be whatever it was last time before page reloaded
        if (storage) this.likes = storage; 
    
    }
}