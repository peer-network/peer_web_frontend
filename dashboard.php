<?php
header('Access-Control-Allow-Origin: *');
include 'phpheader.php';
include 'host.php';
?>
<!DOCTYPE html>
<html lang="de">

<head>
    <link rel="stylesheet" href="css/dashboard.css?<?php echo filemtime('css/dashboard.css'); ?>" />
    <link rel="stylesheet" href="css/modal.css?<?php echo filemtime('css/modal.css'); ?>" />
    <link rel="stylesheet" href="css/scrollshadow.css?<?php echo filemtime('css/scrollshadow.css'); ?>" />

    <!-- <script src="sw_instal.min.js" async></script> -->
    <script src="js/lib.min.js?<?php echo filemtime('js/lib.min.js'); ?>" defer></script>
    <script src="js/audio.js?<?php echo filemtime('js/audio.js'); ?>" async></script>
    <script src="js/posts.js?<?php echo filemtime('js/posts.js'); ?>" defer></script>
    <script src="js/dashboard.js?<?php echo filemtime('js/dashboard.js'); ?>" defer></script>


    <?php
    $beschreibung = 'Peer ist ein blockchainbasiertes soziales Netzwerk. Die Blockchain-Technologie schützt die Privatsphäre der Benutzer:innen und bietet ihnen die Möglichkeit die eigenen Daten kontrolliert zu monetarisieren.';
    include 'meta.min.php';
    ?>
    <title>Dashboard</title>
</head>

<body>
    <div id="config" class="none" data-host="<?php echo htmlspecialchars('https://' . $domain, ENT_QUOTES, 'UTF-8'); ?>"></div>
    <header>
        <svg class="none">
            <symbol id="post-comment" viewBox="0 0 44 45">
                <path
                    d="m4.4 33c0.092-0.449 0.0274-0.915-0.183-1.32-1.42-2.74-2.22-5.86-2.22-9.17 0-3.96 1.17-7.82 3.37-11.1 2.2-3.29 5.32-5.85 8.98-7.37s7.68-1.91 11.6-1.14c3.88 0.772 7.44 2.68 10.2 5.47 2.8 2.8 4.7 6.36 5.47 10.2s0.376 7.9-1.14 11.6c-1.51 3.65-4.08 6.78-7.37 8.98s-7.16 3.37-11.1 3.37c-3.31 0-6.43-0.8-9.17-2.22-0.407-0.21-0.873-0.275-1.32-0.183l-8.94 1.83 1.83-8.94z"
                    fill="none"
                    stroke="#FFFAFA"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="4" />
            </symbol>
            <symbol id="post-like" viewBox="0 0 48 45">
                <path id="mener" d="m34.3 2.5c-4.5 0-8.38 2.66-10.3 6.54-1.95-3.88-5.83-6.54-10.3-6.54-6.45 0-11.7 5.46-11.7 12.2s4 12.9 9.16 17.9 12.8 9.88 12.8 9.88 7.42-4.74 12.8-9.88c5.78-5.48 9.16-11.2 9.16-17.9s-5.22-12.2-11.7-12.2z" stroke-linecap="round" stroke-linejoin="round" stroke-width="4" />
            </symbol>
            <symbol id="post-view" fill="none" viewBox="0 0 56 39">
                <g stroke="#FFFAFA" stroke-linecap="round" stroke-linejoin="round" stroke-width="4">
                    <path d="m36.4 19.5c0 2.22-0.885 4.34-2.46 5.91s-3.71 2.45-5.94 2.45-4.36-0.88-5.94-2.45-2.46-3.69-2.46-5.91c0-2.22 0.885-4.34 2.46-5.91 1.58-1.57 3.71-2.45 5.94-2.45s4.36 0.88 5.94 2.45c1.58 1.57 2.46 3.69 2.46 5.91z" />
                    <path d="m28 37c-11.9 0-21.5-7.17-25.8-17.5 4.36-10.3 14-17.5 25.8-17.5s21.5 7.17 25.8 17.5c-4.36 10.3-14 17.5-25.8 17.5z" />
                </g>
            </symbol>
            <symbol id="multi" viewBox="0 0 100 100">
                <g fill="none" stroke="#00bdff" stroke-linejoin="round" stroke-width="9">
                    <rect x="10" y="10" width="65" height="65" />
                    <rect x="25" y="25" width="65" height="65" />
                </g>
            </symbol>
        </svg>
    </header>

    <article id="dashboard" class="dashboard">
        <header id="header">
            <div id="DashboardHeader" class="header">
                <div class="search-group" id="searchGroup">
                    <input name="searchUser" id="searchUser" type="text" placeholder="@username" aria-label="Search Username" />
                    <div class="divider"></div>
                    <input name="searchTitle" id="searchTitle" type="text" placeholder="~title" aria-label="Search Title" />
                    <div class="divider"></div>
                    <input name="searchTag" id="searchTag" type="text" placeholder="#tag" aria-label="Search Tags" />
                    <img class="lupe" id="searchBtn" src="svg/lupe.svg" alt="search" style="cursor: pointer;"/>
                </div>
                <div class="notify" ><img src="svg/bell.svg" alt="notification icon"></div>
                <div class="postOptions">
                    <div id="everything" class="postOptionsButton" title="show everything">
                        <span>Everything</span>
                        <img src="svg/nofilter.svg" alt="trending" />
                    </div>
                    <div class="postOptionsButton comming-soon" title="my followed">
                        <span>Following</span>
                        <img src="svg/followed.svg" alt="followed" />
                    </div>
                    <div class="postOptionsButton comming-soon" title="your friends like">
                        <span>Friends</span>
                        <img src="svg/friends.svg" alt="friends" />
                    </div>
                </div>
            </div>
        </header>

        <!-- Sidebar -->
        <aside class="sidebar">
            <form id="filter" class="filterContainer">
                    <div class="dash">
                        <img class="logo" src="svg/logo_sw.svg" alt="Peer Network Logo" />
                        <h1 id="h1">Dashboard</h1>
                    </div>
                <div class="filter-sec">
                    <div class="center">
                        &nbsp;Filter
                    </div>
                    <menu class="filter">
                        <div class="filterGroup">
                            <input checked id="filterImage" type="checkbox" name="IMAGE" class="filteritem" />
                            <label for="filterImage" class="filterButton" title="Fotos">
                                <img src="svg/photo.svg" alt="Image filter"/>
                                <span>Photo</span>
                            </label>
                            <input checked id="filterVideo" type="checkbox" name="VIDEO" class="filteritem" />
                            <label for="filterVideo" class="filterButton" title="Video">
                                <img src="svg/videos.svg" alt="Video filter"/>
                                <span>Video</span>
                            </label>
                            <input checked id="filterNotes" type="checkbox" name="TEXT" class="filteritem" />
                            <label for="filterNotes" class="filterButton" title="Notes" name="notes">
                                <img src="svg/text.svg" alt="Notes filter"/>
                                <span>Text</span>
                            </label>
                            <input checked id="filterAdio" type="checkbox" name="AUDIO" class="filteritem" />
                            <label for="filterAdio" class="filterButton" title="Audio">
                                <img src="svg/music.svg" alt="Audio filter"/>
                                <span>Music</span>
                            </label>
                            <!-- <input checked id="filterPodcast" type="checkbox" name="PODCAST" />
                            <label for="filterPodcast" class="filterButton" title="playlist"><img src="svg/filterPodcast.svg" alt="Podcast filter" /></label>
                            <input checked id="filterFickFuck" type="checkbox" name="LOCAL" />
                            <label for="filterFickFuck" class="filterButton" title="local"><img src="svg/filterFickFuck.svg" alt="Local filter" /></label> -->
                        </div>
                        <!-- <div class="filterGroup">
                            <input checked id="filterPolls" class="filterButton" type="checkbox" name="POLLS" />
                            <label for="filterPolls" class="filterButton" title="Polls"><img src="svg/filterPolls.svg" alt="Polls filter" /></label>
                            <input checked id="filterQuiz" type="checkbox" name="QUIZ" />
                            <label for="filterQuiz" class="filterButton" title="Quiz"><img src="svg/filterQuiz.svg" alt="Quiz filter" /></label>
                            <input checked id="filterEvent" type="checkbox" name="EVENT" />
                            <label for="filterEvent" class="filterButton" title="Event"><img src="svg/filterEvent.svg" alt="Event filter" /></label>
                        </div> -->
                    </menu>
                </div>
                <div class="sort-sec">
                    <div class="center">
                        &nbsp;Sort by top values
                    </div>
                    <div class="menu">
                        <div class="filterGroup">
                            <input id="filterMostLiked" sortby="LIKES" class="chkMost" type="radio" name="sortby" />
                            <label for="filterMostLiked" class="filterButton most" title="Sort by most liked">
                                <img src="svg/post-like.svg" alt="MostLiked filter"/>
                                <span>Likes</span>
                            </label>
                            <input id="filterMostCommented" sortby="COMMENTS" class="chkMost" type="radio" name="sortby"/>
                            <label for="filterMostCommented" class="filterButton most" title="Sort by most commented">
                                <img src="svg/post-comment.svg" alt="MostCommented filter"/>
                                <span>Comments</span>
                            </label>
                            <input id="filterMostPopular" sortby="VIEWS" class="chkMost" type="radio" name="sortby" />
                            <label for="filterMostPopular" class="filterButton most" title="Sort by most popular"/>
                                <img src="svg/popular.svg" alt="MostPopular filter">
                                <span>Popular</span>
                            </label>
                            <input id="filterMostControversial" sortby="DISLIKES" class="chkMost" type="radio" name="sortby" />
                            <label for="filterMostControversial" class="filterButton most" title="Sort by most controversial">
                                <img src="svg/controversial.svg" alt="MostControversial filter"/>
                                <span>Discussing</span>
                            </label>
                        </div>
                    </div>
                </div>
                <div class="con-freeaction">
                    <h2>Daily free actions</h2>
                    <div class="limit-container">
                        <div class="label">
                            Likes
                            <span>(</span>
                            <span id="Likesused">&nbsp;</span>
                            <span>/</span>
                            <span id="Likesavailable">&nbsp;</span>
                            <span>&nbsp;left)</span>
                        </div>
                        <div class="progress-bar">
                            <div id="LikesStat" class="progress" style="--progress: 0%;"></div>
                        </div>
                    </div>

                    <div class="limit-container">
                        <div class="label">
                            Comments
                            <span>(</span>
                            <span id="Commentsused">&nbsp;</span>
                            <span>/</span>
                            <span id="Commentsavailable">&nbsp;</span>
                            <span>&nbsp;left)</span>
                        </div>
                        <div class="progress-bar">
                            <div id="CommentsStat" class="progress" style="--progress: 0%;"></div>
                        </div>
                    </div>

                    <div class="limit-container">
                        <div class="label">
                            Posts
                            <span>(</span>
                            <span id="Postsused">&nbsp;</span>
                            <span>/</span>
                            <span id="Postsavailable">&nbsp;</span>
                            <span>&nbsp;left)</span>
                        </div>
                        <div class="progress-bar">
                            <div id="PostsStat" class="progress" style="--progress: 0%;"></div>
                        </div>
                    </div>
                </div>
            </form>
        
        </aside>

        <!-- Main Content Area (Mittlere Spalte mit einem inneren Grid) -->
        <main id="main" class="main">
            <!-- <section class="card" tabindex="0">
                <div class="post">
                    <img src="img/bg.png" alt="">
                </div>
                <div class="post-inhalt">
                    <h1>überschrift</h1>
                    <p class="post-text"> dck fj fjew fkewj wek ewkjwe wkej wkj wkj kjw fkjew wkef sdkc dkc skjd cksjd kjdsc ksjdc skj skj skjd skj skj skjskjkjcdkj skj skj skjsljanclkalka calj kjs dkj </p>
                </div>
                <div class="social">
                    <svg class="">
                        <use href="#post-view" />
                    </svg>
                    <span></span>
                    <svg class="">
                        <use href="#post-like" />
                    </svg>
                    <span></span>
                    <svg class="">
                        <use href="#post-comment" />
                    </svg>
                    <span></span>
                </div>
            </section> -->
        </main>
    <aside class="profil">
        <div id="profil-container">
            <div class="pro-sec">
                <!-- Profil-Bild und Name -->
                <div class="profile-header">
                    <div id="cropContainer" class="cropContainer">
                        <img id="profilbild" src="svg/noname.svg" alt="Profile Picture" class="profile-picture" />
                        <!-- <img id="editProfileImage" src="svg/edit.svg" alt="edit">
                            <img id="cropButton" src="svg/ok.svg" alt="edit"> -->
                    </div>
                    <!-- <div id="badge" class="badge"></div> -->
                    <div class="pro-name">
                        <h2 id="username">&nbsp;</h2>
                        <p id="slug" class="username">&nbsp;</p>
                    </div>
                </div>

                <!-- Statistiken -->
                <div class="stats">
                    <div class="stat">
                        <span id="userPosts">&nbsp;</span>
                        <p>Posts</p>
                    </div>
                    <div class="stat">
                        <span id="followers">&nbsp;</span>
                        <p>Followers</p>
                    </div>
                    <div class="stat">
                        <span id="following">&nbsp;</span>
                        <p>Following</p>
                    </div>
                </div>

                <a href="profile.php" class="view-profil stats">
                    <img src="svg/profile.svg" alt="">
                    <p>View Profile</p>
                </a>
            </div>

            <!-- Menü -->
            <div class="menu stats">
                <a href="dashboard.php" class="menu-item active">
                    <img class="icon" src="svg/icon-dashboard.svg" alt="dashboard" />
                    <p>Dashboard</p>
                </a>
                <a class="menu-item ">
                    <img class="icon" src="svg/icon-messages.svg" alt="messages" />
                    <p>Chats</p>
                    <div class="notification-badge">8</div>
                </a>
                <a href="wallet.php" class="menu-item">
                    <img class="icon" src="svg/wallets.svg" alt="network" />
                    <p>Wallet</p>
                </a>
                <a href="wallet.php" class="menu-item comming-soon">
                    <img class="icon icon-group " src="svg/icon-group.svg" alt="settings" />
                    <p>Settings</p>
                </a>
                <a class="menu-item comming-soon">
                    <img class="icon" src="svg/qmark.svg" alt="network" />
                    <p>How Peer Works</p>
                </a>
            </div>
            <div class="menu stats">
                <div class="menu-item"  id="btAddPost">
                    <img class="icon" src="svg/newpost.svg" alt="network" />
                    <p>Create a post</p>
                </div>
            </div>
        </div>
        <div id="profil-login" class="none">
            <a href="/login.php">login</a>
            <a href="/register.php">register</a>
        </div>
    </aside>
        <div id="footer" class="footer">
            <img src="svg/logo_farbe.svg" alt="loading" />
        </div>
    </article>
    <div id="overlay" class="none scrollable">
        <div id="cardClicked" class="none scrollable">
            <div class="cImg">
                <div id="comment-img-container">
                    <img id="comment-img" src="" alt="" />
                </div>
                <div class="commentsButtons">
                    <div class="postViews">
                        <svg>
                            <use href="#post-view" />
                        </svg>
                        <span id="postViews">234</span>
                    </div>
                    <div class="postViews">
                        <svg>
                            <use href="#post-like" />
                        </svg>
                        <span id="postLikes">234</span>
                    </div>
                    <div id="comments-buttons">
                        <img src="svg/share.svg" class="postViews comming-soon" />
                        <img src="svg/bookmark.svg" class="postViews comming-soon" />
                        <img src="svg/report.svg" class="postViews comming-soon" />
                    </div>
                </div>
                <div id="comment-title"></div>
                <div id="comment-text"></div>
                <div id="tags"></div>
                <!-- <div id="postperformance"></div> -->

            </div>
            <div id="comments-container">
                <div id="comments-header">
                    <div id="mostliked"></div>

                    <div class="flex centvert csum">
                        <span>Comments</span>
                        <svg class="btn">
                            <use href="#post-comment" />
                        </svg>
                        <span id="comment-sum"></span>

                        <div id="addComment" class="icon-add"><img src="svg/plus2.svg" class="icon" alt="add comment" />

                        </div>

                    </div>

                </div>
                <div id="comments" class="comments"></div>
            </div>

        </div>
        <div id="closeComments" class="btClose"><img src="svg/plus2.svg" alt="close" /></div>

        <div id="addPost" class="none scrollable">
            <input id="createImage" type="radio" name="postArt" value="image/*" checked />
            <input id="createNotes" type="radio" name="postArt" value=".txt" />
            <input id="createAudio" type="radio" name="postArt" value="audio/*" />
            <input id="createVideo" type="radio" name="postArt" value="video/*" />
            <input id="createPodcast" type="radio" name="postArt" disabled />
            <input id="createShorts" type="radio" name="postArt" disabled />
            <input id="createPolls" class="filterButton" type="radio" name="postArt" disabled />
            <input id="createQuiz" type="radio" name="postArt" disabled />
            <input id="createEvent" type="radio" name="postArt" disabled />
            <menu class="filter select">
                <div class="center">
                    <h2>Create a new Post</h2>
                    <p>Choose a category to get started:</p>
                </div>
                <div class="filterGroup">
                    <label id="labelCreateImage" for="createImage" class="filterButton" title="Fotos"><img src="svg/filterImage.svg" alt="Image create" /></label>
                    <label id="labelCreateNotes" for="createNotes" class="filterButton" title="Notes" name="notes"><img src="svg/filterNotes.svg" alt="Notes create" /></label>
                    <label id="labelCreateAudio" for="createAudio" class="filterButton" title="Audio"><img src="svg/filterMusic.svg" alt="Audio create" /></label>
                </div>
                <div class="filterGroup">
                    <label id="labelCreateVideo" for="createVideo" class="filterButton" title="Video"><img src="svg/filterVideo.svg" alt="Video create" /></label>
                    <label id="labelCreatePodcast" for="createPodcast" class="filterButton" title="playlist"><img src="svg/filterPodcast.svg" alt="Podcast create" /></label>
                    <label id="labelCreateShorts" for="createShorts" class="filterButton" title="local"><img src="svg/filterFickFuck.svg" alt="Shorty create" /></label>
                </div>
                <div class="filterGroup">
                    <label id="labelCreatePolls" for="createPolls" class="filterButton" title="Polls"><img src="svg/filterPolls.svg" alt="Polls create" /></label>
                    <label id="labelCreateQuiz" for="createQuiz" class="filterButton" title="Quiz"><img src="svg/filterQuiz.svg" alt="Quiz create" /></label>
                    <label id="labelCreateEvent" for="createEvent" class="filterButton" title="Event"><img src="svg/filterEvent.svg" alt="Event create" /></label>
                </div>
            </menu>
            <form id="newImagePost" class="upload" method="post">
                <h2>Upload File</h2>
                <div id="drop-area-image" class="drop-area">
                    <div>
                        <p>Drag and Drop file here</p>
                        <p>
                            or
                            <u>Choose File</u>
                        </p>
                    </div>

                    <img class="filterButton" src="svg/filterImage.svg" alt="Image upload" />
                    <div>
                        <p>Supported formats:</p>
                        <p>.png, .jpg, .jpeg, .gif, .webp</p>
                    </div>

                    <input type="file" id="file-input-image" accept=".png, .jpg, .jpeg, .gif, .webp" hidden multiple />
                </div>
                <p>The maximum file size is 4MB</p>

                <!-- <label for="bildueberschrift">Überschrift:</label> -->
                <input type="text" id="titleImage" placeholder="Add title" name="text-input" maxlength="150" required />
                <!-- <label for="bildbeschreibung">Beschreibung:</label> -->
                <textarea id="descriptionImage" rows="4" placeholder="Write a caption" name="text-input" maxlength="200" required></textarea>
                <div id="preview-image" class="blockscroll preview-container"></div>
                <button class="button" id="createPostImage">Upload</button>
            </form>
            <form id="newNotesPost" class="upload" method="post">
                <input type="text" id="titleNotes" placeholder="Add title" name="text-input" maxlength="150" required />
                <textarea id="descriptionNotes" rows="8" placeholder="What’s on your mind?" name="text-input" maxlength="1200" required></textarea>
                <p>The maximum Text size is 4MB</p>
                <button class="button" id="createPostNotes">Upload</button>
            </form>
            <form id="newAudioPost" class="upload" method="post">
                <h2>Upload music</h2>
                <div id="drop-area-audio" class="drop-area">
                    <div>
                        <p>Drag and Drop file here</p>
                        <p>
                            or
                            <u>Choose File</u>
                        </p>
                    </div>

                    <img class="filterButton" src="svg/filterMusic.svg" alt="Audio upload" />
                    <div>
                        <p>Supported formats:</p>
                        <p>.mp3, .wav, .flac, .aac</p>
                    </div>

                    <input type="file" id="file-input-audio" accept=".mp3, .wav, .flac, .aac" hidden />
                </div>
                <p>The maximum file size is 4MB</p>

                <!-- <label for="bildueberschrift">Überschrift:</label> -->
                <input type="text" id="titleAudio" placeholder="Add title" name="text-input" maxlength="150" required />
                <!-- <label for="bildbeschreibung">Beschreibung:</label> -->
                <textarea id="descriptionAudio" rows="4" placeholder="Write a caption" name="text-input" maxlength="200" required></textarea>
                <h2>Upload cover</h2>
                <div id="drop-area-cover" class="drop-area">
                    <div>
                        <p>Drag and Drop file here</p>
                        <p>
                            or
                            <u>Choose File</u>
                        </p>
                    </div>

                    <img class="filterButton" src="svg/filterImage.svg" alt="Cover upload" />
                    <div>
                        <p>Supported formats:</p>
                        <p>.png, .jpg, .jpeg, .gif, .webp</p>
                    </div>

                    <input type="file" id="file-input-cover" accept=".png, .jpg, .jpeg, .gif, .webp" hidden />
                </div>
                <p>The maximum file size is 4MB</p>
                <div id="preview-cover" class="blockscroll preview-container"></div>
                <div id="preview-audio" class="blockscroll preview-container"></div>
                <button class="button" id="createPostAudio">Upload</button>
            </form>
            <form id="newVideoPost" class="upload" method="post">
                <h2>Upload File</h2>
                <div id="drop-area-video" class="drop-area">
                    <div>
                        <p>Drag and Drop file here</p>
                        <p>
                            or
                            <u>Choose File</u>
                        </p>
                    </div>
                    <img class="filterButton" src="svg/filterVideo.svg" alt="Video upload" />
                    <div>
                        <p>Supported formats:</p>
                        <p>.mp4, .avi, .mov, .webm</p>
                    </div>

                    <input type="file" id="file-input-video" accept=".mp4, .avi, .mov, .webm" hidden />
                </div>
                <p>The maximum file size is 4MB</p>

                <!-- <label for="bildueberschrift">Überschrift:</label> -->
                <input type="text" id="titleVideo" placeholder="Add title" name="text-input" maxlength="150" required />
                <!-- <label for="bildbeschreibung">Beschreibung:</label> -->
                <textarea id="descriptionVideo" rows="4" placeholder="Write a caption" name="text-input" maxlength="200" required></textarea>
                <div id="preview-video" class="blockscroll preview-container"></div>
                <button class="button" id="createPostVideo">Upload</button>
            </form>
            <div class="addTags">
                <h4># Add tags</h4>
                <p>include up to 10 tags</p>
                <input id="tag-input" type="text" placeholder="Search or create tags" />
                <div class="dropdown-content" id="dropdownMenu">
                </div>
                <div id="tagsContainer">

                </div>
                <!-- <button id="tagCreate">+ Create tag</button> -->
            </div>
            <div id="closeAddPost" class="btClose"><img src="svg/plus2.svg" alt="close" /></div>
        </div>
    </div>
    <input type="file" id="profileImageInput" accept="image/*" class="none" />
</body>

</html>