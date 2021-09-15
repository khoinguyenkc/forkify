import {elements} from './base';
import {Fraction} from 'fractional'; //external packge dont need paths. that Fraction name is not up to you. 


export const clearRecipe = () => {
    elements.recipe.innerHTML = '';
};
// one line but still {} becuaes we dont want implicit return

//only change the display. 1.25 remains 1.25. but display as 1 and 1/4
const formatCount = count => {
    if (count) {
        //gotta make sure count is defined, because many times there's no count
        //first u convert count to a string, then u split. then u covert these 2 string items to integers
         //to prevent .333333 problems we're gonna round our number. math.round only round to whole. to work around, first multiply, round, then divide. to get 4 decimal places, multiply by 4 zeros: 10,000
        const newCount = Math.round(count * 10000) / 10000;
        const [int, dec] = newCount.toString().split('.').map(el => parseInt(el, 10));
        //ex: 2.5 will become array of 2 and 5. not 2 and .5!!!!
        
        if (!dec) return newCount; //if no decimal, ex: 3 has no decimal, u just return 3. job done!
        //note how smart it is to put this test HERE, to make use of the int, dec thing. a less efficient approach would be to first test if "count" is a whole or decimal number, then only processing it if it's decimal. here it's smart cuz the processing helps determine whehter it has decimals! 2 birds one stone. if we did this "by hand" in our head we wouldn't have done this, but this is code, it's different!
        
        //two scenarios left: 0.5 vs 2.5. it all boils down to two types of sitations. easy in hindsight but actually not easy to figure out all the cases can be accounted for in simply 2 ways!!! 
        if (int === 0) {
            const fr = new Fraction(newCount); //fraction will convert 0.5 to 1/2. straightforward. technically it returns a numerator of 1 and a denom of 2. so gotta make that 1/2 yourself
            return `${fr.numerator}/${fr.denominator}`;
            
        } else {
            //this is the 2.5 situation. first we proess the .5 part. remember if 2.5, int is 2, dec is 5 not .5. how to get .5? count - int! 2.5 - 2. clever! only seems easy in hindsight
            const fr = new Fraction(newCount - int); // 1/2
            return `${int} ${fr.numerator}/${fr.denominator}`; //2 1/2

        }
    
    } 
    return '?'; //if you fail the IF above. aka "count" is undefined
};
//note. 1/3 will be converted to .3333333. we need to round our numberes before feeding it here
//thats the thing about a machine doing work. it's like a machine, it makes no adjustment






//private function for use by renderRecipe. this creates the markup depending how many ingredients we have. 
//context of use: ${recipe.ingredients.map(el => createIngredient(el)).join('')}
//we first take the ingredients ARRAY, which contain little ingredient arrays, map it to this function to create a new ARRAY that contain markup elements. as in, [markupforingredient1, makrupforingredient2, ...]. only THEN do we join this array of markup to get a block of mark up like <div>...</div> <div>....</div> etc... i thought this would be hard how would we able to loop and have it connect but turn out it's just joining!
 const createIngredient = ingredient => `
        <li class="recipe__item">
            <svg class="recipe__icon">
                <use href="img/icons.svg#icon-check"></use>
            </svg>
            <div class="recipe__count">${formatCount(ingredient.count)}</div>
            <div class="recipe__ingredient">
                <span class="recipe__unit">${ingredient.unit}</span>
                ${ingredient.ingredient}
            </div>
        </li>


`;




//warning: renderRecipe sounds familiar, might be collided
export const renderRecipe = (recipe, isLiked) => {
    //context: after the recipe object has gone through pareseINgredient and calcServingtime and calc.., it is fed to this renderRecipe thing for displaying on the big middle panel
    
    const markup = `
            <figure class="recipe__fig">
                <img src="${recipe.image}" alt="${recipe.title}" class="recipe__img">
                <h1 class="recipe__title">
                    <span>${recipe.title.title}</span>
                </h1>
            </figure>
            <div class="recipe__details">
                <div class="recipe__info">
                    <svg class="recipe__info-icon">
                        <use href="img/icons.svg#icon-stopwatch"></use>
                    </svg>
                    <span class="recipe__info-data recipe__info-data--minutes">${recipe.time}</span>
                    <span class="recipe__info-text"> minutes</span>
                </div>
                <div class="recipe__info">
                    <svg class="recipe__info-icon">
                        <use href="img/icons.svg#icon-man"></use>
                    </svg>
                    <span class="recipe__info-data recipe__info-data--people">${recipe.servings}</span>
                    <span class="recipe__info-text"> servings</span>

                    <div class="recipe__info-buttons">
                        <button class="btn-tiny btn-decrease">
                            <svg>
                                <use href="img/icons.svg#icon-circle-with-minus"></use>
                            </svg>
                        </button>
                        <button class="btn-tiny btn-increase">
                            <svg>
                                <use href="img/icons.svg#icon-circle-with-plus"></use>
                            </svg>
                        </button>
                    </div>

                </div>
                <button class="recipe__love">
                    <svg class="header__likes">
                        <use href="img/icons.svg#icon-heart${isLiked? '' : '-outlined'}"></use>
                    </svg>
                </button>
            </div>

            <div class="recipe__ingredients">
                <ul class="recipe__ingredient-list">

                ${recipe.ingredients.map(el => createIngredient(el)).join('')}

                </ul>

                

                <button class="btn-small recipe__btn recipe__btn--add">
                    <svg class="search__icon">
                        <use href="img/icons.svg#icon-shopping-cart"></use>
                    </svg>
                    <span>Add to shopping list</span>
                </button>
            </div>

            <div class="recipe__directions">
                <h2 class="heading-2">How to cook it</h2>
                <p class="recipe__directions-text">
                    This recipe was carefully designed and tested by
                    <span class="recipe__by">${recipe.author}</span>. Please check out directions at their website.
                </p>
                <a class="btn-small recipe__btn" href="${recipe.url}" target="_blank">
                    <span>Directions</span>
                    <svg class="search__icon">
                        <use href="img/icons.svg#icon-triangle-right"></use>
                    </svg>

                </a>
            </div>

    `;
    
    elements.recipe.insertAdjacentHTML('afterbegin', markup);
    
};






export const updateServingsIngredients = recipe => {
    //at first i thought we didn't need to do this. we can simply copy and paste some of the lines in recipecontrol, aka the commands to clear the UI and then             //recipeView.renderRecipe(state.recipe)
    //i guess that works stoo but then the whole panel would have to be reloaded and you'll have to wait and see the spinning signs... not good. we just want to update apart of it immediately.
    //update Servings on UI:
    document.querySelector('.recipe__info-data--people').textContent = recipe.servings; //update its value. it's orignal value was also recipe.servings. now it's the update recipe.servings. query selector because the element didn't exist at the beginning when the page loads
    
    //update ingredients on UI:
    //i thought we'll be clearing the inner html of the div that contain these and then simply call up the createIngredients etc... but i guess that's too aggressive. we're doing something milder. we're selecting and updating the value
    //selectall, convert nodelist toarray:
    const countElements = Array.from(document.querySelectorAll('.recipe__count'));
    //then we loop through the array, updating it by making it getting the updated value
    countElements.forEach((el, i) => {
        el.textContent = formatCount(recipe.ingredients[i].count);
    });
};
