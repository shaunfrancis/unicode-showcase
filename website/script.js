function preloadTweets(){
    var h = window.innerHeight - 55;
    var n = Math.ceil(h / 428);
    for(i=0;i<n;i++){
        makeTweet();
    }
}

function makeTweet(){
    var tweet = makeDiv('tweet');
    var icon = makeDiv('tweet-icon');
    var nameContainer = makeDiv('tweet-name-container');
    var name = makeDiv('tweet-name');
    var handle = makeDiv('tweet-handle');
    var image = makeDiv('tweet-image');
    
    name.innerHTML = "Unicode Showcase";
    handle.innerHTML = "@UnicodeShowcase";
    
    nameContainer.appendChild(name);
    nameContainer.appendChild(handle);
    
    tweet.appendChild(icon);
    tweet.appendChild(nameContainer);
    tweet.appendChild(image);
    
    document.getElementById('load-tweets').appendChild(tweet);
}

function makeDiv(classification){
    var el = document.createElement('div');
    el.classList.add(classification);
    return el;
}

function embed(){
    var tweets = document.getElementById('tweets-container');
    
    var h = window.innerHeight - 55;
    twttr.widgets.createTimeline(
      {
        sourceType: 'profile',
        screenName: 'UnicodeShowcase'
      },
      tweets,
      {
        width: '500',
        height: h,
        chrome: 'noheader nofooter transparent noborders'
      }).then(function (el) {
        tweets.style.opacity = 1;
        document.getElementById('load-tweets').style.opacity = 0;
      });
}