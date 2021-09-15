import axios from 'axios';
import {proxy} from '../config';
//two dots mean one folder agove. one dot means same folder.

export default class Recipe {
    constructor(id) {
        this.id = id;
    }
    
    async getRecipe() {
        try {

            const res = await axios(`${proxy}https://forkify-api.herokuapp.com/api/get?rId=${this.id}`);
            //this variable res will store the return of the promise, where we'll get all the recipe information
            this.title = res.data.recipe;
            this.author = res.data.recipe.publisher;
            this.image = res.data.recipe.image_url;
            this.url = res.data.recipe.source_url;
            this.ingredients = res.data.recipe.ingredients;
        } catch (error) {
            console.log(error);
            alert('Something went wrong');
        }
    }
    
    
    
    calcTime() {
        //we just say 3 ingredients is 15min.. 6 30min...
        const numImg = this.ingredients.length;
        const periods = Math.ceil(numImg/3);
        this.time = periods * 15;
    }
    
    calcServings() {
        this.servings = 4;
        //we didn't need to do a method but we did it to simulate a real algorithm, which would have to be a method, not just always 4
    }
    
    
    parseIngredients() {
        //this is a lot of work because words really do vary. a machine won't do  perfect job but we try to achieve a decent job. we'll "read" and standardize units
        
        const unitsLong = ['tablespoons', 'tablespoon', 'ounce', 'ounces', 'teaspoon', 'teaspoons', 'cups', 'pound'];
        const unitsShort = ['tbsp', 'tbsp', 'oz', 'oz', 'tsp', 'tsp', 'cup', 'pound'];
        const units = [...unitsShort, 'kg', 'g']// ... is destructuring. 
        // a great use of arrays. u can guess what we're doing
        
        
        //map loops through an array and do something to each item that produces a corresponding item in a new array. just like mapping in calculus
        const newIngredients = this.ingredients.map(el => {
            // 1. uniform units
            let ingredient = el.toLowerCase(); //because scanning requires exact match
            unitsLong.forEach((unit, i) => {
                ingredient = ingredient.replace(unit, unitsShort[i]);
                //"ingredient" is an item in the ingredients array, and now we're put it through our scan macine which is the unitsLong thing. if there's a match, we replace with the desired equivalent (same index but unitsShort). this is indeed a loop inside a loop. one map one foreach
            });
            
            // 2. remove parentheses
            ingredient = ingredient.replace(/ *\([^)]*\) */g, ' ');
            //that sign mess stands for any string combination that starts and end with parenthesis, any space right next to begin and end and any text character in the middle
            //if u want these just google "regular expression". it's a powerful way to specify what string combinations u want to match
            
            
            // 3. parse ingredients into count - unit - ingredient (ex: 3 cup flour)
            const arrIng = ingredient.split(' '); //ex: [2, cups, of, flour]
            
            //first we want to locate the index of the UNIT word in the array. ex: cup
            //cant use indexOf because that only gives u index if you know exactly what word you want. we must use something else: findIndex
            //findIndex: loops through the array and gives you the index of the items that passeyour test/returns true 
            //the test is defined by you, it's whatever criteria you set
            //in our case, the test is whether the word matches our unitsShort array
            const unitIndex = arrIng.findIndex(el2 => units.includes(el2));
            //the includes method helped us get this done
            //findIndex is helpful 
            
            //what do we  do with that unitIndex thing? i don't even know what form unitIndex will be. will it be an array? what does it look like. all i'm told is that if theres no matching word, unitIndex will be === -1. we've heard that kind of thing before. but heres the weird thing: an empty array is greater than -1. so === -1 does notn ecessarily means its an empty array. we dont know what it is.
            //again dont extrapolate. all we know is if theres not matching item, unitIndex will be === -1
            //also it seems he assumes we will find at most one item that returns true. aka one unit word. i have no idea what happens if there are 2 or more
            
            
            let objIng; //initalize outside because let and const are blcok scoped inside ifs, not accessible outside if defined inthere
            
            if (unitIndex > -1) {
                //there is a unit
                //we'll assume all things before unit is number. ex: 4 1/2 CUP.
                //it seems we also assume at most there is one unit word
                
                const arrCount = arrIng.slice(0, unitIndex);
                //explain:  slice will take item 0 with it and will NOT take the unitIndex item. ex: 4 1/2 cup. if unitindex = 3(cup), it will take 4 1/2
                //aka we're taking everything left of unit index
                
                let count;
                if (arrCount.length === 1) {
                    count = eval(arrIng[0].replace('-', '+')); //if only one then it's the first element. ex: 3 cups. 3.
                    //we replace minus with plus because sometimes things like 1-1/3 seems like 1 minus 1/3 but its actually 1 plus.
                    ////eval means its not just a string we want to evaluate the math expression
                    //i hope 4+1/2 will never be mistaken as say 4+1 / 2. i know pemdas so division goes first but...    
                } else {
                    //if more than one, u have to take everything left of unit index and add them. ex: 4 1/2 cups => 4 1/2 => 4 + 1/2 = 4.5
                    count = eval(arrIng.slice(0, unitIndex).join('+'));
                    //we could have done eval(arrCount.join('+')) too
                }
                
                objIng = {
                    count: count,
                    unit: arrIng[unitIndex],
                    ingredient: arrIng.slice(unitIndex + 1).join(' ') //we're taking everything right of unit index
                }
              
                
            } else if (parseInt(arrIng[0], 10)) {
                //explanation: we take first word (element 0) and see if we could parse it to an integer. if we could the value is true. if we can't, it'll be not a number NaN which is then coerced to be false. if this elseif staement qualifies, it means unitIndex is not greater than -1 but first element is a number,
                //this implies no unit but 1st element is a number
                //ex: 2 eggs
                objIng = {
                    count: parseInt(arrIng[0], 10),
                    unit: '',
                    ingredient: arrIng.slice(1).join(' ') //slice takes a fragment of the array. in our case starting at item indexed 1, and since no end parameter it goes to the end. then we join them into 1 string with a space.
                }
                
            } else if (unitIndex === -1) {
                //not unit and no number in first element
                //ex: 'parsley'
                objIng = {
                    count: 1,
                    unit: '',
                    ingredient: ingredient //we put the whole line here
                }
            
            }
            
            return objIng; //save this into the new array. mapping requires returning one thing at the end each loop.
        });
        
        
        
        this.ingredients = newIngredients; //updating the original with the new mapped array
    }
    
    
    updateServings (type) {
        //type is either inc or dec. this function increase or decrease incrementally. as in 4 to 5 to 6 as u click plus sign twice. u can't input a number
        
        //serving count on UI
        const newServings = type === 'dec' ? this.servings - 1 : this.servings + 1;
        //note: not updating the this.servings property. it's assigning to the newServings variable!!!! 
        //we don't want to update the servings property yet. we'll do it later.
        
        //adjust amount of each ingredient
        this.ingredients.forEach(ing => {
            ing.count *= (newServings / this.servings);
            //explain: example this.servings = 4. neservings is 5. if current requires 2 eggs, then 2 * 5/4 = 2.5 eggs. i like to think of it more as 2 / 4 , then multiply by 5. same results but more intuitive. 
            //for each does not return anything. thats why u dont see a varaible to "receive" a return in the form const variablename = this.ingredients.forEach.... 
        });
        
        this.servings = newServings; //NOW we're updating
        
    }
};


