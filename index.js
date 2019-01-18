const recipeURL = 'https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/search?number=20&';
const rapidKey = 'SEHxbUG4JNmshq5esXxrSnkcAtjOp1AwYTLjsnoIzz3NSZcpe7';
const getRecpURL = 'https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/'
const options = {
    headers: new Headers({
        "X-RapidAPI-Key": rapidKey})
};

function formatParams(params) {
    const queryItems= Object.keys(params) 
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
            return queryItems.join('&');
};


function getResults(query){
    const params = {
        query: query

    };
    const queryString = formatParams(params)
    const url = recipeURL + queryString;

    fetch(url, options)
    .then(response => {
        if(response.ok) {
            return response.json();
        }
        throw new Error(response.statusText);
    })
    .then(data => {
        data.results.map(ids => useResults(ids))
    })
};

function useResults(ids){
    const resultIds = ids.id;
    const newIdUrl = getRecpURL + resultIds + '/information';

    fetch(newIdUrl, options)
    .then(response => {
        if(response.ok) {
            return response.json();
        }
        throw new Error(response.statusText);
    })
    .then(listResults => recpResults(listResults))
    .catch(err => {
        $('#errMsg').text(`Oops: ${err.message}`); 
    })
}
const responseStuff = [];
function recpResults(res){
    console.log(res);
    responseStuff.push(res);
    const imgs = res.image;
    const title = res.title;

    
        $('.cards').append(`<article class="card" id="recpCard">
     <a href="#">
    <picture class="thumbnail">
     <img src="${imgs}"></picture>
     <div class="card-content">
     <h2>${title}</h2></div></a>
     </article><div class="ingreds displayNone">${'random'}</div>`)
    
};

function recipeCardInfo(){
    $('.cards').on('click', (event) => {
        event.preventDefault();
        
        console.log($(event.target));
    })
}


function searchTerm(){
    $('form').submit(event => {
        event.preventDefault();
        const wordSearch = $('#searchTerm').val();
        getResults(wordSearch);
        $('.getCooking').hide();
        $('.tabContainer').hide();
        $('.mainHead').hide();
        $('.cardContainer').show();
    })
    
}

$(searchTerm);
$(recipeCardInfo);