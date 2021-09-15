// Global app controller, everythingn in controller go here

import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import Likes from './models/Likes';
import * as searchView from './views/searchView.js'; //every export item in there
import * as recipeView from './views/recipeView.js'; //every export item in there
import * as listView from './views/listView.js'; //every export item in there
import * as likesView from './views/likesView.js'; //every export item in there
import {elements, renderLoader, clearLoader } from './views/base.js'; //why is eleemnts has the brackets syntax????
//importing that Search class 

//make a search object based on search class

/*
const search = new Search('pizza');
search.getResults();
console.log('hilindaxinchaocanha');
console.log(search.query);//this works
console.log(search.result); //this doesn't show up. i think this is due to the getResults method being an async, u must wait for it to finish etc...
*/

//state
//what's the current query, current recipes, current things being liked, etc...
//there  are inifnite combination. each combination is a state
//we want to keep track of this. we don't just do something and be finished, we also update the state
//this can be simple but it can also bee so complex they have state management libraries!
//ex Redux

//GLOBAL STATE
//search objct
//current recipe obje ct
//shopping list object
//liked recipes
//we design this so that thing saren't hidden inside functins or scope, theyre centralizzed so u can quickly and easily access them
const state = {};
//it starts out empty
//state is an OBJECT
//window.state = state;
//this should not be made public. only for dev purposes. 

//-------------------------
//-------------------------
//-------------------------

//--------SEARCH CONTROLLER------------

//we define the controlSearch function out here and then we'll "embed" this inside the callback function for event handler, cuz we dont want a long callback function.
const controlSearch = async () => {
    // 1. get query from Searchview (the interface)
    const query = searchView.getInput(); 
    if (query) {
        // 2. create new search object for the query and add to state
        state.search = new Search(query);
        //yes u can store object inside object!
        
        // 3. clear interface/prepare UI 
        searchView.clearInput();
        searchView.clearResults();
        //if its empty nothing changes. being added in this ORDER only  clear the PREVIOUS search's stuff so it can make space for the new result
        renderLoader(elements.searchRes);
        
        try {
            // 4. search for recipe
            await state.search.getResults();
            //we're calling the getResults method of the search objct
            //returns a promise because it's an asynchronous method
            //we put await so that the order of things happen properly. i kinda forgot the details
            // apparently, #5 wait for #4, but somehow that doesn't mean the entire app is frozen as it's being rendered

            // 5. render results on ui
            clearLoader(); //only happens when getREsults are done. which mean recipes are ready for display
            searchView.renderResults(state.search.result);

        } catch (err) {
            alert('Something went wrong with the search');
            clearLoader();
        }
        
        
        
    }
};

//all event handlers go in controller!

//event handler for search class in html. triggered when "submit" happens
elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    //submit reloads the page as a side effect and apparently this fixes that problem
    //The preventDefault() method cancels the event if it is cancelable, meaning that the default action that belongs to the event will not occur. For example, this can be useful when: Clicking on a "Submit" button, prevent it from submitting a form
    controlSearch();
    //believe it or not we're not taking any parameter from this event handler! we get it another way! thru views!!!
});




//event handler for click next page, previous page in search results panel
//note: recall when we have an element not yet in the page, we can't even put it in a storage object like elements.. we have to call it when we need it. by typing document.querySelector..
//well with event handling for these types of elements, it's even more annoying. u need to do event delegation, where we select a parent element that's already there which will "catch" when the target element bubbles up, etc..
elements.searchResPages.addEventListener('click', e => {
    //e is our event which contains many infromation, incluiding target
    //problem: the button has a text and an icon, and these are all 3 separate things. we can build the code to react to all 3 things the same way or we can use something else: the closest method
    //closest applied on a target will give u the closest ANCESTOR element that matches your specified criteria
    //the criteria is SELECTORs, aka css seelctors. it can be a class/id/element or a complex multiple selectors etc...
    //in our case we want the closest element that has the btn-inline class
    const button = e.target.closest('.btn-inline');
    //if button exists, it means the thing that triggered the eventhandler was indeed what we wanted - a button click, and not some random click inside the result__page div
    //very concise code but powerful
    if (button) {
        const goToPage = parseInt(button.dataset.goto, 10);
        //we're accessing the data=* attribute of the element. then we convert string to integer, base 10
        //display the page's content
        searchView.clearResults();
        searchView.renderResults(state.search.result, goToPage);
        //see how powerful modules are? i can use clearResults for this and that and etc...
        
    }
});


//end of search controller


//-------------------------
//-------------------------
//-------------------------

//--------RECIPE CONTROLLER------------
//this is called by the eventhandler when user clicks on a search result

const controlRecipe = async () => {
    //get the id
    const hashId = window.location.hash;
    //this gathers the hash(tag) #.... of the current window
    //quite cool. i couldn't imagine how we're gonna get that since event handler does not give us a whole lot of information. tho we could get it from the href attribute i think..
    // we could do it similar to how we do the elements.searchResPages.addEventListener... where we find the target element and find its data attribute. i think this find the attribute thing is the traditional case. most cases we have to do this attribute thing
    const id = hashId.replace('#', ''); //replace with nothing aka delete
    //teacher did these in one step but i like two. it makes more sense
    //the other functions dont use hash of window to get the id. that's because thanks to this function which puts the id in our state grand central storage place. 
    
    //if id exists:
    if (id) {
        //Prepare UI for changes
        recipeView.clearRecipe();
        renderLoader(elements.recipe); //recall loader is that spinning sign thing. the function is stored in base.js element.recipe points to the html div that's the big middle panel
        
        //Highlight selected search item
        if (state.search) searchView.highlightSelected(id);
        //concise one line if statement
        //we needed if state.search because the controlRecipe can be activated without anyone searching. it can activated by loading the page. 
        
        //Create new recipe object
        state.recipe = new Recipe(id);
        //create new recipe object and store it in our "state" grand storage place
        
        try {
            //Get recipe data and parse ingredient
            await state.recipe.getRecipe();
            //await makes sure the next steps only happens after this is finished
            state.recipe.parseIngredients();
            
            //Calculate servings and time
            state.recipe.calcServings();
            state.recipe.calcTime();
            console.log(state.recipe);
    
            //Render recipe
            clearLoader();
            recipeView.renderRecipe(
                state.recipe, 
                state.likes.isLiked(id)
             );
        } catch (err) {
            alert('Error rendering recipe');
        }
    
    
    }
    
    
};


// Event Handling
//hash change: hash as in hashtag #
//when we click on a recipe the url goes from localhost:8800 to localhost:8800/#44757
//click on a diff recipe and it'll be a diff id. a hash change!
//and we can actually use an event listener for this hash change thing
//any click will call up the controlRecipe function, which deals with displaying the recipe in the big middle panel
//this is great cuz u found something common about all these links and yet unique for all these links that u can use as a way to trigger the event handler
//i mean u could also use the target bubbling up thing too
//this is another way
//note: if the previous page was that hash, then u refresh the page and click the link nothing will disappear because the hash  hasn't changed. also if somebody saves the url then since no hash changed nothing would load. so it's a bug/feature lol. so u also need to do an event listener for when a page loads 

//traditionally
//window.addEventListener('hashchange', controlRecipe);
//window.addEventListener('load', controlRecipe);
['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));
//loop through an array fwith for each.  pass the item into the event parameter and make the arrow function do its thing

 


//-------------------------------
//-------------------------------
//-------------------------------
//-------------------------------



//--------------------------
//LIST CONTROLLER
//--------------------------
//NOTE: the state varaible will not have a list object inside it until u click 'add to shopping list'. thats why sometimes u see it and sometimes u dont!!!!!



const controlList = () => {
    // createa a new list if there is none
    if (!state.list) state.list = new List(); //initializing an empty list object
        
    
    //add each ingredient to list and UI (from the recipe chosen)
    state.recipe.ingredients.forEach(el => {
        const item = state.list.addItem(el.count, el.unit, el.ingredient);
        //addItem method has a return that u can save 
        //we're then adding the ingredient to the UI
        listView.renderItem(item);
    }); //
     
};


//------------

//handle DELETE and UPDATE List item events
elements.shopping.addEventListener('click', e => {
    //first identify what particular item was clicked. by finding that item's id. using the closest method on the event.target. closest is so so so powerful
    const id = e.target.closest('.shopping__item').dataset.itemid; 
    //the data attribute must be of the same element as the element with shopping--item class. if data attribute belongs to a child element, it will not be readable
    //syntax structure: item.dataset.itemid
    
    //handle delete button and handle when user update value of Count of ingredient
    if (e.target.matches('.shopping__delete, .shopping__delete *')) {
        state.list.deleteItem(id); //call up deleteItem method avaialble to every List object
        listView.deleteItem(id); //deelte on UI
        
        
        
    } else if (e.target.matches('.shopping__count-value')) {
        //we want read the step attribute of a child element named input inside the div with id
        // there's an easy way! the element that is clicked (e.target) is also the one we want to read if we're talking about shopping__count_value. there's only one possible element that could satisfy.
        const val = parseFloat(e.target.value, 10); //read
        state.list.updateCount(id, val);
        //note: note: the way this is designed, it respond when u click on arrow to increase decrease but also when u click on the input field. problem is, when u enter it u MIGHT click on it, or u might double click to highlight. if u double click, it seems to not register. 
    }
    
});


//-----------------------
//-----------------------
//--------LIKES CONTROLLER-------
//-----------------------
//-----------------------
//event handler activates this when somebody click the heart button.

//TEMPORARY:    we're initliazing stuff OUTSIDE because when we first load the page, controlLike function is not called. it's only calle when user click a certain button. this lack of the likes array means there's no way to check whether the recipe is already liked or not when we display the hollow/full heart on the recipe panel. then we want the heart to not appear at first.
const controlLike = () => {
    if (!state.likes) state.likes = new Likes();
    //note tho likes is an object we only have one object for the entire app
    //the Likes object contin several hearts so to speak.
    
    //now how respond depends: is it a like or an unlike? use the isLiked method to find out
    const currentID = state.recipe.id;
   
    //has not liked before, aka this is a like:
    if (!state.likes.isLiked(currentID)) {
        // add like to the state
        const newLike = state.likes.addLike(currentID, state.recipe.title.title, state.recipe.author, state.recipe.image);
        //seems like this doesn't just create a newLike variable with a value stored. it also creates the like inside the state thing...
        //we use state.recipe because what's current on the recipe panel is also what we clicked like on
        //toggle the like button
        likesView.toggleLikeBtn(true);
        //true means its true we want the fullHeart

        //add like to ui list
        likesView.renderLike(newLike);
        //remember we cleverly returned the like item itself in the addLike method. so since newLike catches the return of the newLike method, it is the Like that we want. we didn't have to do all this:
        //likesView.renderLike(state.likes.likes.find(el => el.id === currentID));
    } else {
        //when it's been liked before, aka this is an unlike
        
        // remove like from the state
        state.likes.deleteLike(currentID);
        
        
        //toggle the like button
        likesView.toggleLikeBtn(false);
        //false means its true we want the hollow heart

        //remove like from ui list
        likesView.deleteLike(currentID);
    }
    
    likesView.toggleLikeMenu(state.likes.getNumLikes());
    //why likes.likes? first is the likes object. the second is the likes array inside the object
};


//event handler for when page loads - restore recipes
window.addEventListener('load', () => {
    state.likes = new Likes(); //initialize empty likes object
    state.likes.readStorage(); //restore likes
    likesView.toggleLikeMenu(state.likes.getNumLikes()); //toggle heart on upright corner
    state.likes.likes.forEach(like => likesView.renderLike(like)); //render likes on UI
    

});





//BUTTON CLICKS

//need to use event Delegation because we can't select the increase/decrease button to add event listener since it's not there in the html when we first load the page. it only shows up in html after a recipe is rendered
//so we "pin" it to a container that does exist at the beginning in the html. that would be the div with class="recipe"
//now we're NOT gonna use the closest method. closest method will find you the ONE thing you want. but what if u want many things? here i want to respond if plus serving is clicked, if minus serving clicked, the heart button, etc... 
//so i'll be using matches. depends what the target is, i'll respond differently

elements.recipe.addEventListener('click', e => {
    
    //the .btn-decrease * means if it's a child element of element with btn-dec , it will also be consdiered a match. that means it qualifies for this if statement. super handy!
    if (e.target.matches('.btn-decrease, .btn-decrease *')) {
        //decrease button clicked
        if (state.recipe.servings > 1) {
            state.recipe.updateServings('dec');
            recipeView.updateServingsIngredients(state.recipe);
        }
    } else if (e.target.matches('.btn-increase, .btn-increase *')) {
        //increase button clicked
        state.recipe.updateServings('inc');
        recipeView.updateServingsIngredients(state.recipe);

    } else if (e.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
        //add to shopping list button clicked
        controlList();
        //call up the list controller
        
    } else if (e.target.matches('.recipe__love, .recipe__love *')) {
        //call up the Like controller
        controlLike();
    }

});





