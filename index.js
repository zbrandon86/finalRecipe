//urls&ids
const yumAppId = 'ccbaf8cc';
const appKey = 'c0aa2b9d9790910d313bbf9474f7febb';
const yumIDURL = 'https://api.yummly.com/v1/api/recipe/'
const yumRecpURL ='https://api.yummly.com/v1/api/recipes?';
const yumRecpIngred = 'https://api.yummly.com/v1/api/metadata/ingredient?'
const options2 = {
    headers: new Headers({
        "X-Yummly-App-ID": yumAppId,
        "X-Yummly-App-Key": appKey})
};
//format the parameters
function formatParams(params) {
    const queryItems= Object.entries(params).map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)       
    return queryItems.join('&');
};

// call dish
function dishWordCall(q){
    const params = {
        q,
        requirePictures: true,
        maxResult: 28,
        start: 28

    };
    const queryString = formatParams(params)
    const url = yumRecpURL + queryString;

    fetch(url, options2)
    .then(response => {
        if(response.ok) {
            return response.json();
        }
        throw new Error(response.statusText);
    })
    .then(data => useResults(data));
    
};

//Results 1st
function useResults(data){
    console.log(data);
    let results = data.matches;	
    console.log(results);
    $.each(results, function(key, value){
        let time = value.totalTimeInSeconds;
        let totalTimeToCook = Math.floor(time / 60);

        

        let image = value.smallImageUrls[0];
        let recipeName = value.recipeName.substring(0, 45);
        let thumbnail = '<article class="card" id="' + value.id + '">'
        thumbnail += '<div class="recipeCard"><p class="rating"><i class="fas fa-star"></i> <span>' + value.rating + '</span></p>';
        thumbnail += '<p class="totalTime"><i class="far fa-clock"></i> <span>' + totalTimeToCook + ' min.</span></p></div>';
        thumbnail += '<picture class="thumbnail">';
        thumbnail += '<img src="' + image + '" name="' + value.recipeName + '" id="' + value.id + '"></picture>';
        
        if (recipeName.length == 45){
            thumbnail += '<div class="card-content"><h2>' + recipeName + '...</h2></div>';
        }
        else{
            thumbnail += '<div class="card-content"><h2>' + recipeName + '</h2></div>';
        } 
        thumbnail += '</article>';

        $('.cards').append(thumbnail);

    });

    $('article').on('click', function(){
        var recipeId = $(this).attr('id');
        
        const newUrl = yumIDURL + recipeId + '?';
        fetch(newUrl, options2)
        .then(response => {
        if(response.ok) {
             return response.json();
         }
         throw new Error(response.statusText);
        })
        .then(listResults => showResults(listResults))
        .catch(err => {
         $('#errMsg').text(`Oops: ${err.message}`);
        })
    });
    
}      

//Results 2nd
function showResults(res){
    console.log(res);
    $('.cardContainer').hide();
    $('.recpDetails').show();

    
    let image = res.images[0].hostedLargeUrl;
    let name = res.name;
    let servings = res.numberOfServings;
    let time = res.totalTime;
    let rating = res.rating;
    let sourceURL = res.source.sourceRecipeUrl;
     $('.recpInfo').append(`<article class="cardInfo">
    <picture class="newImg">
     <img src="${image}"></picture>
     <div class="newCardInfo"><span class="servings">Number of Servings: ${servings}</span>
     <span class="rating"><i class="fas fa-star"></i>${rating}</span>
     <span class="time">Time to Make: ${time}</span>
     </div>
     <div class="new-card-content">
     <h2>${name}</h2>INGREDIENTS:<br></div></a>
     <div class="sourceLink"><a href="${sourceURL}" target="_blank">Click Here for Full Recipe</a></div>
     </article>`)
    
     $.each(res.ingredientLines, function(key, value){
        $('.new-card-content').append('-' + value + '<br>');
   })

}



//call Ingredients
function ingredWordCall(ingredient){
    const params = {
        allowedIngredient: [ingredient],
        requirePictures: true,
        maxResult: 28,
        start: 28

    };
    const queryString = formatParams(params)
    const url = yumRecpURL + queryString;
    console.log(url);

    fetch(url, options2)
    .then(response => {
        if(response.ok) {
            return response.json();
        }
        throw new Error(response.statusText);
    })
    .then(data => useResults(data))
}

//call Type
function typeWordCall(typeFood){
    const params = { 
        requirePictures: true,
        maxResult: 28,
        start: 28
    };
    const queryString = formatParams(params)
    const url = yumRecpURL + '&allowedCuisine[]=cuisine^cuisine-'+ typeFood + '&' + queryString;
    console.log(url);

    fetch(url, options2)
    .then(response => {
        if(response.ok) {
            return response.json();
        }
        throw new Error(response.statusText);
    })
    .then(data => useResults(data))
}

//search by Dish
function searchByDishTerm(){
    $('.tab-1-display').on('click', '.dishButton', event => {
        event.preventDefault();
        const dishWordSearch = $('#searchTerm').val();
        dishWordCall(dishWordSearch);
        window.location.reload();
        $('.getCooking').hide();
        $('.tabContainer').hide();
        $('.mainHead').hide();
        $('.cardContainer').show();
    })
    
}


//search by Ingredient
function searchByIngred(){
    $('.tab-2-display').on('click', '.ingredButton', event => {
        event.preventDefault();
        const ingredWordSearch = $('#searchTermIngred').val();
        ingredWordCall(ingredWordSearch);
        $('.getCooking').hide();
        $('.tabContainer').hide();
        $('.mainHead').hide();
        $('.cardContainer').show();
        
        
    })
}


//search by Type
function searchByType() {
    $('.tab-3-display').on('click', '.typeButton', event => {
        event.preventDefault();
        const typeWordSearch = $('#searchTermType').val();
        typeWordCall(typeWordSearch);
        $('.getCooking').hide();
        $('.tabContainer').hide();
        $('.mainHead').hide();
        $('.cardContainer').show();

    })
}

        
        
        

$(searchByDishTerm);
$(searchByIngred);
$(searchByType);