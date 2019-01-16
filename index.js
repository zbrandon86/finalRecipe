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


function showResults(query){
    let recpDetails = [ ];
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
        data.results.map(ids => {
            fetch(getRecpURL + `${ids.id}` + '/information', options)
            .then(response =>  {
                if(response.ok) {
                    return response.json();
                }
                throw new Error(response.statusText);
                })
            .then(newStuff => recpDetails.push([newStuff]))
            .catch(err => {
            $('#errMsg').text(`Oops: ${err.message}`);
            });
        })
    })
    recpResults(recpDetails);
};

function recpResults(res){
    console.log(res);
    //         $('.cards').append(`<article class="card">
//     <a href="#">
//     <picture class="thumbnail">
//     <img src="${res.image}"></picture>
//     <div class="card-content">
//     <h2>${res.title}</h2></div></a>
// </article>`)
    
};


function searchTerm(){
    $('form').submit(event => {
        event.preventDefault();
        const wordSearch = $('#searchTerm').val();
        showResults(wordSearch);
        $('.getCooking').hide();
        $('.tabContainer').hide();
        $('.mainHead').hide();
        $('.cardContainer').show();
    })
    
}

$(searchTerm);