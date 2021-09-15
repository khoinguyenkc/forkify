import uniqid from 'uniqid';

//a list item is one ingredient only
export default class List {
    constructor() {
        this.items = [];
    }
    
    addItem (count, unit, ingredient) {
        const item = {
            id: uniqid(),
            count,
            unit,
            ingredient,
        } //an object
        
        this.items.push(item);
        return item;
    }
    
    
    deleteItem(id) {
        //we find index of [the item in the items array] with that id and delete it:
        const index = this.items.findIndex(el => el.id === id);
        
        //splice is cut and paste. slice is copy and paste, aka your original array still same
        //their syntax is quite different tho
        //splice(3) means take out the item index3 until the end. splice (3,1) start at at item index 3 and take one item, so just index 3. splice(3,0) is take nothing! splice (3,2) means start at index 3 and take 2, so take index 3 and 4..
        //slice with 1 para: start there and copy until the end. 2 para: start and end. end index is NOT copied. ex: slice(3,4) means take item index 3 only! slice(3,3) means take nothing!  slice(3,8) means take item index 3,4,5,6,7. no 8!
        this.items.splice(index, 1); //delete item object. we don't want to return, so not storing it in any variable.
    }
    
    updateCount(id, newCount) {
        this.items.find(el => el.id === id).count = newCount;
        console.log(this.items.find(el => el.id === id));
        //this es6 method is so handy u're not finding the index, u find the actual item. sometimes u need to use index like in using the splice method, but here we dont need to do that. the syntax of the criteria is same as findIndex.
        //newCount is a parameter, not calculated. i think that newcount is calculate in another function. that updateServings function i think.
    }
    
    
}