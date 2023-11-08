<!DOCTYPE html>
<html>
<head>
    <meta name="viewport" content="width=device-width">
    <meta name="theme-color" content="#12ca8c" />
    <title>Unicode Showcase</title>
    <link rel="stylesheet" type="text/css" href="style.css" />
    <link href="https://fonts.googleapis.com/css?family=Noto+Sans:400,700|Lato:700" rel="stylesheet">
    <script type="text/javascript" src="script.js"></script>
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-9JQ0TRRZ1C"></script>
    <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}

    if(localStorage.getItem("cookies") && localStorage.getItem("cookies") == 1) gtag('consent', 'default', { 'analytics_storage': "granted" });
    else gtag('consent', 'default', { 'analytics_storage': "denied" });

    gtag('js', new Date());
    gtag('config', 'G-9JQ0TRRZ1C');
    </script>
    <script>
        window.twttr = (function(d, s, id) {
        var js, fjs = d.getElementsByTagName(s)[0],
        t = window.twttr || {};
        if (d.getElementById(id)) return t;
        js = d.createElement(s);
        js.id = id;
        js.src = "https://platform.twitter.com/widgets.js";
        fjs.parentNode.insertBefore(js, fjs);

        t._e = [];
        t.ready = function(f) {
            t._e.push(f);
        };

        return t;
        }(document, "script", "twitter-wjs"));
        twttr.ready(embed);
    </script>
</head>
<body>
    
    <?php $external_header = 1; $header_style = "white"; include '../components/header.php' ?>
    <style>
        #header{
            background:rgba(0,0,0,0);
            transition:background 250ms;
            font-weight:bold;
            border:none;
            box-shadow:none;
            z-index:1;
        }
        #header.hamburger-open *{ text-shadow:none !important }
        #header.hamburger-open img, #header.hamburger-open svg{ filter:none !important }

        #header *:not(#basket-count){ text-shadow:1px 1px 2px rgba(0,0,0,0.5) }
        #header svg{ filter: drop-shadow(1px 1px 2px rgba(0,0,0,0.5)) }
        #header img{ filter: invert(1) drop-shadow(1px 1px 2px rgba(0,0,0,0.5)) !important }
    </style>
    
    
    <div id="container">
        <h1>The Unicode Showcase</h1>
        <p>Every character you type, and every character you see on the internet, has a unique code,<sup>&#127477;&#127484;</sup> standardised by the Unicode Consortium. As of Unicode 13.0 (March 2020), there's 143,859 of these.</p>
        <p>You probably know the characters 'A' to 'Z'. And 'a' to 'z', too &ndash; you are reading this, after all. There's also '0' to '9', and an array of punctuation marks you're used to. Then there's several hundred emoji characters. <span style="white-space:nowrap">&#128169;&#128569;&#127825;</span></p>
        <p>Maybe you also know a second language that uses a different alphabet. Maybe even a third. But the chances are, you've seen far less than 50% of the valid Unicode characters.</p>
        <p>The Unicode Showcase is a Twitter bot that chooses a random Unicode code point to celebrate every few hours. It generates a gradient background for them and random confetti, and tries hard to find a typeface that supports it.<sup>&#127463;&#127465;</sup></p>
        
        <br/><br/>
        <p class="footnote">&#127477;&#127484; Some characters, such as flags, are actually a combination of more than one character. For example, the flag of Palau is combination of 'Regional Indicator Symbol Letter P' &#127477; and 'Regional Indicator Symbol Letter W' &#127484;.</p>
        <p class="footnote">&#127463;&#127465; In most cases, one of the Noto Sans typefaces is used. Noto is a project by Google which aims to support every language included in Unicode. The name 'Noto' means 'no tofu' &ndash; that's the little box &#9633; that appears when your computer has no font that can display a certain character.</p>
    </div>
    <div id="tweets">
        <div id="load-tweets">
            
        </div>
        <div id="tweets-container"></div>
    </div>
    
    <script>preloadTweets()</script>
</body>
</html>