$(document).ready(() => {
    $("#search").on("submit", function (e) {
        e.preventDefault();
        var keyword = $("#search-input").val();
        var numberOfResults = 4;
        fetchRecipes(keyword, numberOfResults);
    });

    //var APIKey = "74d82ee79a804056882eece5c8be4141";
    var APIKey ="af65a1180d6c40d1a9c24823eae7ac3c";

    function fetchRecipes(keyword, numberOfResults) {

        var dietChoice = $("input[name='diet']:checked");
        var diet = dietChoice.val();
        var queryURL = "https://api.spoonacular.com/recipes/complexSearch?query=" + keyword + "&number=" + numberOfResults + "&diet=" + diet + "&addRecipeInformation=true&fillIngredients=true&apiKey=" + APIKey;
        $.ajax({
            url: queryURL,
            method: "GET",
        })
            .then(function (response) {
                var recipeData = response.results.map(extractData);
                var $recipes = recipeData.map(generateRecipeHtml);
                var recipesContainer = $("#recipeContainer");
                recipesContainer.empty();
                recipesContainer.append($recipes);
            });

        function extractData(apiData) {
            var steps = apiData.analyzedInstructions[0] ? apiData.analyzedInstructions[0].steps : ["not provided"];
            console.log(steps);
            var data = {
                image: apiData.image,
                title: apiData.title,
                ingredients: apiData.missedIngredients.map(ing => ing.originalString),
                instructions: steps.map(step => step.step),
            }
          
            return data;
        }
        function generateRecipeHtml(data) {
            var container = $(`<div class="medium-6 columns text-left">
        <h4>${data.title}</h4>
        <img class="feature-image" src="${data.image}" alt="icon">
        <p class="feature-ingredients">Ingredients: </p>
        <p class="feature-recipe">Instructions: </p>
        </div>`)

            var ingredientsItems = data.ingredients.map(ingredient => $("<li>").text(ingredient))
            var ingredientsList = $("<ul>").append(ingredientsItems);
            container.find(".feature-ingredients").append(ingredientsList);

            var stepItems = data.instructions.map(instruction => $("<li>").text(instruction));
            var stepItemsList = $("<ul>").append(stepItems);
            container.find(".feature-recipe").append(stepItemsList);

            return container;
        }

    }
})

