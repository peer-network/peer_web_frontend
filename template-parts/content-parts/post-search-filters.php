<div class="post-search-filters">
    <div class="search-group" id="searchGroup">
        <div class="search-box">
            <input name="searchUser" id="searchUser" type="text" placeholder="@username" />
            <div class="dropdown" id="userDropdown"></div>
        </div>

        <div class="divider"></div>

        <div class="search-box">
            <input name="searchTitle" id="searchTitle" type="text" placeholder="Title" />
            <div class="dropdown none drop1" id="titleDropdown"></div>
        </div>

        <div class="divider"></div>

        <div class="search-box">
            <input name="searchTag" id="searchTag" type="text" placeholder="#hastags" />
            <div class="dropdown drop2" id="tagDropdown"></div>
        </div>

        <img class="lupe" id="searchBtn" src="svg/lupe.svg" alt="search"/>
        
    </div>
    <div id="userResults" class="user-results"></div>
    <div class="notify" ><img src="svg/bell.svg" alt="notification icon"></div>
    <div class="postOptions none">
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