<?php
header('Access-Control-Allow-Origin: *');
include 'host.php';
?>

<!DOCTYPE html>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Profile Page</title>
    <link rel="stylesheet" href="css/dashboard.css">
    <link rel="stylesheet" href="css/profile.css">
    <link rel="stylesheet" href="css/modal.css">
    <script src="js/lib.min.js?" defer></script>
    <script src="js/posts.js" defer></script>
    <script src="js/profile.js"></script>
    <script src="js/audio.js" async></script>
</head>

<body>
    <div id="config" class="none"
        data-host="<?php echo htmlspecialchars($protocol . '://' . $domain, ENT_QUOTES, 'UTF-8'); ?>"></div>
    <div id="profile-body">
        <article id="dashboard" class="dashboard">
            <div id="profileHeader" class="header">
                <div>
                    <img src="svg/logo_sw.svg" alt="Peer Network Logo" />
                    <h1 id="h1">Profile</h1>
                </div>
            </div>

            <!-- Sidebar -->
            <aside class="sidebar">
                <form id="filter" class="filterContainer">
                    <menu class="filter">
                        <div class="center">
                            <img class="icon" src="svg/filterApply.svg" alt="apply Filter" />
                            &nbsp;apply filter
                        </div>
                        <div class="filterGroup">
                            <input checked id="filterImage" type="checkbox" name="IMAGE" class="filteritem" />
                            <label for="filterImage" class="filterButton" title="Fotos"><img src="svg/filterImage.svg"
                                    alt="Image filter" /></label>
                            <input checked id="filterNotes" type="checkbox" name="TEXT" class="filteritem" />
                            <label for="filterNotes" class="filterButton" title="Notes" name="notes"><img
                                    src="svg/filterNotes.svg" alt="Notes filter" /></label>

                        </div>
                        <div class="filterGroup">
                            <input checked id="filterVideo" type="checkbox" name="VIDEO" class="filteritem" />
                            <label for="filterVideo" class="filterButton" title="Video"><img src="svg/filterVideo.svg"
                                    alt="Video filter" /></label>
                            <input checked id="filterAdio" type="checkbox" name="AUDIO" class="filteritem" />
                            <label for="filterAdio" class="filterButton" title="Audio"><img src="svg/filterMusic.svg"
                                    alt="Audio filter" /></label>
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
                    <!-- <label for="advancedFilter" style="color: white;">advanced filter</label> -->
                    <select id="advancedFilter" class="dark-select comming-soon">
                        <option class="none" name="" disabled selected>advanced filter</option>
                        <!-- <option value="1">was soll hier stehen?</option>
                    <option value="2">und wie siehts aus</option>
                    <option value="2">miau</option>
                    <option value="2">wuff</option> -->
                    </select>

                    <div class="menu">
                        <div class="filterGroup">
                            <input id="filterMostLiked" sortby="LIKES" class="chkMost" type="radio" name="sortby" />
                            <label for="filterMostLiked" class="filterButton most" title="Sort by most liked"><img
                                    src="svg/post-like.svg" alt="MostLiked filter" />Most<br>liked</label>
                            <input id="filterMostCommented" sortby="COMMENTS" class="chkMost" type="radio"
                                name="sortby" />
                            <label for="filterMostCommented" class="filterButton most"
                                title="Sort by most commented"><img src="svg/post-comment.svg"
                                    alt="MostCommented filter" />Most<br>commented</label>
                        </div>
                        <div class="filterGroup">
                            <input id="filterMostPopular" sortby="VIEWS" class="chkMost" type="radio" name="sortby" />
                            <label for="filterMostPopular" class="filterButton most" title="Sort by most popular"><img
                                    src="svg/popular.svg" alt="MostPopular filter" />Most<br>popular</label>
                            <input id="filterMostControversial" sortby="DISLIKES" class="chkMost" type="radio"
                                name="sortby" />
                            <label for="filterMostControversial" class="filterButton most"
                                title="Sort by most controversial"><img src="svg/controversial.svg"
                                    alt="MostControversial filter" />Most<br>controversial</label>
                        </div>
                    </div>
                </form>
            </aside>

            <!-- Main Content Area (Mittlere Spalte mit einem inneren Grid) -->
            <main class="main">
                <div class="profile-layout">
                    <!-- Left Section (30%) -->
                    <div class="profile-left">
                        <!-- Profile Picture and Bio -->
                        <div class="profile-bio">
                            <div class="profile-header">
                                <label id="picture-input">
                                    <img id="profile-picture" onerror="onPictureError('profile-picture')" src=""
                                        class="profile-picture" alt="Profile Picture">
                                    <button id="edit-icon">
                                        ✏️
                                    </button>
                                </label>
                                <input type="file" id="profile-image-upload" class="hidden" accept="image/*">
                                <div class="user-profile">
                                    <div class="user-input">
                                        <h2 id="username-left"></h2>
                                        <label id="validationMessage" for="username-left"></label>
                                        <span class="edit-icon">✏️</span>
                                    </div>
                                    <div class="user-input">
                                        <p id="slug-left"></p>
                                    </div>
                                </div>
                            </div>

                            <!-- Stats -->
                            <div class="stats">
                                <div class="stat">
                                    <span class="amountposts"></span>
                                    <p>Posts</p>
                                </div>
                                <div class="stat">
                                    <span class="amountfollower"></span>
                                    <p>Followers</p>
                                </div>
                                <div class="stat">
                                    <span class="amountfollowed"></span>
                                    <p>Following</p>
                                </div>
                            </div>

                            <!-- Bio -->
                            <div class="bio">
                                <div class="user-input">
                                    <p id="profile-text"></p>
                                    <button id="edit-profile-btn">Edit Profile</button>
                                </div>
                                <span class="edit-icon">✏️</span>
                            </div>
                        </div>

                        <!-- Latest Connections -->
                        <div class="connections">
                            <h4>Latest Connections</h4>
                            <div id="connection-list">

                            </div>
                        </div>
                    </div>

                    <!-- Right Section (70%) -->
                    <div class="profile-right">
                        <div id="user-posts">
                            <!-- <div class="post-container">
                        <div class="post-header">
                            <img src="img/register.jpg" alt="Tyler Jones" class="profile-pic">
                            <div>
                                <h3></h3>
                                <p></p>
                            </div>
                        </div>
                        <div class="post-content">
                            <p></p>
                            <div class="carousel">
                            <button class="prev">&#10094;</button>
                                <div class="carousel-images">
                                    
                                </div>
                                <button class="next">&#10095;</button>
                            </div>
                        </div>
                        <div class="post-footer">
                            <span>👁️</span>
                            <span>❤️</span>
                            <span>💬</span>
                        </div>
                    </div> -->
                        </div>
                    </div>
                </div>
            </main>

            <!-- Extra Content Area (Rechte Spalte) -->
            <aside class="profil">
                <div id="profil-container">
                    <!-- Profil-Bild und Name -->
                    <div class="right-profile-header">
                        <img id="profilbild" onerror="onPictureError('profile-picture')" class="profile-picture"
                            alt="Profile Picture">

                        <!-- <div id="badge" class="badge"></div> -->
                        <h2 id="username-right"></h2>
                        <p id="slug-right" class="username"></p>
                    </div>

                    <!-- Statistiken -->
                    <div class="stats">
                        <div class="stat">
                            <span class="amountposts"></span>
                            <p>Posts</p>
                        </div>
                        <div class="stat">
                            <span class="amountfollower"></span>
                            <p>Followers</p>
                        </div>
                        <div class="stat">
                            <span class="amountfollowed"></span>
                            <p>Following</p>
                        </div>
                    </div>

                    <!-- Menü -->
                    <div class="menu stats">
                        <div class="menu-item">
                            <img class="icon" src="svg/icon-dashboard.svg" alt="dashboard" />
                            <p><a href="dashboard.php"> Dashboard </a></p>
                        </div>
                        <div class="menu-item comming-soon">
                            <img class="icon" src="svg/icon-messages.svg" alt="messages" />
                            <p>Messages</p>
                            <div class="notification-badge">8</div>
                        </div>
                        <div class="menu-item comming-soon">
                            <img class="icon" src="svg/icon-network.svg" alt="network" />
                            <p>Network</p>
                        </div>
                        <div class="menu-item comming-soon">
                            <img class="icon" src="svg/icon-wallet.svg" alt="wallet" />
                            <p>Wallet</p>
                        </div>
                        <!-- Bottom-Icons -->
                        <div class="bottom-icons">
                            <div id="btAddPost" class="icon-add">
                                <!-- <svg class="icon" width="100%" height="100%" viewBox="0 0 100 100">
                                <g fill="none" stroke="#fff" stroke-linecap="round" stroke-width="11">
                                    <path d="m50 10v80" />
                                    <path d="m90 50h-80" />
                                </g>
                            </svg> -->
                                <img class="icon" src="svg/icon-add.svg" alt="add" />
                            </div>
                        </div>
                        <div id="" class="group-icon comming-soon">
                            <img class="icon icon-group comming-soon" src="svg/icon-group.svg" alt="settings" />
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
                    <div id="comment-title"></div>
                    <div id="comment-text"></div>
                    <div id="tags"></div>
                    <div id="postperformance"></div>
                </div>
                <div id="comments-container">
                    <div id="comments-header">
                        <div id="mostliked"></div>
                        <div class="commentsButtons">
                            <div class="postViews">
                                <svg>
                                    <use href="#post-view" />
                                </svg>
                                <span id="postViews">234</span>
                            </div>

                            <div id="comments-buttons">
                                <img src="svg/share.svg" class="postViews comming-soon" />
                                <img src="svg/bookmark.svg" class="postViews comming-soon" />
                                <img src="svg/report.svg" class="postViews comming-soon" />
                            </div>
                        </div>
                        <div class="flex centvert csum">
                            <span>Comments</span>
                            <svg class="btn">
                                <use href="#post-comment" />
                            </svg>
                            <span id="comment-sum"></span>

                            <div id="addComment" class="icon-add"><img src="svg/plus2.svg" class="icon"
                                    alt="add comment" />

                            </div>

                        </div>

                    </div>
                    <div id="comments" class="comments"></div>
                </div>
                <div id="closeComments" class="btClose"><img src="svg/plus2.svg" alt="close" /></div>
            </div>

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
                        <label id="labelCreateImage" for="createImage" class="filterButton" title="Fotos"><img
                                src="svg/filterImage.svg" alt="Image create" /></label>
                        <label id="labelCreateNotes" for="createNotes" class="filterButton" title="Notes"
                            name="notes"><img src="svg/filterNotes.svg" alt="Notes create" /></label>
                        <label id="labelCreateAudio" for="createAudio" class="filterButton" title="Audio"><img
                                src="svg/filterMusic.svg" alt="Audio create" /></label>
                    </div>
                    <div class="filterGroup">
                        <label id="labelCreateVideo" for="createVideo" class="filterButton" title="Video"><img
                                src="svg/filterVideo.svg" alt="Video create" /></label>
                        <label id="labelCreatePodcast" for="createPodcast" class="filterButton" title="playlist"><img
                                src="svg/filterPodcast.svg" alt="Podcast create" /></label>
                        <label id="labelCreateShorts" for="createShorts" class="filterButton" title="local"><img
                                src="svg/filterFickFuck.svg" alt="Shorty create" /></label>
                    </div>
                    <div class="filterGroup">
                        <label id="labelCreatePolls" for="createPolls" class="filterButton" title="Polls"><img
                                src="svg/filterPolls.svg" alt="Polls create" /></label>
                        <label id="labelCreateQuiz" for="createQuiz" class="filterButton" title="Quiz"><img
                                src="svg/filterQuiz.svg" alt="Quiz create" /></label>
                        <label id="labelCreateEvent" for="createEvent" class="filterButton" title="Event"><img
                                src="svg/filterEvent.svg" alt="Event create" /></label>
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

                        <input type="file" id="file-input-image" accept=".png, .jpg, .jpeg, .gif, .webp" hidden
                            multiple />
                    </div>
                    <p>The maximum file size is 4MB</p>

                    <!-- <label for="bildueberschrift">Überschrift:</label> -->
                    <input type="text" id="titleImage" placeholder="Add title" name="text-input" maxlength="150"
                        required />
                    <!-- <label for="bildbeschreibung">Beschreibung:</label> -->
                    <textarea id="descriptionImage" rows="4" placeholder="Write a caption" name="text-input"
                        maxlength="200" required></textarea>
                    <div id="preview-image" class="blockscroll preview-container"></div>
                    <button class="button" id="createPostImage">Upload</button>
                </form>
                <form id="newNotesPost" class="upload" method="post">
                    <input type="text" id="titleNotes" placeholder="Add title" name="text-input" maxlength="150"
                        required />
                    <textarea id="descriptionNotes" rows="8" placeholder="What’s on your mind?" name="text-input"
                        maxlength="1200" required></textarea>
                    <p>The maximum Text size is 4MB</p>
                    <button class="button" id="createPostNotes">Upload</button>
                </form>
                <form id="newAudioPost" class="upload" method="post">
                    <h2>Upload File</h2>
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
                    <input type="text" id="titleAudio" placeholder="Add title" name="text-input" maxlength="150"
                        required />
                    <!-- <label for="bildbeschreibung">Beschreibung:</label> -->
                    <textarea id="descriptionAudio" rows="4" placeholder="Write a caption" name="text-input"
                        maxlength="200" required></textarea>
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
                    <input type="text" id="titleVideo" placeholder="Add title" name="text-input" maxlength="150"
                        required />
                    <!-- <label for="bildbeschreibung">Beschreibung:</label> -->
                    <textarea id="descriptionVideo" rows="4" placeholder="Write a caption" name="text-input"
                        maxlength="200" required></textarea>
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
    </div>
    <div id="access-denied">
        <p>Access Denied!!!!</p>
    </div>
</body>

</html>