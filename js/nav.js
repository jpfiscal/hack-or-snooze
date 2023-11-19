"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  console.debug("navAllStories", evt);
  hidePageComponents();
  start();
  //putStoriesOnPage();
}

$body.on("click", "#nav-all", navAllStories);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}

$navLogin.on("click", navLoginClick);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".main-nav-links").show();
  $navLogin.hide();
  $navLogOut.show();
  $navUserProfile.text(`${currentUser.username}`).show();
}

/** Show submit form on click on $navSubmit */

function navSubmitClick(evt) {
  console.debug("navSubmitClick");
  $("#addStory-form").toggle();
}

$navSubmit.on("click", navSubmitClick);

/** Add or remove story from currentUser's favorites list */
async function handleStoriesClick(evt){
  const parentId = evt.target.parentElement.id;
  if (evt.target.classList.contains('fa-star')){
    addRemoveFavorites(evt);
  } else if (evt.target.classList.contains('fa-trash-can')){
    console.log(`delete this story!`);
    await deleteStory(parentId);
    $(`#${parentId}`).remove();
  }
}
async function addRemoveFavorites(evt){
  const parentId = evt.target.parentElement.id;
  if (evt.target.classList.contains('fa-solid')){
    console.log("this is a favorite!");
    await currentUser.removeFavorite(parentId);
    swapStarFill(evt.target.id, 'fa-solid'); //make the star unfilled
    
  }else if (evt.target.classList.contains('fa-regular')){
    console.log("this isn't a favorite");
    await currentUser.addFavorite(parentId);
    swapStarFill(evt.target.id, 'fa-regular'); //make the star solid
  }
}

/* If the star icon is filled, unfill it, if it's unfilled, fill it*/
function swapStarFill(elementID, curStatus){
  if (curStatus === 'fa-regular'){
    $(`#${elementID}`).removeClass('fa-regular');
    $(`#${elementID}`).addClass('fa-solid');
  }else if (curStatus === 'fa-solid'){
    $(`#${elementID}`).removeClass('fa-solid');
    $(`#${elementID}`).addClass('fa-regular');
  }
}

async function deleteStory(storyId){
  const res = await axios({
    url: `${BASE_URL}/stories/${storyId}`,
    method: "DELETE",
    params: { token: currentUser.loginToken }
  });
  console.log(`deleted story #: ${storyId}`);
}

$storiesContainer.on("click", handleStoriesClick);

/** favorites page **/
$navFavorites.on("click", function(){
  //remove all the story Li's from page
  $allStoriesList.empty();
  //add only the stories that are in the currentUser's 'favorites' list
  for (let story of currentUser.favorites) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }
  $allStoriesList.show();
  markFavoriteStories();
})

/* my stories page */
$navMyStories.on("click", function(){
  //remove all the story Li's from page
  $allStoriesList.empty();
  //add only the stories that are in the currentUser's stories list
  for (let story of currentUser.ownStories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }
  $allStoriesList.show();
  addDeleteBtns();
  markFavoriteStories();
})