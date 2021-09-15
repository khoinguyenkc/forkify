import { elements } from './base';
import { limitRecipeTitle} from './searchView'; //borrowing this one function
//function to toggle like(heart) button
export const toggleLikeBtn = fullHeart => {
    //fullHeart is boolean true false. it ask whether u WANT to set fullheart or not.
    const iconString = fullHeart? 'icon-heart' : 'icon-heart-outlined';
    // i change parameter name to fullheart cuz it's more accurate. the isLiked is likely confusing with the other isLiked thing.
    document.querySelector('.recipe__love use').setAttribute('href', `img/icons.svg#${iconString}`);
    //the syntax is like css syntax here. we're selecting the use element inside the element with the class recipe-love
};



//function toggle the like MENU (whether the bigt heart on the right side shows up at all)
export const toggleLikeMenu = numLikes => {
        elements.likesMenu.style.visibility = numLikes > 0 ? 'visible' : 'hidden';
        //didn't need to use the elements thing we just wanted to
        //since this is one property, we set style here instead of toggling a class for css styling
};

export const renderLike = like => {
    // remember when we "heart" a recipe, we are using the addLike method, which stores exactly what we need to display it here in the menu: id, title, author, and img. so we just find that like in the like array of our like object.
    //that like item in the like array is exaclyt what we'repassing to the parameter in this function
    //the reason we take the like instead of just an id is because here in our likesView.js file we do not have access to state.recipe.likes.... etc... that's only available in the controller. when u dont have to think bout thse kind of things it seems simple but it's not. it's a lot of architecture  to figure out
    const markup = `
    <li>
        <a class="likes__link" href="#${like.id}">
            <figure class="likes__fig">
                <img src="${like.img}" alt="${like.title}">
            </figure>
            <div class="likes__data">
                <h4 class="likes__name">${limitRecipeTitle(like.title)}</h4>
                    <p class="likes__author">${like.author}</p>
            </div>
        </a>
    </li>
`;
    
    elements.likesList.insertAdjacentHTML('afterbegin', markup);

    //this renderLike function is super similar to the renderRecipe function in the recipeView.js file. important to have these meta knowledge
    
};

export const deleteLike = id => {
    //this is similar to the deleteItem in listView.js
    //but the way we find it in the queryselector is similar to the highlightSelected function in searchView.js. 
    //important to not select all a elements (anchors) with that href id in the page, it coul'dve been in toher panels. we only select the kind that are class likes__link with so and so id
    const el = document.querySelector(`.likes__link[href*="${id}"]`).parentElement;
    //we're selecting the link but we're not remove the a element. we want to remove the li element one level above it. 
    if (el) el.parentElement.removeChild(el); 

}