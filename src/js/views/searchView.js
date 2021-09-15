/*
export const add = (a, b) => a + b;
//const add is an arrow function
export const multiply = (a, b) => a * b;
export const ID = 23; 
*/



import {elements} from './base';


//getInput from UI
export const getInput = () => elements.searchInput.value;
//one line arrow -> implicit return
//pretty weird that before i imported elements, the editor seems to know aboutthe existence of elements. don't know if it would've WORKED though

//here is a "private" function that will be used by the renderResults function.
//note it has no export. so when we export * in the controller, we won't have access to this renderRecipe function in the controller. but renderRESULT when exported will still be able to use this.... this suggests when we export we're not just copying the code we're exporting, rather we're getting access to that function. content

export const clearInput = () => {
    elements.searchInput.value = '';
};
//we put  brackets despite being one line to avoid the implicit return

export const clearResults = () => {
    //we simply remove all the innerHTML content of the element with the class result__list
    //its that simple! (in hindsight at least) u dont have to go find every item inside to remove them
    elements.searchResList.innerHTML = '';
    elements.searchResPages.innerHTML = '';
};


//when we click on a  recipe search result so that the recipe will display in main panel, we want that clicked link stays highlighted. not just when we're hovering over it
export const highlightSelected = (id) => {
    
    //CLEAR PREVIOUSLY HIGHLIGHTED STUFF
    //seems simple in hidnsight. clear first. but i was actually not sure how to make sure u don't have multiple highlighted items. i was like do we make another function to clear things? when do we implement that function? see it's not that simple! actually take brains to get an elegant solution!
    // highlighted items look like this: <a class="results__link results__link--active" href="#85354">
    //apparently he find these items with results__link instead of results__link--active. i'm not sure what difference does that make...
    const resultsArr = Array.from(document.querySelectorAll('.results__link')); //queryselectorAll returns an Node list, so we convert to array
    //for each loop to remove results__link--active:
    resultsArr.forEach(el => {
        el.classList.remove('results__link--active');
    });
    
    //HIGHLIGHT THE ITEM
    //gotta use queryselector here, because that element is not a permanent ifxture in the page. so when the base.js loads variables it will be undefined.
    //how do we find that item? what's its unique defining feature? hint: querySelector is like css selector. we usually do class and id but we can select multiple selector, we can select elements etc... queryselector select the first item that qualifies (queryselector all selects everything that qualifies).
    //i thought we're gonna do a visited but we're actually getting more specific. we find the link with the href #12345 that matches our id. in html it's usually like this:                 <a class="results__link" href="#85354">. we find it here as .results__link[href=#id]. i dont quite understand the syntax. i think that means element with class .results__link with href attribute so and so
    //important to not select all a elements (anchors) with that href id in the page, it coul'dve been in toher panels. we only select the kind that are class likes__link with so and so id
    //nuance
    document.querySelector(`.results__link[href*="#${id}"]`).classList.add('results__link--active'); //no dot! this is add to  class, not queryselector
    //weird: href*= not href=. but i had href= and it still worked here but i used href= somewhere else and it didn't work.
    //we dont mmodify css here. tho we could. we add classes/toggle classes and define them in style.css
    //whath happens if we then click another esearch result? would we have two links highlighted?
};


//ABOUT THE limitRecipeTitle function:
    //we want text in one line. simple need, complex algorithm!
     //technique: we're gonna split title into an array of words. like [parsley, italian, pizza]. then we add them one by one, each time we check if we're over the limit. if it exceed, we dont add, we stop there. we add an .... to it
    //split by space. which results in an aarray. then we apply the reduce method on the array
    //(js evaluates left to right)
    //reduce method has this format: reduce(callback function, initial value);
    ////here our initial value is 0, our callback function has the form: (accumulator, currentValue) => {kfjas;lfkasd}
    //reduce is a bit similar to for each in that it loops but it also keeps track of some result from previous rounds (hence accumulator)
    //this is really confusing because u dont actually supply paramters for accumulator and current value. it changes at every iteration!!!! accumulator starts out 0, current value starts out at initial value. (usually 0). then it does adding or multiplying or whatever u want it to do. that results in the new value of the accumulator. the accumulator's value is whatever you RETURN each round. it's very very weird. then next round. accumulator was whatever last time. then we add our current value in the array etc..
    //we totally could have done it with just forEach, by creating an external variable, and updating it etc... but we use this to learn new stuff i guess. 

export const limitRecipeTitle = (title, limit = 17) => {
    //default parameter set to 17
    const newTitle = []; //empty array at first. apparently adding is not mutating the variable so its ok to make it a const.
    
    
    //-----------------
    //FOR THE CASE TITLE IS TOO LONG: WE NEED TO PROCESS
    if (title.length > 17) {

        
    //1. first we update the array with the REDUCE method
    title.split(' ').reduce((acc, cur) => {
        
        //if total character so far plus our current word's length 
        if (acc + cur.length <= limit) {
            newTitle.push(cur); //add the new word to it
        }
        //outside inner if:
        return acc + cur.length;
        //this is returning the accumulator's value for the particular LOOP. not returning the whole limitRecipeTitle
        //this return happens regardless whether the if condition is satisfied or not. that means acc will increase and increase until the array is finished. it doesn't stop short when 17 is exceeded
    }, 0); 
       
    // 2. then we return the entire limitRecipeTitle function
        return `${newTitle.join(' ')}...`;
        //we join the array, like [oven, baked, chicken] to oven baked chicken, then we add... to make oven baked chicken...
        
        
        
    } 
    
    //-------------
    //FOR THE CASE TITLE WAS SHORT TO BEGIN WITH
    //this is for if the title was short to begin with. we keep the original. no processing. nada.
    //this is returning the entire limitRecipeTitle function
    return title;
    
};



const renderRecipe = recipe => {
    //template strings `` allows you to write nicely looking html. no more having them cramped in one line.
    //we went to index.html to copy the disabled code and here's we're "plugging" in and then enabling it
    //note in the video the recipe id property is recipe.recipdID but this forkify api is slightly difference. i figured this out by going to the end of the search controller function, added console.log(state.search.result) to see what the array in details. you're not able to call it up in the console like typing in "state". it doesnt work.
    const markup = `
        <li>
            <a class="results__link" href="#${recipe.recipe_id}">
                <figure class="results__fig">
                    <img src="${recipe.image_url}" alt="${recipe.title}">
                </figure>
                <div class="results__data">
                    <h4 class="results__name">${limitRecipeTitle(recipe.title)}</h4>
                    <p class="results__author">${recipe.publisher}</p>
                </div>
            </a>
                </li>
`;
    //where we're gonna put this markup variable's content?
    //<ul class="results__list">1stitem item lastitem X </ul>
    //we want to put it where x is. right before ul ends. using the insertadjacentHTML  thing 
    //elementname.inertAdjacentHTML(position, text);
    elements.searchResList.insertAdjacentHTML("beforeend", markup);
    
};

//type is either 'next' or 'prev'
const createButton = (page, type) => `
                <button class="btn-inline results__btn--${type}" data-goto=${type === 'prev' ? page - 1 : page + 1}>
                    <span>Page ${type === 'prev' ? page - 1 : page + 1}</span>

                    <svg class="search__icon">
                        <use href="img/icons.svg#icon-triangle-${type === 'prev' ? 'left' : 'right'}"></use>
                    </svg>
                </button>
`;
//one line implicit return. looks like if u do the ` not immediately after the => it's not one line with implicit return. it's an error and they don't spot that error they spot something else to be an error. thats the problem with code debugging.
//the data-goto we added is made so we can read from it easily later. this is the html data-* attribute. u can google for more info. even tho html will show like data-goto="..." here in js u do not add the " " around the ${...}
//this createButton function does NOT make our buttons  active. they don't work! they needed to be coded with eventhandlers to change the innerHTML of the div with the class name results__list. we wrote an event handler in the controller. that eventhandler will call up functions to clear the current things and then show the new content 
    
//private function for renderResults function
const renderButtons = (page, numResults, resPerPage) => {
    //structure: first page has only next page button, last page has only previous page button, everything else has both next and previous
    //btw we're getting reallly modular. so we write separate functions for next page and previous page buttons! that does make it quite easy to understand though. u can see the forest from the trees
    //to do this, need to know total # of pages: = results/resPerPage rounded up
    const pages = Math.ceil(numResults / resPerPage);  
    
    let button;
    //we define it outside because if we did inside if blocks, theyre block scoped, which means we wouldn't be able to access them in the line where we add it to the DOM
    if (page === 1 && pages > 1) {
        //next page button only:
        button = createButton(page, 'next');
    } else if (page < pages) {
        //both buttons
         button = `
            ${createButton(page, 'next')}
            ${createButton(page, 'prev')}
`;//we used template strings to easily join them to make the button variable's string

    } else if (page === pages && pages > 1) {
        //previous page button only 
        button = createButton(page, 'prev');

    } 
    //these 3 if statemetns covered all situations. if its only 1 page in total no buttons is displayed.
    
    elements.searchResPages.insertAdjacentHTML('afterbegin', button);
};
 
    
export const renderResults = (recipes, page = 1, resPerPage = 10) => {
    //parameter recipes is an array . let's loop through it
    //to paginate, all we really need to do is to first define which items we want displayed and then use the slice method to make it happen. slice method has this parameter structur (start, end). ex (2,4). that means 2 and 3 is displayed. 4 is not displayed. 
    // want item 0 to 9 displayed: so start is 0, end is 10. but we want to code it so that it works for displaying 2, 3, 4, 10 pages, and any preference of results per page. figure out in math. cuz the coding is easy. 
    
    //render current page
    const start = (page - 1) * resPerPage;
    const end = page * resPerPage;
    recipes.slice(start, end).forEach(el => renderRecipe(el));
    //we like to seperate tasks. we do functions that do one small thing.
    //then we also need to display page numbers 
    
    //render pagination
    renderButtons(page, recipes.length, resPerPage);
};

