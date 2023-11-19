"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story) {
  // console.debug("generateStoryMarkup", story);
  console.log(`story in generateStoryMarkup: ${story}`);
  const hostName = story.getHostName();
  return $(`
      <li id="${story.storyId}">
        <div class="storyContentDiv">
          <i id="star-${story.storyId}" class="fa-regular fa-star"></i>
          <div class="storyDiv">
            <div>
              <a href="${story.url}" target="a_blank" class="story-link">
                ${story.title}
              </a>
              <small class="story-hostname">(${hostName})</small>
            </div>
            <small class="story-author">by ${story.author}</small>
            <small class="story-user">posted by ${story.username}</small>
          </div>
        </div>
        <hr>
      </li>
    `);
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}

/** Submitting the form */
async function submitStory(){
  const user = currentUser;
  const story = {title: $('#inputTitle').val(), author: $('#inputAuthor').val(), url: $('#inputURL').val()}
  console.log(story);
  let submittedStory = await storyList.addStory(user, story); //let instead of const...doest this make a difference here???
  console.log(submittedStory);
} 

$submitStory.on("click", async function(evt){
  evt.preventDefault();
  await submitStory();
  start();
  $submitForm.hide();
});

function addDeleteBtns(){
  $('.storyContentDiv').prepend(`<i class="fa-solid fa-trash-can"></i>`)
}