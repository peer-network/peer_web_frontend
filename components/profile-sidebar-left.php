<?php
/**
 * Author: Khalid Meraj
 * Dated: 12 May 2025
 * Usage: This template provides the sidebar navigation for the site.
 * It contains links to different sections of the dashboard, such as chat, profile and settings.
 * The sidebar is included in various pages (e.g., dashboard, chat pages) to provide a consistent navigation experience across the site.
 * The file ensures that the sidebar layout and links are centralized, making future updates easier and maintaining uniformity.
 */
?>

<aside class="sidebar sidebar_profile">
  

  <div class="search-group none" id="searchGroup">
                    <input name="searchUser" id="searchUser" type="text" placeholder="@username" aria-label="Search Username">
                    <div class="divider"></div>
                    <input name="searchTitle" id="searchTitle" type="text" placeholder="~title" aria-label="Search Title">
                    <div class="divider"></div>
                    <input name="searchTag" id="searchTag" type="text" placeholder="#tag" aria-label="Search Tags">
                    <img class="lupe" id="searchBtn" src="svg/lupe.svg" alt="search" style="">
                </div>
   <form id="filter" class="filterContainer">
                    <div class="dash">
                        <img class="logo" src="svg/logo_sw.svg" alt="Peer Network Logo" />
                        <h1 id="h1">Profile</h1>
                    </div>

                    <div class="profile_buttons">
                      <div class="profile_buttons_inner">
                          <a class="button notification" href="#">Notifications</a>
                          <a class="button share_profile" href="#">Share profile</a>
                          <a class="button activity" href="#">Activity</a>
                      </div>  
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
                
            </form>

  <div class="profile_interaction">
    <h3 class="widget_heading">Latest Interactions</h3>
   <div class="profile_interaction_users">

    <div class="user_profile_item">
      <div class="user_thumb"><img src="img/profile_thumb.png" alt="Profile Picture" /></div>
      <div class="user_name">Luisa J...</div>
      <div class="user_profile_id">@lu_mit_</div>
    </div>

    <div class="user_profile_item">
      <div class="user_thumb"><img src="img/profile_thumb.png" alt="Profile Picture" /></div>
      <div class="user_name">Luisa J...</div>
      <div class="user_profile_id">@lu_mit_</div>
    </div>

    <div class="user_profile_item">
      <div class="user_thumb"><img src="img/profile_thumb.png" alt="Profile Picture" /></div>
      <div class="user_name">Luisa J...</div>
      <div class="user_profile_id">@lu_mit_</div>
    </div>

    <div class="user_profile_item">
      <div class="user_thumb"><img src="img/ender.png" alt="Profile Picture" /></div>
      <div class="user_name">Luisa J...</div>
      <div class="user_profile_id">@lu_mit_</div>
    </div>

    <div class="user_profile_item">
      <div class="user_thumb"><img src="img/ender.png" alt="Profile Picture" /></div>
      <div class="user_name">Luisa J...</div>
      <div class="user_profile_id">@lu_mit_</div>
    </div>

    <div class="user_profile_item">
      <div class="user_thumb"><img src="img/ender.png" alt="Profile Picture" /></div>
      <div class="user_name">Luisa J...</div>
      <div class="user_profile_id">@lu_mit_</div>
    </div>


   </div>
  </div>



  
</aside>