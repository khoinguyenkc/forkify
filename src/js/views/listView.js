import { elements } from './base';


//render item
export const renderItem = item => {
  const markup = `                
    <li class="shopping__item" data-itemid=${item.id}>
        <div class="shopping__count" >
            <input type="number" value="${item.count}" step="${item.count}" class="shopping__count-value">
            <p>${item.unit}</p>
        </div>
        <p class="shopping__description">${item.ingredient}</p>
        <button class="shopping__delete btn-tiny">
            <svg>
                <use href="img/icons.svg#icon-circle-with-cross"></use>
            </svg>
         </button>
    </li>
`;  
    elements.shopping.insertAdjacentHTML('beforeend', markup); //added to the bottom
    
    //we added a data attribuet that put in the item id.
    //this makes finding and deleete the item easy
    //the data attribute has no " " around tho other attributes do... very weird
    //class="shopping__count-value" was added so we esily access the value attribute there. that's what gonna go into the updateCount method as newCount
};




//delete item
export const deleteItem = id => {
    const item = document.querySelector(`[data-itemid="${id}"]`);
    //we used css query selector by adding the [ ] inside the ``. complex syntax. but worse it's hard to know when to use which
    //this is looking for the element with the attributes so and so. this is different from ACCESSING the element's data attribute. in that case u go elementname.dataset.itemid;
    //remove that thang:
    item.parentElement.removeChild(item); //this means remove the child inside the parent element that satisifies document.queryselector.....
    //super retarded syntax
};