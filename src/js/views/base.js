//BASE is where we store things that can be used by many files./modules 


//this is a place where we store all our DOM ELEMENTS from the html that we might want to select
//this makes it easy to find and easy to edit without having to go back adn change every item
//we employed this practice in the budgety app and we're dong it here again
//decoupling

//elements is an object
export const elements = {
    searchForm: document.querySelector('.search'),
    searchInput: document.querySelector('.search__field'),
    searchRes: document.querySelector('.results'),
    searchResList: document.querySelector('.results__list'),
    searchResPages: document.querySelector('.results__pages'),
    recipe: document.querySelector('.recipe'),
    shopping: document.querySelector('.shopping__list'),
    likesMenu: document.querySelector('.likes__field'),
    likesList: document.querySelector('.likes__list'),
};

//more softcoding: 
export const elementStrings = {
    loader: 'loader', //no dot on purpose! 
};


//the loading spinner - make it appear
export const renderLoader = parent => {
    //parent means the parent html element we want to attach the spinner to
    //all we do is we write some html code to make the spinner appear
    //it's not much code because the meat is in the css class loader.
    const loader = `
        <div class="${elementStrings.loader}">
            <svg>
                <use href="img/icons.svg#icon-cw"></use>
            </svg>
        </div>
        `;
    //question: how does it know where to look for the img folder? answer: this is added to the index.html file.
    
    
    parent.insertAdjacentHTML('afterbegin', loader);
};




//the loading spinner - make it disappear

export const clearLoader = ( ) => {
    //has no parameter so it clears all loaders, 
    //the key is to be able to pinpoint it and just it and nothing else, and delete it

    const loader = document.querySelector(`.${elementStrings.loader}`);
    //why we didn't add document.querySelector('.loader') to the elements object: because that elements object's v alues are loaded ahead of time. it's loaded that one time. and it's not updated consnatly in real time. which means when it was loading, the loader class was no where to be found. the loader class is not a permanent fixture, so to speak. so we must select it here as we need it, and we know that when we want to clear it, thats because it exists currently.
    if (loader) {
        loader.parentElement.removeChild(loader);
        //recall: to remove something in the dom, must travel up to parent and down to remove child
        //not sure why we have to use an if. if we use clearLoader when theres nothing to delete would it cause errors?
    }
};


//PAGINATION
